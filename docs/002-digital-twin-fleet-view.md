# ADR 002 — Digital Twin Fleet View

**Status:** Accepted  
**Date:** 2026-06-11  
**Milestone:** Implement a "Digital Twin" Fleet View

## Context

The satellite control dashboard needed a dedicated 3D fleet view showing each satellite's live status — battery, signal strength, temperature, and overall health — with intuitive visual cues so operators can assess fleet health at a glance without reading text labels.

Key constraints:
- Data model must be reusable across future mobile and desktop apps in the monorepo
- Visual status must be immediately readable in a dark 3D scene
- The feature should be deployable independently behind a feature flag
- Mock data must be sufficient for demo without a live backend

## Decisions

### 1. Satellite entity lives in `packages/entities/satellite/`

Following the same pattern as `packages/entities/account/`, the `Satellite` type, `SatelliteStatus`, `SatelliteTelemetry`, and `SatelliteSchema` (Zod) are defined in a dedicated workspace package rather than inside the web app widget.

**Why:** `Satellite` is a domain concept, not a web-specific concept. Future `apps/mobile/` and `apps/desktop/` will import the same entity without any platform-specific code in it. The package contains only TypeScript types and Zod validation — no React, no browser APIs.

Mock data (`MOCK_SATELLITES`) stays in the widget layer (`widgets/mission-control-scene/satellites.data.ts`) since it is an implementation detail of the web app, not a domain concern.

### 2. `SatelliteStatus` has four levels: `online | warning | degraded | offline`

Three states (`online | warning | offline`) were insufficient — an intermediate `degraded` level is needed to distinguish satellites that are still functioning but declining from those that are fully offline.

| Status | Color | Meaning |
|--------|-------|---------|
| `online` | `#22c55e` green | Nominal operation |
| `warning` | `#eab308` yellow | Needs monitoring |
| `degraded` | `#f97316` orange | Actively declining, intervention likely needed |
| `offline` | `#ef4444` red | No signal, unresponsive |

### 3. `healthScore` (0–100) as a telemetry field, not a derived value

`healthScore` is stored as an explicit field on `SatelliteTelemetry` rather than computed from battery/signal/temperature at render time.

**Why:** A real backend would compute this server-side using proprietary weighting logic. Storing it as a field keeps the frontend passive — it displays what it receives without re-implementing backend business logic. The Zod schema enforces `min(0).max(100)`.

**Display convention (FE only):** The UI color-codes healthScore into three bands: ≥ 70 → green (normal), 40–69 → yellow (caution), < 40 → red (critical). These thresholds are a frontend display decision, independent of the status field and unrelated to any backend scoring logic. A satellite can be `status: "warning"` with `healthScore: 72` (declining but not yet critical by score) — both values are shown separately.

### 4. Status-driven pulse animation, not health-driven

Visual pulse effects in the 3D scene are keyed to `status`, not `healthScore`:

| Status | 3D effect |
|--------|-----------|
| `online` | Static, no glow |
| `warning` | Slow pulse (1.5 Hz, max intensity 0.18) |
| `degraded` | Fast pulse (3 Hz, max intensity 0.35) |
| `offline` | Static, opacity 0.45 (dim) — no pulse |

**Why:** An earlier iteration keyed pulse to `healthScore < 50`. This caused `warning` satellites with health slightly above 50 to not pulse, and `offline` satellites to pulse the fastest — semantically wrong. A dead satellite does not broadcast distress. Pulse means "alive but urgent"; dim means "gone".

All emissive intensity is controlled imperatively via `useRef<THREE.MeshStandardMaterial>` inside `useFrame` to avoid React reconciler overhead at 60 fps.

### 5. Digital twin as a top-level route `/digital-twin/`, not nested under `/dashboard/`

The digital twin is a distinct operational view, not a sub-page of the general overview dashboard. It lives at `/[locale]/digital-twin/` with its own layout (sidebar + header) that mirrors the dashboard layout structure.

**Why:** Nesting it under `/dashboard/digital-twin/` would imply it is a drill-down within the dashboard. Operationally, the digital twin is a peer view — an operator navigates *to* it, not *into* the dashboard for it. The sidebar link treats them as peers under "Platform".

### 6. Feature flag baked at build time via `NEXT_PUBLIC_FEATURE_DIGITAL_TWIN`

The sidebar link to the digital twin view is conditionally rendered based on `env.featureDigitalTwin`. Setting `NEXT_PUBLIC_FEATURE_DIGITAL_TWIN=true` at build time enables it.

**Why:** `NEXT_PUBLIC_*` variables are inlined into the client bundle at build time by Next.js. This is intentional — the feature flag controls UI visibility, not server behaviour. The route itself always exists and is auth-protected by middleware regardless of the flag.

