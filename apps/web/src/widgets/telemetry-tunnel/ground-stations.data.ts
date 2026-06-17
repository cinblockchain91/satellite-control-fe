// Positions derived from lat/lon:
//   x = cos(lat) * cos(lon)
//   y = sin(lat)
//   z = cos(lat) * sin(lon)
// Earth radius = 1 scene unit (Three.js Y-up coordinate system).

export type GroundStationStatus = "active" | "standby" | "offline";

export interface GroundStation {
  id: string;
  name: string;
  position: [number, number, number];
  status: GroundStationStatus;
  linkedSatelliteIds: string[];
}

export const GROUND_STATION_COLORS: Record<GroundStationStatus, string> = {
  active: "#22c55e",
  standby: "#eab308",
  offline: "#ef4444",
};

export const MOCK_GROUND_STATIONS: GroundStation[] = [
  {
    id: "gs-1",
    name: "Hawaii",
    position: [-0.866, 0.358, -0.350],
    status: "active",
    linkedSatelliteIds: ["sat-1", "sat-3"],
  },
  {
    id: "gs-2",
    name: "Svalbard",
    position: [0.200, 0.978, 0.057],
    status: "active",
    linkedSatelliteIds: ["sat-2", "sat-5"],
  },
  {
    id: "gs-3",
    name: "Canberra",
    position: [-0.702, -0.574, 0.422],
    status: "standby",
    linkedSatelliteIds: ["sat-4"],
  },
  {
    id: "gs-4",
    name: "Maspalomas",
    position: [0.853, 0.469, -0.229],
    status: "active",
    linkedSatelliteIds: ["sat-6"],
  },
];
