import type { Satellite, SatelliteStatus } from "@satellite-control/entity-satellite";
import { SatelliteId } from "@satellite-control/entity-satellite";

export type { Satellite, SatelliteStatus };

export const STATUS_COLORS: Record<SatelliteStatus, string> = {
  online: "#22c55e",
  warning: "#eab308",
  degraded: "#f97316",
  offline: "#ef4444",
};

// Positions are computeOrbitPosition(orbit, 0) — kept as literals for camera focus.
export const MOCK_SATELLITES: Satellite[] = [
  {
    id: SatelliteId("sat-1"),
    name: "SAT-Alpha",
    position: [2.5, 0, 0],
    status: "online",
    orbit: { radius: 2.5, inclination: 10, raan: 0, speed: 0.35, initialAngle: 0 },
    telemetry: { signalStrength: 92, battery: 88, temperature: 22, altitude: 550, healthScore: 94 },
  },
  {
    id: SatelliteId("sat-2"),
    name: "SAT-Beta",
    position: [1.4, 0, -2.42],
    status: "warning",
    orbit: { radius: 2.8, inclination: 48, raan: 60, speed: 0.27, initialAngle: 0 },
    telemetry: { signalStrength: 47, battery: 65, temperature: 38, altitude: 542, healthScore: 52 },
  },
  {
    id: SatelliteId("sat-3"),
    name: "SAT-Gamma",
    position: [0.58, -2.51, -0.34],
    status: "offline",
    orbit: { radius: 2.6, inclination: 75, raan: 120, speed: 0.30, initialAngle: Math.PI / 2 },
    telemetry: { signalStrength: 0, battery: 12, temperature: 55, altitude: 538, healthScore: 8 },
  },
  {
    id: SatelliteId("sat-4"),
    name: "SAT-Delta",
    position: [2.6, 0, -1.5],
    status: "online",
    orbit: { radius: 3.0, inclination: 30, raan: 210, speed: 0.23, initialAngle: Math.PI },
    telemetry: { signalStrength: 78, battery: 91, temperature: 19, altitude: 560, healthScore: 89 },
  },
  {
    id: SatelliteId("sat-5"),
    name: "SAT-Epsilon",
    position: [0.98, 2.12, -0.56],
    status: "degraded",
    orbit: { radius: 2.4, inclination: 62, raan: 300, speed: 0.40, initialAngle: (3 * Math.PI) / 2 },
    telemetry: { signalStrength: 23, battery: 34, temperature: 45, altitude: 535, healthScore: 31 },
  },
  {
    id: SatelliteId("sat-6"),
    name: "SAT-Zeta",
    position: [0.83, 0.77, 2.67],
    status: "online",
    orbit: { radius: 2.9, inclination: 22, raan: 150, speed: 0.25, initialAngle: (5 * Math.PI) / 4 },
    telemetry: { signalStrength: 85, battery: 79, temperature: 25, altitude: 565, healthScore: 76 },
  },
];
