# ADR 004 — Command Center Simulator

**Status:** Accepted
**Date:** 2026-06-18
**Milestone:** Build a "Command Center Simulator"

## Context

The third milestone introduces a new dimension of interaction: a physical mission control room operators can explore. Where the Digital Twin (ADR 002) focused on fleet position and the Telemetry Tunnel (ADR 003) on data flow quality, the Command Center Simulator makes the operator an active participant — issuing mock commands and monitoring satellite status from a simulated control room.

Key constraints:
- Must integrate with the existing satellite entity and mock data without a live backend
- Must be independently deployable behind a feature flag
- First version must be demo-ready for a single internal session
- Navigation must be accessible to non-technical operators without a tutorial

## Decisions

### 1. Three.js + R3F over Babylon.js

The milestone specification suggests Babylon.js. After evaluating this against ADR 001, implementing Babylon.js for this view would introduce:
- Two independent WebGL contexts in the same app
- ~2 MB additional bundle for a single route
- No sharing of `@/shared/3d` primitives (`SceneCanvas`, `Earth`, `PerformanceMonitor`)
- Divergent mental model for future contributors

The Command Center Simulator's requirements (room geometry, interactive objects, status screens, cinematic camera) are all achievable with Three.js + R3F + drei. `@react-three/drei` provides `<Html>` for DOM-in-3D screen content, environment maps for PBR lighting, and smooth camera transitions via `CameraControls`. No Babylon.js-exclusive feature is required.

**Decision:** Extend Three.js + R3F. Create `widgets/command-center-scene/` as a parallel widget alongside `widgets/mission-control-scene/` and `widgets/telemetry-tunnel/`. ADR 001 stands. This entry documents the explicit evaluation and confirms the rejection.

### 2. Scene concept: physical room-scale environment

The Command Center is a procedurally generated mission control room — no GLTF model for v1. Procedural geometry (box + plane primitives) is sufficient for demo purposes and avoids an asset pipeline.

Room layout:
- Four operator workstations arranged in a shallow arc facing a wall of screens
- Wall of 4 status screens (2×2 grid) showing live satellite telemetry
- One control panel desk with interactive command buttons
- Atmospheric lighting: ambient + screen glow via `<pointLight>` positioned at each screen

Procedural geometry means the room layout is a code constant (`scene-config.ts`), not a design asset. A GLTF model is a future enhancement (see Deferred items).

### 3. Camera model: cinematic preset positions

Three predetermined camera positions with smooth animated transitions between them. No free-roam, no first-person, no orbit.

| Preset | Description |
|--------|-------------|
| `overview` | Wide shot from behind and above — full room visible |
| `panels` | Close-up facing the control panel desk |
| `screens` | Facing the wall of status screens |

**Why cinematic, not orbit:** Orbit controls (used in Digital Twin + Telemetry Tunnel) disorient users inside a room-scale scene — there is no meaningful centre to orbit around. First-person (WASD + pointer lock) requires substantial input handling and is out of scope for v1. Cinematic presets deliver a better demo experience with minimal code.

**Transition:** `CameraControls.setLookAt()` with `animate=true` (~600 ms smooth interpolation). The Shell owns `cameraPreset: CameraPreset` state and passes it down to the scene via a `useEffect` that fires when the preset changes.

**`CameraPreset`** is defined in `widgets/command-center-scene/scene-config.ts` as `"overview" | "panels" | "screens"`. Camera positions (world coordinates) live alongside the type as `CAMERA_POSITIONS`.

### 4. Feature set v1 — explicit scope boundary

**In scope:**
- Room geometry (procedural — floor, walls, ceiling, desks, screen wall)
- 4 status screens showing live satellite telemetry via `<Html>` overlay
- Satellite selection by clicking a status screen
- Control panel with 4 command buttons (Hibernate / Wake / Reset / Boost)
- Mock command dispatch: 2 s pending → acknowledged (90%) or failed (10%)
- Cinematic camera preset switcher (3 positions)
- FPS monitor + low-FPS warning badge (reusing `PerformanceMonitor` from `@/shared/3d`)
- Demo badge + auto-tour (cycles camera presets every 5 s)

**Explicitly out of scope for v1:**
- First-person (WASD) navigation
- GLTF/GLB room model
- Real command API calls
- Per-workstation operator interaction
- Sound/audio feedback
- Multi-satellite simultaneous command

### 5. Mock command system

Commands are client-only with a simulated async lifecycle.

