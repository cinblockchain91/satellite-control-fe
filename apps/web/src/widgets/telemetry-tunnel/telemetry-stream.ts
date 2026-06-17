import type { SatelliteTelemetry } from "@satellite-control/entity-satellite";

export type TelemetryStreamState = "nominal" | "warning" | "critical";
export type TelemetryMetric = "signalStrength" | "battery" | "temperature" | "latency" | "anomalyLevel";

export const METRIC_THRESHOLDS = {
  signalStrength: { warning: 60, critical: 30 },
  battery:        { warning: 50, critical: 20 },
  temperature:    { warning: 45, critical: 60 },
  latency:        { warning: 200, critical: 500 },
  anomalyLevel:   { warning: 20, critical: 50 },
} as const;

export function classifyMetric(metric: TelemetryMetric, value: number): TelemetryStreamState {
  const t = METRIC_THRESHOLDS[metric];
  switch (metric) {
    case "signalStrength":
    case "battery":
      if (value < t.critical) return "critical";
      if (value < t.warning) return "warning";
      return "nominal";
    case "temperature":
    case "latency":
    case "anomalyLevel":
      if (value > t.critical) return "critical";
      if (value > t.warning) return "warning";
      return "nominal";
  }
}

export function classifyStream(telemetry: SatelliteTelemetry): TelemetryStreamState {
  const states = [
    classifyMetric("signalStrength", telemetry.signalStrength),
    classifyMetric("battery", telemetry.battery),
    classifyMetric("temperature", telemetry.temperature),
    classifyMetric("latency", telemetry.latency),
    classifyMetric("anomalyLevel", telemetry.anomalyLevel),
  ];
  if (states.includes("critical")) return "critical";
  if (states.includes("warning")) return "warning";
  return "nominal";
}
