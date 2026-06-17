import type { SatelliteStatus } from "@satellite-control/entity-satellite";

export interface SelectedSatelliteInfo {
  id: string;
  name: string;
  status: SatelliteStatus;
  signalStrength: number;
  battery: number;
  temperature: number;
  altitude: number;
  healthScore: number;
  latency: number;
  anomalyLevel: number;
}
