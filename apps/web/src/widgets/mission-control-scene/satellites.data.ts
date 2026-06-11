export type SatelliteStatus = "online" | "warning" | "offline";

export interface SatelliteData {
  id: string;
  name: string;
  position: [number, number, number];
  status: SatelliteStatus;
}

export const STATUS_COLORS: Record<SatelliteStatus, string> = {
  online: "#22c55e",
  warning: "#eab308",
  offline: "#ef4444",
};

export const MOCK_SATELLITES: SatelliteData[] = [
  { id: "sat-1", name: "SAT-Alpha", position: [2.5, 0.5, 0], status: "online" },
  { id: "sat-2", name: "SAT-Beta", position: [-2, 1, 1], status: "warning" },
  { id: "sat-3", name: "SAT-Gamma", position: [0, -2, 2], status: "offline" },
  { id: "sat-4", name: "SAT-Delta", position: [1, 2, -2], status: "online" },
];
