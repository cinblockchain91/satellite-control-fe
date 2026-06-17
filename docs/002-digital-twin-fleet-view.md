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

### 11. Performance monitoring: PerformanceMonitor + low-FPS warning

The scene already runs at 60 FPS with 6 satellites and no optimization was needed. The deliverable is monitoring infrastructure to detect degradation before a demo is affected.

**Performance budget:**

| Resource | Budget | Current |
|----------|--------|---------|
| Meshes | ≤ 50 | 16 (6 sats × 2 + 3 rings + 1 Earth) |
| Lights | ≤ 2 | 2 (ambient + directional) |
| Stars | ≤ 5000 | 4000 |
| FPS target | 60 | 60+ ✅ |

**Warning threshold:** < 30 FPS sustained over 3 consecutive ticks (~3 seconds).

**Architecture:** `PerformanceMonitor` lives inside the R3F `<Canvas>` in `MissionControlScene` and uses `useFrame` to sample FPS every 60 frames (~1s). It emits an `onLowFps(boolean)` callback to the shell. `DigitalTwinShell` owns a `isLowFps` state and renders a DOM badge overlay when true.

**Accumulator pattern:** `setState` is called at most once per second (every 60 frames), never every frame. All intermediate state is held in `useRef` to avoid React reconciler pressure at 60 fps.

**`computeFps(elapsed, frameCount)`** is extracted as a pure function in `compute-fps.ts` for unit-testability independent of R3F.

**Warning suppression:** The badge only appears after 3 consecutive low-FPS ticks to avoid false positives when the tab loses and regains focus.

**`<Stats>`** from drei remains development-only for real-time debugging overlay. `PerformanceMonitor` handles warning in any environment.

### 12. Milestone 2 — Deferred improvements for future milestones

The following items were evaluated and intentionally deferred. They do not block the Milestone 2 internal demo.

| # | Item | Milestone |
|---|------|-----------|
| 1 | Real backend — replace `useLiveTelemetry` with TanStack Query | 3 |
| 2 | Time-series telemetry chart in `TelemetryPanel` | 3 |
| 3 | Mobile `TelemetryDrawer` UX refinement (swipe-to-close, peek state) | 3 |
| 4 | Keyboard navigation in 3D scene (Tab to cycle satellites) | Accessibility milestone |
| 5 | Multi-satellite comparison (multi-select) | Requires UX spec |

**Known layout note:** `LowFpsWarning` badge stacks below `TelemetryDrawer` trigger on mobile (`top-14`) and moves to `top-4` on desktop where the drawer trigger is hidden. This is intentional — both elements share the right-edge column without overlapping.

### 13. Orbital parameters — circular orbit model

#### Orbit model: 5-parameter circular orbit

Full Keplerian elements (6 parameters including eccentricity and argument of periapsis) are not used. With no real backend and eccentricity ≈ 0 for LEO satellites, the simpler circular model is sufficient and avoids complex anomaly calculations. If a real backend provides Keplerian elements, `computeOrbitPosition` can be upgraded to support non-zero eccentricity without changing the interface.

The 5 parameters:

| Field | Unit | Meaning |
|-------|------|---------|
| `radius` | scene units | Distance from origin. Earth = 1 unit. Satellites at 2.4–3.0 units are above the visible globe. |
| `inclination` | degrees [0–180] | Tilt of orbital plane from the equatorial (XZ) plane. |
| `raan` | degrees [0–360] | Right ascension of ascending node — rotates the orbital plane around the polar (Y) axis. |
| `speed` | rad/s | Angular velocity. Demo-scaled (0.23–0.40 rad/s = ~15–27 s/orbit). Not derived from Kepler's third law (`v = √(GM/r)`). |
| `initialAngle` | radians | Phase on the orbit at t = 0. |

#### Coordinate system (Three.js Y-up)

- XZ plane = equatorial plane
- Y axis = polar axis (positive = north)

`computeOrbitPosition(orbit, t)` formula:
```
θ = initialAngle + speed × t
x = radius × (cos θ · cos Ω + sin θ · cos i · sin Ω)
y = radius × (−sin θ · sin i)
z = radius × (−cos θ · sin Ω + sin θ · cos i · cos Ω)
```
where i = inclination in radians, Ω = raan in radians.

#### `position` field is derived, not independent

`Satellite.position` stores `computeOrbitPosition(orbit, 0)` — the t=0 position. It is used as the initial camera focus target in `MissionControlScene`. At runtime, `Satellite.tsx` calls `computeOrbitPosition(data.orbit, state.clock.elapsedTime)` inside `useFrame` and updates the group position imperatively — `position` is only the starting point before the first frame.

#### `predictedPosition` is not a data field

The issue spec listed "next predicted position" as a field. It is intentionally NOT stored in the entity — a stored value would be stale on every tick. Instead, `computeOrbitPosition(orbit, t + PREDICTION_WINDOW)` is the predicted position function. `PREDICTION_WINDOW = 300` (demo-seconds, labeled "+5 min") is exported from `PredictedMarker.tsx` in the widget layer.

#### `radius` and `telemetry.altitude` are independent

`radius` is in scene units; `telemetry.altitude` is in km. They are related by scene scale (Earth radius = 1 unit ≈ 6371 km) but are not kept in sync — they serve different purposes (3D rendering vs. telemetry display). A future backend will provide both fields independently.

#### Satellite animation — `useFrame` imperative update

`Satellite.tsx` animates each satellite by updating its Three.js group position directly inside `useFrame`:

