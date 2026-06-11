# ADR 001 — 3D Engine Selection

**Status:** Accepted
**Date:** 2026-06-11

## Context

The satellite control dashboard requires 3D visualization across multiple views — mission overview, orbit tracking, digital twin, and telemetry scenes. We evaluated two candidate libraries:

- **Three.js** with `@react-three/fiber` (R3F) and `@react-three/drei`
- **Babylon.js** with `@babylonjs/react`

Key constraints:
- Must integrate cleanly with Next.js 15 App Router and React 19
- Must support Server Component architecture (canvas only on client)
- TypeScript support required
- Bundle size matters — the app targets mission control operators on desktop

## Decision

Use **Three.js** (`three`) with **@react-three/fiber** and **@react-three/drei**.

| Criteria | Three.js + R3F | Babylon.js |
|---|---|---|
| React integration | Declarative JSX, hooks-based (`useFrame`, `useThree`) | Imperative API, less idiomatic in React |
| Bundle size | ~600 KB | ~2 MB+ |
| Next.js App Router | Works via `dynamic({ ssr: false })` | More complex setup |
| Ecosystem | `@react-three/drei` — 100+ ready helpers (OrbitControls, Stars, etc.) | Smaller |
| TypeScript | Excellent (`@types/three`) | Good |
| Space/satellite examples | Extensive community resources | Limited |

## Consequences

- All 3D scenes use `<Canvas>` from R3F, wrapped in a shared `SceneCanvas` component
- WebGL canvas components must be Client Components (`"use client"`)
- The `dynamic({ ssr: false })` call must live in a Client Component — not in a Server Component page
- `SceneCanvas` lives in `apps/web/src/shared/3d/` — separate from the 2D shadcn UI primitives in `shared/components/ui/`
- If 3D primitives are needed across multiple apps in the monorepo in the future, extract to `packages/shared/3d/`
