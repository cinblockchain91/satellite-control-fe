import type { Satellite, SatelliteStatus } from "@satellite-control/entity-satellite";
import { SatelliteId } from "@satellite-control/entity-satellite";

export type { Satellite, SatelliteStatus };

export const STATUS_COLORS: Record<SatelliteStatus, string> = {
  online: "#22c55e",
  warning: "#eab308",
  degraded: "#f97316",
  offline: "#ef4444",
};

export const MOCK_SATELLITES: Satellite[] = [
  {
    id: SatelliteId("sat-1"),
    name: "SAT-Alpha",
    position: [2.5, 0.5, 0],
    status: "online",
    telemetry: { signalStrength: 92, battery: 88, temperature: 22, altitude: 550, healthScore: 94 },
  },
  {
    id: SatelliteId("sat-2"),
    name: "SAT-Beta",
    position: [-2, 1, 1],
    status: "warning",
    telemetry: { signalStrength: 47, battery: 65, temperature: 38, altitude: 542, healthScore: 52 },
  },
  {
    id: SatelliteId("sat-3"),
    name: "SAT-Gamma",
    position: [0, -2, 2],
    status: "offline",
    telemetry: { signalStrength: 0, battery: 12, temperature: 55, altitude: 538, healthScore: 8 },
  },
  {
    id: SatelliteId("sat-4"),
    name: "SAT-Delta",
    position: [1, 2, -2],
    status: "online",
    telemetry: { signalStrength: 78, battery: 91, temperature: 19, altitude: 560, healthScore: 89 },
  },
  {
    id: SatelliteId("sat-5"),
    name: "SAT-Epsilon",
    position: [-2.5, -0.5, -1],
    status: "degraded",
    telemetry: { signalStrength: 23, battery: 34, temperature: 45, altitude: 535, healthScore: 31 },
  },
  {
    id: SatelliteId("sat-6"),
    name: "SAT-Zeta",
    position: [0.5, 2.5, 1.5],
    status: "online",
    telemetry: { signalStrength: 85, battery: 79, temperature: 25, altitude: 565, healthScore: 76 },
  },
];
