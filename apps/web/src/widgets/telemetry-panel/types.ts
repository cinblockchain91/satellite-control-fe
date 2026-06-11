export interface SelectedSatelliteInfo {
  id: string;
  name: string;
  status: "online" | "warning" | "offline";
  signalStrength: number;
  battery: number;
  temperature: number;
  altitude: number;
}
