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

export interface Satellite {
  id: SatelliteId;
  name: string;
  position: [number, number, number];
  status: SatelliteStatus;
  telemetry: SatelliteTelemetry;
}
