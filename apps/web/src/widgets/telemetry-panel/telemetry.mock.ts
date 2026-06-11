"use client";

import { useState, useEffect } from "react";

export type SystemStatus = "nominal" | "warning" | "critical";

export interface TelemetrySnapshot {
  satelliteCount: number;
  onlineCount: number;
  signalStrength: number;
  battery: number;
  temperature: number;
  systemStatus: SystemStatus;
}

const SNAPSHOTS: TelemetrySnapshot[] = [
  { satelliteCount: 4, onlineCount: 2, signalStrength: 92, battery: 87, temperature: 23, systemStatus: "nominal" },
  { satelliteCount: 4, onlineCount: 3, signalStrength: 78, battery: 82, temperature: 26, systemStatus: "nominal" },
  { satelliteCount: 4, onlineCount: 2, signalStrength: 61, battery: 74, temperature: 31, systemStatus: "warning" },
  { satelliteCount: 4, onlineCount: 1, signalStrength: 45, battery: 68, temperature: 38, systemStatus: "warning" },
  { satelliteCount: 4, onlineCount: 2, signalStrength: 83, battery: 79, temperature: 25, systemStatus: "nominal" },
];

export function useLiveTelemetry(intervalMs = 3000): TelemetrySnapshot {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % SNAPSHOTS.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return SNAPSHOTS[index] ?? SNAPSHOTS[0]!;
}
