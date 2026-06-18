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

export const SCENE_BACKGROUND_COLOR = "#080c14";

export const SCENE_AMBIENT_INTENSITY = 0.25;
export const SCENE_DIRECTIONAL_POSITION: [number, number, number] = [0, 6, 4];
export const SCENE_DIRECTIONAL_INTENSITY = 1.5;
export const SCENE_DIRECTIONAL_COLOR = "#fff0e0";

export const CAMERA_MIN_DISTANCE = 0.5;
export const CAMERA_MAX_DISTANCE = 15;
export const CAMERA_DAMPING_FACTOR = 0.05;
