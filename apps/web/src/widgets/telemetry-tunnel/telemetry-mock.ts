"use client";

import { useState, useEffect } from "react";
import type { Satellite } from "@satellite-control/entity-satellite";

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Radian increment between consecutive satellites' sine-wave phase offsets.
// Different values for latency vs anomaly prevent synchronized transitions.
const LATENCY_PHASE_STEP = 0.9;
const ANOMALY_PHASE_STEP = 1.3;

// Upper clamp for drifted latency — prevents unrealistic values from extreme sine peaks.
const MAX_LATENCY_MS = 1000;

// Per-satellite sinusoidal drift for latency and anomalyLevel.
// Amplitudes are chosen so each satellite's values cross at least one
// classification threshold during a demo session:
//   latency:      warning > 200 ms,  critical > 500 ms
//   anomalyLevel: warning > 20,      critical > 50
const DRIFT_CONFIG: Record<
  string,
  { latency: { amp: number; freq: number }; anomaly: { amp: number; freq: number } }
> = {
  "sat-1": { latency: { amp: 170, freq: 0.30 }, anomaly: { amp: 5,  freq: 0.20 } }, // nominal → crosses 200 ms
  "sat-2": { latency: { amp: 40,  freq: 0.15 }, anomaly: { amp: 28, freq: 0.25 } }, // warning anomaly → critical / nominal
  "sat-3": { latency: { amp: 0,   freq: 0    }, anomaly: { amp: 5,  freq: 0.10 } }, // offline — telemetry ignored by scene
  "sat-4": { latency: { amp: 20,  freq: 0.10 }, anomaly: { amp: 22, freq: 0.20 } }, // critical anomaly → dips to warning
  "sat-5": { latency: { amp: 15,  freq: 0.12 }, anomaly: { amp: 15, freq: 0.28 } }, // warning anomaly → crosses critical
  "sat-6": { latency: { amp: 100, freq: 0.22 }, anomaly: { amp: 12, freq: 0.35 } }, // nominal → crosses 200 ms + anomaly 20
};

export function useTunnelMockTelemetry(
  satellites: readonly Satellite[],
  intervalMs = 4000,
): Satellite[] {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((prev) => prev + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return satellites.map((sat, i): Satellite => {
    const d = DRIFT_CONFIG[sat.id as string];
    if (!d) return sat;

    // Stagger phases so satellites transition at different times
    const latencyPhase = i * LATENCY_PHASE_STEP;
    const anomalyPhase = i * ANOMALY_PHASE_STEP;

    const latencyDrift = d.latency.amp * Math.sin(tick * d.latency.freq + latencyPhase);
    const anomalyDrift = d.anomaly.amp * Math.sin(tick * d.anomaly.freq + anomalyPhase);

    return {
      ...sat,
      telemetry: {
        ...sat.telemetry,
        latency: clamp(sat.telemetry.latency + latencyDrift, 0, MAX_LATENCY_MS),
        anomalyLevel: clamp(sat.telemetry.anomalyLevel + anomalyDrift, 0, 100),
      },
    };
  });
}