```
CommandType   = "hibernate" | "wake" | "reset" | "boost"
CommandStatus = "pending" | "acknowledged" | "failed"

MockCommand {
  id:           string        // crypto.randomUUID()
  satelliteId:  SatelliteId
  type:         CommandType
  status:       CommandStatus
  dispatchedAt: number        // Date.now() at dispatch time
}
```

**Lifecycle:** `dispatch(satelliteId, type)` → `status: "pending"` → after 2000 ms → `"acknowledged"` (90%) or `"failed"` (10%) via `Math.random()`.

`useMockCommandDispatch()` hook in `widgets/command-center-scene/command-actions.ts` owns `commands: MockCommand[]` state. Timeout IDs are tracked in a `useRef` array; a `useEffect` cleanup clears all pending timeouts on unmount.

**Backend swap point:** Replace `useMockCommandDispatch` with a `useMutation` (TanStack Query) that POSTs to `/api/commands`. The `MockCommand` interface becomes `Command`; the `status` field maps directly to the API response lifecycle. No changes needed in `ControlPanel.tsx` or the Shell.

### 6. Status screens use `<Html>` from drei

Each status screen is a `<mesh>` (PlaneGeometry) with a `<Html>` child centered on it. Screen content is React DOM rendered inside the 3D scene.

This is chosen over:
- Texture-based rendering — requires Canvas 2D API, no dynamic React content
- Second R3F canvas per screen — prohibitively expensive

`<Html>` limit: 1 per screen × 4 screens = 4 total. Well within the performance budget.

Screen content reuses `classifyStream` + `METRIC_THRESHOLDS` from `@/widgets/telemetry-tunnel` for telemetry classification — consistent visual vocabulary with the Telemetry Tunnel view.

### 7. FSD structure

```
widgets/command-center-scene/
  CommandCenterScene.tsx   ← forwardRef, cinematic camera, PerformanceMonitor
  RoomGeometry.tsx         ← floor/walls/ceiling/lighting group
  WorkStation.tsx          ← desk + monitor geometry group
  ControlPanel.tsx         ← interactive 3D buttons
  StatusScreen.tsx         ← 3D plane + <Html> telemetry overlay
  command-actions.ts       ← CommandType, CommandStatus, MockCommand, useMockCommandDispatch
  scene-config.ts          ← CameraPreset type + CAMERA_POSITIONS const
  index.ts

views/command-center/
  CommandCenterShell.tsx   ← state: selectedSatId, cameraPreset, isLowFps, commands
  CommandCenterPage.tsx    ← thin page wrapper
```

**Route:** `/[locale]/command-center/` — peer to `/digital-twin/` and `/telemetry-tunnel/`

**Feature flag:** `NEXT_PUBLIC_FEATURE_COMMAND_CENTER` — same build-time inlining pattern as ADR 002 §6.

### 8. Performance budget

| Resource | Budget | Composition |
|----------|--------|-------------|
| Meshes | ≤ 120 | Room (6) + 4 workstations (3 meshes each) + control panel (1 base + 4 buttons) + 4 screens + selection rings |
| Lights | ≤ 6 | 1 ambient + 1 directional + 4 screen `<pointLight>` — **budget fully allocated after Issue 3; future issues must not add lights without removing others** |
| `<Html>` | ≤ 4 | One per status screen |
| FPS target | 60 | Same as other views |
| Stars | none | Room is indoors — no starfield |

## Consequences

- `NEXT_PUBLIC_FEATURE_COMMAND_CENTER` joins the feature flag pattern from ADR 002 §6; sidebar link is conditionally rendered
- `useMockCommandDispatch` is the mock→real swap point for command submission; consumers do not need to change
- `classifyStream` + `METRIC_THRESHOLDS` from `@/widgets/telemetry-tunnel` are imported by `StatusScreen` — telemetry classification vocabulary is shared across two widgets (view layer imports from two widgets; this is valid in FSD)
- Camera presets replace orbit controls — `CameraControls` from drei is still used, but driven programmatically rather than by user drag/scroll
- `@/shared/3d/PerformanceMonitor` is reused — no new monitoring code needed

## Implementation notes (Issues 5–8)

### `<Html>` breaks React context

drei's `<Html>` renders into a separate DOM portal outside the React tree. Any context that wraps the app (e.g., `NextIntlClientProvider`) is **not** accessible inside `<Html>`. This means `useTranslations()` cannot be called inside a component rendered via `<Html>`.