```ts
useFrame((state, delta) => {
  if (groupRef.current) {
    const [x, y, z] = computeOrbitPosition(data.orbit, state.clock.elapsedTime);
    groupRef.current.position.set(x, y, z);
  }
  // … pulse animation unchanged
});
```

Key decisions:
- **Imperative update via ref** — `groupRef.current.position.set(...)` bypasses React reconciler. No `useState`, no re-render. This is the correct R3F pattern for per-frame updates.
- **`state.clock.elapsedTime`** — scene clock starts at 0 when the canvas mounts. All 6 satellites share the same clock, so relative phases (set by `initialAngle`) are preserved correctly.
- **`position={data.position}` as initial prop** — the group starts at the t=0 orbit position before `useFrame` fires on the first frame. No position flash.
- **Camera follow not implemented** — when a satellite is selected, `MissionControlScene` sets the camera to look at `sat.position` (t=0). The camera does not track the satellite as it moves. This is a known limitation; camera tracking is a separate feature.
- **Visual emphasis** — existing pulse animation (degraded: 3 Hz, warning: 1.5 Hz) and selection ring already provide per-status visual emphasis. No additional effect added.

#### Backend consideration

When a real backend arrives, orbital parameters may come from a separate satellite catalog endpoint rather than the telemetry stream. `SatelliteOrbit` may become an optional field on `Satellite` with a separate fetch path. The Zod schema will need to be updated accordingly.

### 14. Orbit path rendering — `OrbitPath` component

#### `orbitToPoints` as pure function

`orbitToPoints(orbit, segments = 128)` in `orbit-to-points.ts` converts an orbit into an array of 128 `[x,y,z]` points by sampling `computeOrbitPosition` at `t = i/segments * period` for i = 0..127. It lives in the widget layer (not the entity layer) because it is a rendering concern — the entity layer defines what an orbit is, the widget layer decides how to draw it.

The function returns exactly `ORBIT_SEGMENTS` points without a repeated closing point. Callers that need a closed polyline append `pts[0]` themselves.

#### `<OrbitPath>` as a per-satellite R3F component

Each satellite gets its own `<OrbitPath orbit={sat.orbit} color={...} isSelected={...} />`. Orbit paths are mounted alongside the satellite meshes in `MissionControlScene`.

`<Line>` from `@react-three/drei` renders the path as a fat line (`LineMaterial` / `Line2`). The closing point (`pts[0]` appended to the `points` array) closes the loop without requiring a `closed` prop — which is more stable across drei versions.

Visual hierarchy:

| State | Opacity | Effect |
|-------|---------|--------|
| Default | 0.20 | Faint orbit reference |
| Selected | 0.85 | Clearly highlighted for the active satellite |

`depthWrite={false}` prevents the transparent orbit lines from clipping objects behind them.

#### Replaces decorative `OrbitalRings`

`OrbitalRings.tsx` (three static torus meshes) is deleted. The three generic rings were decorative — they did not match any satellite's actual orbit. The new orbit paths are derived from each satellite's real orbital parameters, so the 3D scene now accurately represents the fleet's flight geometry.

#### `useMemo` keyed to `orbit`

Points are memoised with `useMemo(() => [...], [orbit])`. Since `MOCK_SATELLITES` is a module-level constant, the memo never recomputes during a session. After issue #69 introduces dynamic satellite data from a backend, the memo will still be correct — orbit parameters change rarely (reboost manoeuvres), not every frame.

### 15. Predicted position marker — `PredictedMarker` component

Each satellite has a `<PredictedMarker orbit={sat.orbit} color={...} />` mounted in `MissionControlScene` between the orbit path and the satellite mesh.

**Formula:** `computeOrbitPosition(orbit, state.clock.elapsedTime + PREDICTION_WINDOW)` — the same orbit math, shifted 300 demo-seconds forward.

**`PREDICTION_WINDOW = 300`** is exported from `PredictedMarker.tsx`. It is a widget-layer constant (rendering/demo concern), not an entity-layer concern.

**Visual:** Wireframe octahedron, radius 0.06, opacity 0.45, same status color as the satellite. Octahedron shape distinguishes the predicted marker from the satellite cube at a glance.

**Always visible** — shown for all satellites regardless of selection state. The predicted marker moves along the orbit in real time, staying exactly `PREDICTION_WINDOW` seconds ahead of the satellite.

**Trail deferred** — "display a trail" was considered and deferred. A trail requires storing N past positions in a ref array and re-uploading a BufferGeometry each frame. The single lookahead marker satisfies the acceptance criteria ("visually understandable") at lower complexity.

**Initial position prop:** `position={computeOrbitPosition(orbit, PREDICTION_WINDOW)}` sets the t=0 starting point before `useFrame` fires on the first frame — no position flash on mount.

## Consequences

- `@satellite-control/entity-satellite` is a new workspace package; any app in the monorepo can depend on it
- `SatelliteStatus` and `SelectedSatelliteInfo` must stay in sync — `SAT_STATUS_CLASS` in `TelemetryPanel` and i18n `satelliteDetail.status.*` keys must cover all four statuses
- `FleetLegend` replaces the `legendPlaceholder` div in `DigitalTwinShell`; the placeholder comment and `digitalTwin.legendPlaceholder` i18n key are now obsolete but kept for backwards compat until a full cleanup pass
- All 3D visual logic remains in `widgets/mission-control-scene/` — no Three.js code in the entity or feature layers
- `MissionControlScene` is now a `forwardRef` component; consumers must type their ref as `CameraControlsHandle` from the widget index
- `TelemetryPanel` and `TelemetryDrawer` now accept an optional `satellites` prop; when omitted, the status breakdown is hidden
