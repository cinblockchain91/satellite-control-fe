export type CameraPreset = "overview" | "panels" | "screens";

export const CAMERA_PRESETS: readonly CameraPreset[] = ["overview", "panels", "screens"] as const;

export const CAMERA_POSITIONS: Record<CameraPreset, {
  position: [number, number, number];
  target: [number, number, number];
}> = {
  overview: { position: [0, 6, 10],  target: [0, 1, 0] },
  panels:   { position: [0, 2, 4],   target: [0, 1.2, 0] },
  screens:  { position: [0, 2, -3],  target: [0, 2, -8] },
};