**Workaround:** Call `useTranslations` in the parent component (normal React tree), compute all translated strings into a `labels` object, and pass them as a plain prop to the component inside `<Html>`.

```
StatusScreen (normal tree) → useTranslations() → labels: SatelliteStatusPanelLabels
  └─ <Html> → <SatelliteStatusPanel labels={labels} /> ← no hooks, no context
```

Any future component rendered inside `<Html>` must follow this pattern.

### Selection triggers camera transition

Camera preset auto-changes on user interaction:

| Trigger | Camera moves to |
|---|---|
| Click a status screen | `screens` preset + satellite selected |
| Click control panel body | `panels` preset |
| Click "Overview" in switcher | `overview` preset + satellite deselected |
| Click other preset buttons | preset changes, selection unchanged |

This state lives entirely in `CommandCenterShell` (`cameraPreset` + `selectedSatelliteId`). The scene receives both as props and does not own selection state.

### Mock satellite status coverage

`MOCK_SATELLITES` has 6 satellites; `SCREEN_CONFIGS` has 4 screens. Screens render `satellites[i]` — only the first 4 are visible. sat-4 is set to `degraded` so all four statuses (online / warning / offline / degraded) are always visible on screen simultaneously.

### Pre-seeded command history

`useMockCommandDispatch` initialises with 4 settled commands (3 acknowledged + 1 failed) spread 30 s apart. This ensures the command history panel is never empty on first load, making the demo immediately readable without the user having to dispatch any commands first.

### Button labels use `<Text>` (drei), not `<Html>`

The `<Html>` budget was fully allocated (4 instances — one per status screen). Adding button labels via `<Html>` would exceed the budget and degrade performance.

`<Text>` from drei renders text as SDF mesh geometry via troika-three-text. It is part of the normal R3F scene tree (not a DOM portal), so React context propagation is unaffected — `useTranslations` works inside `ControlPanel` without the workaround required by `<Html>`. Font is fetched asynchronously on first render; labels are invisible for ~100–500 ms until the font loads.

Text labels also forward pointer events (`onClick`, `onPointerEnter`, `onPointerLeave`) to maintain the same interaction surface as the underlying button mesh.

### Camera preset switcher accessibility

The preset switcher `<div>` carries `role="group"` + `aria-label` (i18n key `cameraPresetLabel`). Each `<Button>` carries `aria-pressed={cameraPreset === preset}` so screen readers can identify the active preset.

## v1 feature checklist

Everything below was shipped as part of Milestone 3. Items marked ✓ are live on the demo deployment.

| Feature | Status |
|---------|--------|
| Procedural room geometry (floor, walls, ceiling, desks, screen wall) | ✓ |
| 4 status screens with live telemetry via `<Html>` | ✓ |
| All 4 satellite statuses visible simultaneously (online / warning / degraded / offline) | ✓ |
| Satellite selection by clicking a status screen | ✓ |
| Camera auto-moves to `screens` on satellite select | ✓ |
| Control panel with 4 command buttons (Hibernate / Wake / Reset / Boost) | ✓ |
| Button labels rendered via `<Text>` (SDF mesh, within `<Html>` budget) | ✓ |
| Mock command dispatch: pending → acknowledged (90%) / failed (10%) | ✓ |
| Pre-seeded command history (4 commands visible on first load) | ✓ |
| Toast notifications for command lifecycle | ✓ |
| Cinematic camera preset switcher (Overview / Panels / Screens) | ✓ |
| Camera auto-moves to `panels` on control panel click | ✓ |
| Overview preset deselects satellite | ✓ |
| Demo badge + Auto Tour (cycles camera presets every 5 s) | ✓ |
| FPS monitor + low-FPS warning badge | ✓ |
| Interaction hint overlay with `role="status"` + `aria-live="polite"` | ✓ |
| Camera preset switcher with `role="group"` + `aria-pressed` | ✓ |
| Full i18n (English + Vietnamese) | ✓ |
| Feature-flagged behind `NEXT_PUBLIC_FEATURE_COMMAND_CENTER` | ✓ |

## Deferred items

| # | Item | Status |
|---|------|--------|
| 1 | GLTF room model replacing procedural geometry | Requires UX spec |
| 2 | First-person (WASD) navigation | Requires pointer-lock UX spec |
| 3 | Real backend command API (`useMutation` swap) | After backend lands |
| 4 | Audio feedback for command acknowledgement | Requires UX spec |
| 5 | Multi-satellite simultaneous command | Requires UX spec |
| 6 | Per-operator workstation differentiation | Requires UX spec |
