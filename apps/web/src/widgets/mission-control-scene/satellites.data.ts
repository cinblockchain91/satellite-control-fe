export type SatelliteStatus = "online" | "warning" | "offline";

export interface SatelliteTelemetry {
  signalStrength: number;
  battery: number;
  temperature: number;
  altitude: number;
}

export interface SatelliteData {
  id: string;
  name: string;
  position: [number, number, number];
  status: SatelliteStatus;
  telemetry: SatelliteTelemetry;
}

export const STATUS_COLORS: Record<SatelliteStatus, string> = {
  online: "#22c55e",
  warning: "#eab308",
  offline: "#ef4444",
};

export const MOCK_SATELLITES: SatelliteData[] = [
  { id: "sat-1", name: "SAT-Alpha", position: [2.5, 0.5, 0], status: "online",
    telemetry: { signalStrength: 92, battery: 88, temperature: 22, altitude: 550 } },
  { id: "sat-2", name: "SAT-Beta", position: [-2, 1, 1], status: "warning",
    telemetry: { signalStrength: 47, battery: 65, temperature: 38, altitude: 542 } },
  { id: "sat-3", name: "SAT-Gamma", position: [0, -2, 2], status: "offline",
    telemetry: { signalStrength: 0, battery: 12, temperature: 55, altitude: 538 } },
  { id: "sat-4", name: "SAT-Delta", position: [1, 2, -2], status: "online",
    telemetry: { signalStrength: 78, battery: 91, temperature: 19, altitude: 560 } },
];
