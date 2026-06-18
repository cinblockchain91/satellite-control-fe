# ADR 003 — Telemetry Tunnel 3D Experience

**Status:** Accepted  
**Date:** 2026-06-18  
**Milestone:** Create a "Telemetry Tunnel" 3D Experience

## Context

The second milestone extends the Digital Twin fleet view with a new dimension: visualising the **data flow** between satellites and ground stations. Where ADR 002 focused on orbital geometry (where satellites are), this milestone focuses on telemetry health (what data is flowing and whether it is healthy).

Key constraints:
- Must work without a live backend — mock data must be sufficient for demo
- Visual states must be immediately readable without reading numeric values
- Threshold logic must be the single source of truth for both 3D visuals and sidebar panels
- New telemetry fields must be backend-passthrough (frontend does not compute them)

## Decisions

### 1. `latency` and `anomalyLevel` added to `SatelliteTelemetry` entity

Two new fields extend `SatelliteTelemetry` in `packages/entities/satellite/`:

| Field | Type | Range | Meaning |
|-------|------|-------|---------|
| `latency` | `number` | ≥ 0 ms | Round-trip signal latency. `0` when satellite is offline — no signal means no measurement. |
| `anomalyLevel` | `number` | 0–100 | Backend-computed anomaly score. `0` = fully stable, `100` = critical anomaly. Analogous to `healthScore` — the frontend displays this value; it does not re-implement the backend's scoring logic. |

**Why entity layer, not widget layer:** Both fields are real telemetry metrics that a backend will provide directly. The frontend is passive — it receives and displays these values. This is the same pattern as `healthScore` (ADR 002 section 3). Widget-layer derivation would couple the frontend to backend scoring logic and diverge when a real backend arrives.

**Zod schema:** `SatelliteTelemetrySchema` updated with `latency: z.number().min(0)` and `anomalyLevel: z.number().min(0).max(100)`. These run at the API boundary when a real backend is connected.

### 2. `METRIC_THRESHOLDS` as single source of truth for visual states

All threshold values live in `widgets/telemetry-tunnel/telemetry-stream.ts` as a named constant:

```
signalStrength: warning < 60,  critical < 30
battery:        warning < 50,  critical < 20
temperature:    warning > 45,  critical > 60 (°C)
latency:        warning > 200, critical > 500 (ms)
anomalyLevel:   warning > 20,  critical > 50
```

**Why widget layer, not entity layer:** Thresholds are a frontend display decision — they determine when to colour a beam yellow vs red. A real backend may use entirely different thresholds internally. Keeping them in the widget layer prevents the entity from encoding UI opinions.

**Why a named constant, not inline literals:** The same thresholds drive 3D beam colour, sidebar badge colour, and future alert logic. A single constant prevents threshold drift between UI surfaces.

**Direction convention:** `signalStrength` and `battery` degrade downward (lower is worse). `temperature`, `latency`, and `anomalyLevel` degrade upward (higher is worse). `classifyMetric` handles both directions via a `switch` on metric name.

### 3. `TelemetryStreamState = "nominal" | "warning" | "critical"`

Three-band classification mirrors the existing `SystemStatus` type in `telemetry-snapshot.ts`. Using the same vocabulary ("nominal / warning / critical") keeps the mental model consistent across fleet overview and tunnel view.

`classifyStream(telemetry)` returns the worst-case state across all five metrics — if any metric is critical, the stream is critical. This drives the overall beam colour for a satellite-to-ground link without requiring the 3D layer to know individual metric values.

### 4. Mock data covers all three visual bands

`MOCK_SATELLITES` is updated so that the tunnel scene immediately shows all three stream states on mount:

| Satellite | Notable condition | Stream state |
|-----------|------------------|--------------|
| SAT-Alpha | All nominal | nominal |
| SAT-Beta | High latency (320 ms) + elevated anomaly (28) | warning |
| SAT-Gamma | Offline — signal 0, anomaly 82 | critical |
| SAT-Delta | Good signal but high anomaly (67) | critical |
| SAT-Epsilon | Critical signal (23) + warning latency (255 ms) | critical |
| SAT-Zeta | All nominal | nominal |

