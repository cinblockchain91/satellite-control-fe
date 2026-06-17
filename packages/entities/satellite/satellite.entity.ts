import type { Brand } from "@satellite-control/shared/types/branded";

export type SatelliteId = Brand<string, "SatelliteId">;
export const SatelliteId = (id: string): SatelliteId => id as SatelliteId;

export type SatelliteStatus = "online" | "warning" | "degraded" | "offline";

export interface SatelliteTelemetry {
  signalStrength: number;
  battery: number;
  temperature: number;
  altitude: number;
  healthScore: number;
}

export interface SatelliteOrbit {
  radius: number;       // scene units from origin (Earth radius = 1 unit)
  inclination: number;  // degrees [0–180]: tilt of orbital plane from equatorial
  raan: number;         // degrees [0–360]: rotation of orbital plane around polar (Y) axis
  speed: number;        // rad/s — demo-scaled, not derived from Kepler's third law
  initialAngle: number; // radians: satellite phase on orbit at t = 0
}

export interface Satellite {
  id: SatelliteId;
  name: string;
  position: [number, number, number]; // computeOrbitPosition(orbit, 0) — used for camera focus
  status: SatelliteStatus;
  telemetry: SatelliteTelemetry;
  orbit: SatelliteOrbit;
}
