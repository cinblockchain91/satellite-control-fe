import type { Satellite } from "@satellite-control/entity-satellite";

export type SystemStatus = "nominal" | "warning" | "critical";

export interface TelemetrySnapshot {
  satelliteCount: number;
  onlineCount: number;
  signalStrength: number;
  battery: number;
  temperature: number;
  systemStatus: SystemStatus;
}

function deriveSystemStatus(onlineCount: number, total: number, signalStrength: number): SystemStatus {
  const ratio = onlineCount / total;
  if (ratio < 0.5 || signalStrength < 40) return "critical";
  if (ratio < 0.75 || signalStrength < 60) return "warning";
  return "nominal";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function buildSnapshot(satellites: readonly Satellite[], tick: number): TelemetrySnapshot {
  const total = satellites.length;
  if (total === 0) {
    return { satelliteCount: 0, onlineCount: 0, signalStrength: 0, battery: 0, temperature: 0, systemStatus: "nominal" };
  }

  const onlineCount = satellites.filter((s) => s.status === "online").length;
  const baseSignal = Math.round(satellites.reduce((acc, s) => acc + s.telemetry.signalStrength, 0) / total);
  const baseBattery = Math.round(satellites.reduce((acc, s) => acc + s.telemetry.battery, 0) / total);
  const baseTemp = Math.round(satellites.reduce((acc, s) => acc + s.telemetry.temperature, 0) / total);

  // Sinusoidal drift simulates live sensor variance without a backend
  const signalStrength = clamp(Math.round(baseSignal + Math.sin(tick * 0.4) * 4), 0, 100);
  const battery = clamp(Math.round(baseBattery + Math.sin(tick * 0.25) * 2), 0, 100);
  const temperature = Math.round(baseTemp + Math.sin(tick * 0.3) * 2);

  return {
    satelliteCount: total,
    onlineCount,
    signalStrength,
    battery,
    temperature,
    systemStatus: deriveSystemStatus(onlineCount, total, signalStrength),
  };
}