SAT-Delta is intentionally designed to demonstrate a counterintuitive scenario: a satellite with `status: "online"` and strong signal that nonetheless has a critical anomaly. This is the key reason `anomalyLevel` exists as a separate field from `status`.

### 5. Deferred: ground station entity, 3D beam rendering

This issue defines the data contract only. Ground stations, animated beams, and the tunnel scene are separate issues. The widget directory `widgets/telemetry-tunnel/` is created now to establish the FSD boundary — future components will live alongside `telemetry-stream.ts`.

### 6. Dual-channel visualization: beam vs. particles

Two independent visual channels carry different semantic information:

- **Beam** (`TelemetryBeam`) — colour driven by `SatelliteStatus` (`online / warning / degraded / offline`). Answers: "is the communication link operational?"
- **Particles** (`FlowParticles`) — colour and speed driven by `TelemetryStreamState` (`nominal / warning / critical`) via `classifyStream(satellite.telemetry)`. Answers: "what is the quality of data flowing through the link?"

This separation is intentional. A satellite can be `status: "online"` while its telemetry stream is `"critical"` — SAT-Delta demonstrates this: strong signal, high anomaly score. Conflating both into a single colour would lose that distinction.

| Stream state | Particle color | Speed (units/s) | Signal |
|-------------|---------------|----------------|--------|
| `nominal` | `#7dd3fc` sky-400 | 0.4 | healthy data flow |
| `warning` | `#fbbf24` amber-400 | 0.8 | degraded metrics |
| `critical` | `#f87171` red-400 | 1.4 | immediate attention needed |

Speed encodes urgency kinetically — a critical stream pulses faster without the user needing to read any number.

**Known limitation:** When `streamState` transitions, particle positions jump one frame because `progress = (t * speed + offset) % 1` is discontinuous at speed changes. With static mock data this is imperceptible. When real-time streaming arrives, replace `t * speed` with accumulated delta time (`ref += delta * speed` per frame) to avoid the discontinuity.

## Consequences

- `SatelliteTelemetry` now has 7 fields; all consumers (`MOCK_SATELLITES`, `SelectedSatelliteInfo`, `SatelliteTelemetrySchema`, test fixtures) are updated
- `METRIC_THRESHOLDS` is the contract between the data layer and any visual layer that needs to colour-code telemetry — do not inline threshold values in 3D components
- `classifyStream` returns worst-case state; if per-metric breakdown is needed in the UI, call `classifyMetric` per field directly
- When a real backend arrives: add `latency` and `anomalyLevel` to the satellite telemetry API response, run `SatelliteTelemetrySchema.parse()` at the fetch boundary — no other changes needed in the classification logic
- `telemetry-snapshot.ts` / `useLiveTelemetry` do not yet include `latency` or `anomalyLevel` in fleet averages — this is deferred until the tunnel UI needs fleet-level aggregates for these metrics

## Deferred items

| # | Item | Status |
|---|------|--------|
| 1 | Ground station entity — `GroundStation` type, `GroundStationStatus`, mock positions | Done (Issue 2) |
| 2 | 3D beam rendering — animated line from satellite to ground station | Done (Issue 2) |
| 3 | Flow particle animation — `FlowParticles` with phase-offset particles | Done (Issue 3) |
| 4 | Metric-based visual emphasis — particle color + speed from `classifyStream` | Done (Issue 4) |
| 5 | Per-metric breakdown in sidebar panel | Requires UX spec |
| 6 | `useLiveTelemetry` drift simulation for `latency` and `anomalyLevel` | After tunnel scene lands |
| 7 | Fleet-level aggregates for new metrics in `buildSnapshot` | After tunnel scene lands |
