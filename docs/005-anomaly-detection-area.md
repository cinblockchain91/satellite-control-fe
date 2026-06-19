# ADR 005 — Anomaly Detection Arena

**Status:** Accepted  
**Date:** 2026-06-19  
**Milestone:** Add an "Anomaly Detection Arena"

## Context

The Telemetry Tunnel (ADR 003) introduced `TelemetryStreamState` (`nominal / warning / critical`) to answer **how severe** a satellite's condition is. That vocabulary is sufficient for beam colours and particle effects, but it does not tell the operator **what is wrong** — a distinction that becomes essential when multiple satellites have simultaneous issues requiring different responses.

This ADR defines the named anomaly taxonomy that the Anomaly Detection Arena builds on. Every subsequent issue in the milestone (#108–#116) consumes the types and detection function introduced here.

Key constraints (unchanged from ADR 003):

- Must work without a live backend — mock data must be sufficient for demo
- Visual states must be immediately readable without reading numeric values
- Threshold logic must be the single source of truth for both 3D visuals and sidebar panels
- Frontend does not re-implement backend scoring logic; it classifies from individual metrics

## Decisions

### 1. `AnomalyType` as a widget-layer type, not an entity-layer type

`AnomalyType` lives in `widgets/anomaly-arena/anomaly-detection.ts`, following the exact same pattern as `TelemetryStreamState` in `widgets/telemetry-tunnel/telemetry-stream.ts`.

**Why widget layer, not entity layer:** Anomaly classification is a frontend display decision — it determines how the 3D scene highlights a satellite and what label the detail panel shows. The entity layer records what the backend sends; it does not encode UI opinions. A future backend may send its own named anomaly types with different vocabulary — at that point, entity types would be added and the `detectAnomalies()` call site replaced.

**Backend swap point:** When the backend provides named anomaly types, replace the call to `detectAnomalies(satellite.telemetry, satellite.status)` in the arena shell with `satellite.anomalies` from the API response. No changes are required in 3D components or panels — they consume `AnomalyDetection[]` regardless of origin.

### 2. Four anomaly scenarios for the initial milestone

| Type | Trigger metric | Detection direction | Severity levels |
|------|---------------|--------------------|----|
| `signalDrop` | `signalStrength` | lower is worse | warning / critical |
| `overheating` | `temperature` | higher is worse | warning / critical |
| `unstableOrbit` | `anomalyLevel` (proxy) | higher is worse | warning / critical |
| `communicationLoss` | `signalStrength` + `status` | offline + signal ≤ 5 | critical only |

**Why `communicationLoss` is always critical:** When a satellite is fully unreachable, no other telemetry readings can be trusted. The early-return pattern in `detectAnomalies()` reflects this: if communication is lost, other anomalies are suppressed — not because they don't exist, but because they cannot be verified.

**Why `unstableOrbit` uses `anomalyLevel` as a proxy:** The frontend has no access to raw orbital elements beyond the static `SatelliteOrbit` parameters (radius, inclination, RAAN). Real orbit instability — altitude decay, RAAN drift, eccentricity growth — is detected server-side and encoded in the backend-computed `anomalyLevel`. The frontend classifies `unstableOrbit` only when `anomalyLevel` is elevated AND `signalStrength` and `temperature` are nominal, preventing misclassification of anomalies that have a clearer cause.

### 3. `ANOMALY_THRESHOLDS` as single source of truth

```
communicationLoss: signalStrength ≤ 5  (offline only)
signalDrop:        warning < 60,  critical < 30
overheating:       warning > 45°C, critical > 60°C
unstableOrbit:     warning > 20,  critical > 50   (anomalyLevel proxy)
                   only fires when signal ≥ 60 AND temperature ≤ 45
```

**Relationship to `METRIC_THRESHOLDS`:** `signalDrop` and `overheating` thresholds numerically match the corresponding entries in `METRIC_THRESHOLDS` (telemetry-stream.ts). They are kept separate because stream-state classification (`nominal / warning / critical`) and anomaly-type detection are distinct concerns that may diverge. Cross-widget imports between `anomaly-arena` and `telemetry-tunnel` would couple two independent FSD slices; duplication is intentional.

### 4. camelCase `AnomalyType` values for direct i18n key mapping

Type values (`"signalDrop"`, `"overheating"`, `"unstableOrbit"`, `"communicationLoss"`) are camelCase so components can call `t(\`type.${anomaly.type}\`)` using `useTranslations("anomalyArena")` without any intermediate mapping function.

This is consistent with the existing status and state vocabulary (`"online"`, `"warning"`, `"nominal"`, etc.).

### 5. Type-identity colors via `ANOMALY_VISUAL_RULES`

Each anomaly type has a single identifying color used in 3D highlights, legend chips, and orbit-path tinting:

| Type | Color | Rationale |
|------|-------|-----------|
| `signalDrop` | `#eab308` yellow-500 | Matches existing warning palette |
| `overheating` | `#f97316` orange-500 | Heat association; distinct from warning yellow |
| `unstableOrbit` | `#a855f7` purple-500 | Unique hue, no collision with status or severity colors |
| `communicationLoss` | `#ef4444` red-500 | Matches existing critical / offline palette |

Severity colors (`ANOMALY_SEVERITY_COLORS`) are separate — `warning: #eab308`, `critical: #ef4444` — matching the existing stream-state and status-color conventions across the product.

**Animation parameters are deferred to Issue #114.** `ANOMALY_VISUAL_RULES` intentionally omits pulse speed and glow radius; those constants belong in the animation issue where the Three.js implementation will consume them.

### 6. `detectAnomalies()` as a pure function

```typescript
detectAnomalies(telemetry: SatelliteTelemetry, status: SatelliteStatus): AnomalyDetection[]
```

- No side effects — safe to call inside `useMemo` or a throttled `useFrame`
- Returns `[]` for fully nominal satellites (no special null/undefined handling at call sites)
- Prioritised detection: `communicationLoss` returns early; `signalDrop`, `overheating`, and `unstableOrbit` accumulate (multi-anomaly is valid)
- All threshold values referenced by name from `ANOMALY_THRESHOLDS`

### 7. i18n namespace: `anomalyArena`

New top-level namespace added to `packages/shared/i18n/en.json` and `vi.json`:

```json
"anomalyArena": {
  "type": {
    "signalDrop": "Signal Drop",
    "overheating": "Overheating",
    "unstableOrbit": "Unstable Orbit",
    "communicationLoss": "Communication Loss"
  },
  "severity": {
    "warning": "Warning",
    "critical": "Critical"
  }
}
```

`severity.*` keys are included even though equivalent keys exist in `telemetryPanel.status` — the anomaly arena panels may need severity labels in contexts where importing from `telemetryPanel` would be semantically wrong.

## Consequences

- `widgets/anomaly-arena/` is established as the FSD boundary for all arena components; future issues add files alongside `anomaly-detection.ts`
- `detectAnomalies()` is the contract between the data layer and every visual/panel component in the arena — do not inline threshold logic in 3D components
- Mock data (Issue #113) must include at least one satellite with nominal `signalStrength` and `temperature` but elevated `anomalyLevel` to demonstrate `unstableOrbit` detection; no current `MOCK_SATELLITES` entry triggers this path
- When a real backend arrives: if it returns named anomaly types, add a `SatelliteAnomalySchema` at the API boundary and replace `detectAnomalies()` at the call site — no changes to arena components required
- `AnomalyDetection` has no optional properties (`exactOptionalPropertyTypes: true` compliant)

### 8. Scene architecture for issue #108

The arena scene follows the same shell pattern as all other 3D views:

```
Route page.tsx (Server Component, sets metadata)
  → AnomalyArenaPage (thin wrapper, views/)
    → AnomalyArenaShell ("use client", views/)
      → SceneCanvasLazy (defers R3F to client bundle)
        → AnomalyArenaScene (forwardRef R3F scene, widgets/)
```

**Feature flag:** `NEXT_PUBLIC_FEATURE_ANOMALY_ARENA=true` gates the nav item in `AppSidebar`. The route itself is always accessible when the flag is set; no server-side route guard is implemented (consistent with other feature-flagged routes).

**Camera:** Initial position `[0, 4, 7]` looking at `[0, 0, 0]`. The elevated angle gives simultaneous visibility of all orbital rings and alert regions. `setLookAt` is called in `useEffect([], [])` on mount to override the `SceneCanvas` default `[0, 0, 5]`.

**Scene atmosphere:** Background `#04060d` (much deeper than Mission Control's dark navy) and cool bluish-white directional light `#e8eeff` at 1.2 intensity reinforce a crisis/alert-zone feel distinct from the fleet-monitoring mood of the Digital Twin.

**Arena floor ring:** Torus with `radius=4.5`, `tube=0.008`, color `#1a1a3e` at 50% opacity. Visually traces the satellite zone boundary without dominating the scene.

**Satellite rendering strategy:**
- Anomalous satellites: full opacity, emissive glow (idle 0.3 → hovered 0.5 → selected 0.9), solar panels rendered.
- Nominal satellites: 15% opacity, no emissive, no solar panels — visually subordinate so alert focus is immediate.

**`AnomalyArenaSceneHandle`:** Exposes `resetView()` so the shell's "Reset view" button can fly the camera back to `[0, 4, 7]` without the shell knowing R3F internals.

### 9. Visual highlighting for issue #109

**Pulse animation** — all anomalous satellites animate continuously to draw pre-attentive attention:

- **`AnomalySatellite` body glow:** emissive intensity oscillates via sine wave between `PULSE_EMISSIVE_MIN (0.15)` and `PULSE_EMISSIVE_MAX (0.45)` at rest. Interaction states override: hovered → `EMISSIVE_HOVERED (0.5)`, selected → `EMISSIVE_SELECTED (0.9)`.
- **`AlertRegion` ring breathe:** scale oscillates `1.0 → 1.15` and opacity `0.3 → 0.5` in sync with the satellite's pulse.
- **Severity-driven frequency:** `warning → 0.5 Hz` (pulse every 2 s); `critical → 1.2 Hz` (pulse every ~0.8 s). Faster rhythm for critical anomalies exploits pre-attentive temporal contrast — the eye is drawn to the highest-frequency motion first.

All pulse constants are hardcoded inline; Issue #114 extracts them as named animation constants once the full animation budget is known.

**`AnomalyArenaScene` change:** `satelliteAnomalies` useMemo now captures `anomalySeverity: AnomalySeverity | null` alongside `anomalyColor`. Both `AnomalySatellite` and `AlertRegion` receive severity as a prop. `AlertRegion` only renders when `anomalySeverity !== null` — TypeScript-safe narrowing, no assertions needed.

**No post-processing bloom:** emissive intensity on a `#04060d` background provides sufficient glow illusion without the GPU cost of a full-screen Bloom pass. Bloom can be evaluated in #114 once a performance baseline is established.

### 10. Severity badge for issue #110

`SeverityBadge` is a `"use client"` presentational component in `widgets/anomaly-arena/` that renders `AnomalySeverity` as a shadcn `Badge`:

| Severity | Badge variant | Color | Icon |
|---|---|---|---|
| `warning` | `outline` + yellow override | `border-yellow-500/40 bg-yellow-500/10 text-yellow-600` | `AlertTriangleIcon` |
| `critical` | `destructive` (built-in) | `bg-destructive/10 text-destructive` | `AlertOctagonIcon` |

Icons carry `aria-hidden="true"` — the translated text label is the accessible content. The component owns its own `useTranslations("anomalyArena")` call to ensure every consumer uses the same `severity.{warning|critical}` key; callers must not supply their own label string.

**Intentional decision — 2 levels, not 4:** The issue description listed `low / medium / high / critical`. The implementation keeps `warning / critical` to preserve the `AnomalySeverity` contract from Issue #107. Extending to 4 levels would require re-calibrating `detectAnomalies()` thresholds — a scope that belongs to a dedicated ADR revision, not a visualization issue. Stakeholder mapping: `low ≈ medium ≈ warning`; `high ≈ critical`.

**Consistency:** `SeverityBadge` is the single rendering path for severity in all 2D surfaces (detail panel #112, timeline #111, filter chips #115). 3D surfaces continue to use type-identity colors (`ANOMALY_VISUAL_RULES`) so operators know *what* is wrong; 2D surfaces use severity colors so operators know *how urgent* it is.

### 11. Alert timeline for issue #111

**`AlertEvent` type** (`widgets/anomaly-arena/alert-events.ts`) — a flat, non-branded model:

```typescript
interface AlertEvent {
  id: string;          // "${satelliteId}-${type}" — stable React key
  satelliteId: string; // non-branded so the timeline has no SatelliteId dependency
  satelliteName: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  detectedAt: Date;
}
```

**`buildAlertEvents(satellites, now)`** — pure function, injected `now: number` for testability. Derives events from `detectAnomalies()`, assigns mock relative timestamps (3 min per satellite × anomaly index), and sorts: critical first, then most-recent within same severity. 10 unit tests cover empty fleet, single/multi-anomaly, id uniqueness, sort order, and timestamp correctness.

**`AlertTimeline`** — `"use client"` widget-layer component. Owns a `<section>` with header (`<h2>` + event count) and scrollable `<ol>` of event rows. Each row is a `<button>` with `aria-pressed` for the selection state and a `<time dateTime={...}>` for machine-readable timestamps. Uses `SeverityBadge` and `t("type.*")` for consistent labelling. Empty state shows `timeline.empty`. `MAX_VISIBLE_EVENTS = 50` limits render; no virtual scroll needed at mock scale.

**Layout change in `AnomalyArenaShell`:** Added a `<aside>` (`w-72`, `hidden md:flex`) beside the scene canvas. Hidden on small screens (scene needs the space); appears from `md:` breakpoint. `events` computed once via `useMemo(() => buildAlertEvents(MOCK_SATELLITES, Date.now()), [])` — frozen at mount, appropriate for static mock data.

**Clicking a timeline row selects the satellite** — `onSelect(event.satelliteId)` feeds into the same `selectedId` state as the 3D scene, so the corresponding satellite highlights immediately.

**Backend swap point:** replace the `useMemo` body with a `useQuery` call to `/api/anomalies` when the event stream is ready. `AlertTimeline` and `AlertEvent` are unchanged.

**i18n:** added `anomalyArena.timeline.title` and `anomalyArena.timeline.empty` in EN + VI.

### 12. Anomaly detail panel for issue #112

**`AnomalyDetailPanel`** is a `"use client"` widget-layer component that shows the full context for every anomaly on the selected satellite.

**Props:**
```typescript
interface AnomalyDetailPanelProps {
  selectedId: string | null;      // satellite id — string, not branded
  events: AlertEvent[];           // all timeline events; filtered internally
  allSatellites: Satellite[];     // injected for testability; backend swap point
  onClose: () => void;            // resets selectedId to null in the shell
}
```

**Data derivation:**
1. `allSatellites.find(s => s.id === selectedId)` — locate the satellite
2. `detectAnomalies(satellite.telemetry, satellite.status)` — live detection, same call as the 3D scene
3. `events.filter(e => e.satelliteId === selectedId)` indexed by type — supply timestamps per anomaly

**Layout (within the right `<aside>`):**
```
<aside w-80 flex-col>
  <AnomalyDetailPanel />    ← shrink-0; compact strip when nothing selected
  <AlertTimeline />         ← min-h-0 flex-1; scrolls internally
</aside>
```

No-selection state: a single compact row (`CrosshairIcon` + "Select a satellite to inspect") so the timeline below is unaffected.

Selected state: `max-h-[55vh] overflow-y-auto` section with:
- Header: "Anomaly Details" title + close button (`XIcon`) that calls `onClose`
- Satellite row: status dot (Tailwind bg-* class keyed to `STATUS_DOT_CLASS`) + name + translated status label
- One `<li>` per detected anomaly, each showing:
  - Type-identity colour dot (`ANOMALY_VISUAL_RULES[type].color`) + type label + `SeverityBadge`
  - Detection time (`<time dateTime suppressHydrationWarning>`) from the corresponding `AlertEvent`
  - Metric/value/threshold line (`data-testid="anomaly-detail-metric"`)
  - Suggested action box (`LightbulbIcon` + `data-testid="anomaly-detail-action"`)

**Suggested actions** — one i18n key per anomaly type (`anomalyArena.detail.action.*`):

| Type | EN action |
|---|---|
| `signalDrop` | Inspect antenna alignment or check for signal interference |
| `overheating` | Reduce computational load or adjust thermal management system |
| `unstableOrbit` | Schedule an orbital correction maneuver |
| `communicationLoss` | Attempt emergency reconnection or switch to backup communication link |

**Shell change:** `<aside>` widened from `w-72` to `w-80`; `AnomalyDetailPanel` inserted above `AlertTimeline` in the vertical flex column.

**9 component tests** cover: no-selection state (null and non-matching id), satellite name, single/multi-card count, `onClose` call, `<time dateTime>` attribute, metric text content, and suggested action i18n key.

## Deferred items

| # | Item | Status |
|---|------|--------|
| 1 | Anomaly arena scene / mode toggle | ✅ Done — Issue #108 |
| 2 | 3D satellite + orbit highlighting | ✅ Done — Issue #109 |
| 3 | Severity level UI (badges, chips) | ✅ Done — Issue #110 |
| 4 | Alert timeline / event stream | ✅ Done — Issue #111 |
| 5 | Anomaly detail panel | ✅ Done — Issue #112 |
| 6 | Mock anomaly events (includes unstableOrbit satellite) | Issue #113 |
| 7 | Animation constants (pulse speed, glow radius) | Issue #114 |
| 8 | Filtering and focus mode | Issue #115 |
| 9 | Demo version (scripted sequence) | Issue #116 |
