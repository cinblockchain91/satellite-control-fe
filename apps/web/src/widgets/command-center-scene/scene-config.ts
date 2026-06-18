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

export const SCENE_AMBIENT_INTENSITY = 1.5;
export const SCENE_DIRECTIONAL_POSITION: [number, number, number] = [0, 6, 4];
export const SCENE_DIRECTIONAL_INTENSITY = 2.5;
export const SCENE_DIRECTIONAL_COLOR = "#fff0e0";

export const CAMERA_MIN_DISTANCE = 0.5;
export const CAMERA_MAX_DISTANCE = 15;
export const CAMERA_DAMPING_FACTOR = 0.05;

export interface WorkStationConfig {
  position: [number, number, number];
  rotationY: number;
}

export const WORKSTATION_CONFIGS: readonly WorkStationConfig[] = [
  { position: [-4.5, 0, 2.5], rotationY:  0.49 },
  { position: [-1.5, 0, 1.5], rotationY:  0.20 },
  { position: [ 1.5, 0, 1.5], rotationY: -0.20 },
  { position: [ 4.5, 0, 2.5], rotationY: -0.49 },
];

export interface ScreenConfig {
  position: [number, number, number];
}

export const SCREEN_WIDTH = 3.0;
export const SCREEN_HEIGHT = 1.5;

export const SCREEN_CONFIGS: readonly ScreenConfig[] = [
  { position: [-2.5, 2.8, -5.85] },
  { position: [ 2.5, 2.8, -5.85] },
  { position: [-2.5, 1.0, -5.85] },
  { position: [ 2.5, 1.0, -5.85] },
];
