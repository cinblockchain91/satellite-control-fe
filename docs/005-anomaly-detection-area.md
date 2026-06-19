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

## Deferred items

| # | Item | Status |
|---|------|--------|
| 1 | Anomaly arena scene / mode toggle | Issue #108 |
| 2 | 3D satellite + orbit highlighting | Issue #109 |
| 3 | Severity level UI (badges, chips) | Issue #110 |
| 4 | Alert timeline / event stream | Issue #111 |
| 5 | Anomaly detail panel | Issue #112 |
| 6 | Mock anomaly events (includes unstableOrbit satellite) | Issue #113 |
| 7 | Animation constants (pulse speed, glow radius) | Issue #114 |
| 8 | Filtering and focus mode | Issue #115 |
| 9 | Demo version (scripted sequence) | Issue #116 |
