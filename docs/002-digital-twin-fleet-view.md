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

## Consequences

- `@satellite-control/entity-satellite` is a new workspace package; any app in the monorepo can depend on it
- `SatelliteStatus` and `SelectedSatelliteInfo` must stay in sync — `SAT_STATUS_CLASS` in `TelemetryPanel` and i18n `satelliteDetail.status.*` keys must cover all four statuses
- The `DigitalTwinShell` layout reserves a legend zone (bottom-left overlay) for future implementation (fleet legend — ADR not yet written)
- All 3D visual logic remains in `widgets/mission-control-scene/` — no Three.js code in the entity or feature layers