**Consequence:** Changing the flag requires a new deployment. This is acceptable for a feature-gate rollout but means the flag cannot be toggled without redeploy.

### 7. Camera control UX: hint bar + reset button only, no zoom UI buttons

Dedicated zoom buttons (+ / −) were considered and rejected. `CameraControls` from `@react-three/drei` already handles scroll-to-zoom (desktop) and pinch-to-zoom (touch) natively and stably. Adding UI buttons would be redundant and clutter the interface.

The chosen approach:

| Element | Purpose |
|---------|---------|
| Hint bar (text) | Onboard first-time users — "Drag to rotate · Scroll to zoom" (desktop) or "Drag to rotate · Pinch to zoom" (touch) |
| Reset button | Single escape hatch for users who lose their orientation in the 3D scene |

**Touch detection:** `navigator.maxTouchPoints > 0` in a `useEffect` (after hydration) selects the correct hint variant. Default before mount is the desktop hint to avoid hydration mismatch.

**Encapsulation:** `MissionControlScene` uses `forwardRef` + `useImperativeHandle` to expose a `CameraControlsHandle` API (`resetView()`). The shell and overlay layer never import Three.js or drei types directly — all camera logic stays inside `widgets/mission-control-scene/`.

**Reset behaviour:** Resets camera to `[0,0,5]` looking at origin AND deselects any selected satellite, returning operator to full-fleet view.

**i18n:** All hint and button text lives under `digitalTwin.cameraControls.*` in shared i18n messages.

### 8. Fleet legend is a DOM overlay, not a Three.js object

The status color legend is rendered as a fixed DOM overlay (bottom-left) using standard React + Tailwind. It is NOT rendered via `<Html>` from `@react-three/drei` or as any Three.js object.

**Why:** The legend is a fixed-position UI element — it has no 3D position, no depth relationship with scene objects. Using `<Html>` for it would tie a UI widget to the R3F renderer context unnecessarily, complicating testing and accessibility.

`FleetLegend` lives in `widgets/mission-control-scene/` because it is conceptually tied to the scene's visual vocabulary (status colors), even though it is a DOM component. It imports `STATUS_COLORS` from `satellites.data.ts` as the single source of truth for color values.

### 9. Fleet summary uses 4 buckets, not 3

The summary breakdown shows `online / warning / degraded / offline` as four separate counts. The issue spec uses the term "healthy" which maps to `online`. Grouping `warning + degraded` into one bucket was rejected because:

- `warning` = needs monitoring (ADR section 2)
- `degraded` = intervention likely needed (ADR section 2)

These have different operational urgency. Collapsing them removes the signal that operators need. A single "Warning" number masks whether the fleet is under routine watch or actively degrading.

`countByStatus()` is extracted as a pure function in `widgets/telemetry-panel/count-by-status.ts` for unit-testability independent of React.

`TelemetryPanel` accepts a `satellites?: Satellite[]` prop. Counts are computed from it directly — not from `useLiveTelemetry` — so the breakdown always reflects actual satellite states rather than simulated drift averages.

### 10. `useLiveTelemetry` derives fleet averages from satellite data, not hardcoded snapshots

`useLiveTelemetry(satellites)` accepts a `readonly Satellite[]` param and computes fleet averages (signal strength, battery, temperature) from it. A sinusoidal drift (`Math.sin(tick * speed) * amplitude`) is applied per metric to simulate live sensor variance without a backend.

The hook no longer contains hardcoded snapshots. `buildSnapshot(satellites, tick)` is extracted as a pure function in `telemetry-snapshot.ts` (no React imports) to enable unit testing independent of the hook lifecycle.

**Swap point for real API:** When a backend is available, replace `useLiveTelemetry` with a TanStack Query hook (`useQuery`) that fetches from the satellite telemetry endpoint. The `TelemetrySnapshot` interface is the contract — `TelemetryPanel` does not need to change.

## Consequences

- `@satellite-control/entity-satellite` is a new workspace package; any app in the monorepo can depend on it
- `SatelliteStatus` and `SelectedSatelliteInfo` must stay in sync — `SAT_STATUS_CLASS` in `TelemetryPanel` and i18n `satelliteDetail.status.*` keys must cover all four statuses
- `FleetLegend` replaces the `legendPlaceholder` div in `DigitalTwinShell`; the placeholder comment and `digitalTwin.legendPlaceholder` i18n key are now obsolete but kept for backwards compat until a full cleanup pass
- All 3D visual logic remains in `widgets/mission-control-scene/` — no Three.js code in the entity or feature layers
- `MissionControlScene` is now a `forwardRef` component; consumers must type their ref as `CameraControlsHandle` from the widget index
- `TelemetryPanel` and `TelemetryDrawer` now accept an optional `satellites` prop; when omitted, the status breakdown is hidden
