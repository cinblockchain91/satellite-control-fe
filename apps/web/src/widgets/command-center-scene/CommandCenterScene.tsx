"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { PerformanceMonitor } from "@/shared/3d";
import { RoomGeometry } from "./RoomGeometry";
import {
  CAMERA_POSITIONS,
  SCENE_BACKGROUND_COLOR,
  SCENE_AMBIENT_INTENSITY,
  SCENE_DIRECTIONAL_POSITION,
  SCENE_DIRECTIONAL_INTENSITY,
  SCENE_DIRECTIONAL_COLOR,
  CAMERA_MIN_DISTANCE,
  CAMERA_MAX_DISTANCE,
  CAMERA_DAMPING_FACTOR,
  WORKSTATION_CONFIGS,
  SCREEN_CONFIGS,
} from "./scene-config";
import type { CameraPreset } from "./scene-config";
import { WorkStation } from "./WorkStation";
import { ControlPanel } from "./ControlPanel";
import { StatusScreen } from "./StatusScreen";

export interface CommandCenterSceneHandle {
  resetView: () => void;
}

interface CommandCenterSceneProps {
  cameraPreset: CameraPreset;
  onLowFps: (isLow: boolean) => void;
}

export const CommandCenterScene = forwardRef<CommandCenterSceneHandle, CommandCenterSceneProps>(
  function CommandCenterScene({ cameraPreset, onLowFps }, ref) {
    const controlsRef = useRef<React.ComponentRef<typeof CameraControls>>(null);
    const isMountedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      resetView() {
        const { position, target } = CAMERA_POSITIONS.overview;
        const [px, py, pz] = position;
        const [tx, ty, tz] = target;
        void controlsRef.current?.setLookAt(px, py, pz, tx, ty, tz, true);
      },
    }), []);

    useEffect(() => {
      const { position, target } = CAMERA_POSITIONS[cameraPreset];
      const [px, py, pz] = position;
      const [tx, ty, tz] = target;
      const animate = isMountedRef.current;
      isMountedRef.current = true;
      void controlsRef.current?.setLookAt(px, py, pz, tx, ty, tz, animate);
    }, [cameraPreset]);

    return (
      <>
        <color attach="background" args={[SCENE_BACKGROUND_COLOR]} />

        <ambientLight intensity={SCENE_AMBIENT_INTENSITY} />
        <directionalLight
          position={SCENE_DIRECTIONAL_POSITION}
          intensity={SCENE_DIRECTIONAL_INTENSITY}
          color={SCENE_DIRECTIONAL_COLOR}
        />

        <PerformanceMonitor onLowFps={onLowFps} />

        <RoomGeometry />

        {WORKSTATION_CONFIGS.map((cfg, i) => (
          <WorkStation key={i} position={cfg.position} rotationY={cfg.rotationY} />
        ))}

        <ControlPanel />

        {SCREEN_CONFIGS.map((cfg, i) => (
          <StatusScreen key={i} position={cfg.position} />
        ))}

        <CameraControls
          ref={controlsRef}
          minDistance={CAMERA_MIN_DISTANCE}
          maxDistance={CAMERA_MAX_DISTANCE}
          dampingFactor={CAMERA_DAMPING_FACTOR}
        />
      </>
    );
  },
);
