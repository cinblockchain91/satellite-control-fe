"use client";

import { useState, useEffect } from "react";
import type { Satellite } from "@satellite-control/entity-satellite";
import { buildSnapshot } from "./telemetry-snapshot";

export type { SystemStatus, TelemetrySnapshot } from "./telemetry-snapshot";

export function useLiveTelemetry(satellites: readonly Satellite[], intervalMs = 3000) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((prev) => prev + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return buildSnapshot(satellites, tick);
}
