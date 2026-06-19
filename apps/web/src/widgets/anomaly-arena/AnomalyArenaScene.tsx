"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { CameraControls, Stars, Stats } from "@react-three/drei";
import { Earth, PerformanceMonitor } from "@/shared/3d";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import { detectAnomalies, ANOMALY_VISUAL_RULES } from "./anomaly-detection";
import { AnomalySatellite } from "./AnomalySatellite";
import { AlertRegion } from "./AlertRegion";

// Camera position and look-at target for the arena overview.
// Elevated angle (y=4) gives a wider view of all orbital rings + alert regions.
const CAM_POS = [0, 4, 7] as const;
const CAM_TARGET = [0, 0, 0] as const;
const CAM_MIN_DISTANCE = 0.5;
const CAM_MAX_DISTANCE = 20;
const CAM_DAMPING = 0.05;

// Equatorial ring that frames the scene as an "arena floor".
const ARENA_RING_RADIUS = 4.5;
const ARENA_RING_TUBE = 0.008;
const ARENA_RING_RADIAL_SEGMENTS = 8;
const ARENA_RING_TUBULAR_SEGMENTS = 128;
// Deep indigo — barely visible; purpose is to trace the arena boundary, not dominate.
const ARENA_FLOOR_COLOR = "#1a1a3e";
const ARENA_FLOOR_OPACITY = 0.5;

// Scene atmosphere — much darker than Mission Control to reinforce crisis feel.
const SCENE_BACKGROUND = "#04060d";
const AMBIENT_INTENSITY = 0.15;
// Cool bluish-white key light — distinct from the warm sun used in Mission Control.
const DIRECTIONAL_COLOR = "#e8eeff";
const DIRECTIONAL_INTENSITY = 1.2;
const DIRECTIONAL_POS = [5, 5, 5] as const;

// Starfield — same params as Mission Control for visual consistency.
const STARS_RADIUS = 200;
const STARS_DEPTH = 60;
const STARS_COUNT = 4000;
const STARS_FACTOR = 4;

export interface AnomalyArenaSceneHandle {
  resetView(): void;
}

interface AnomalyArenaSceneProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onLowFps?: ((isLow: boolean) => void) | undefined;
}

export const AnomalyArenaScene = forwardRef<AnomalyArenaSceneHandle, AnomalyArenaSceneProps>(
  function AnomalyArenaScene({ selectedId, onSelect, onLowFps }, ref) {
    const controlsRef = useRef<React.ComponentRef<typeof CameraControls>>(null);

    useImperativeHandle(ref, () => ({
      resetView: () => {
        void controlsRef.current?.setLookAt(...CAM_POS, ...CAM_TARGET, true);
      },
    }), []);

    // Override SceneCanvas default camera [0, 0, 5] on mount.
    useEffect(() => {
      void controlsRef.current?.setLookAt(...CAM_POS, ...CAM_TARGET, false);
    }, []);

    // Anomaly classification is static over mock data — recompute only on mount.
    // When real-time telemetry lands, add telemetry to the dependency array.
    const satelliteAnomalies = useMemo(
      () =>
        MOCK_SATELLITES.map((sat) => {
          const anomalies = detectAnomalies(sat.telemetry, sat.status);
          const primary = anomalies[0];
          return {
            sat,
            isAnomalous: anomalies.length > 0,
            anomalyColor: primary
              ? ANOMALY_VISUAL_RULES[primary.type].color
              : "#374151",
          };
        }),
      [],
    );

    return (
      <>
        <color attach="background" args={[SCENE_BACKGROUND]} />

        <ambientLight intensity={AMBIENT_INTENSITY} />
        <directionalLight position={DIRECTIONAL_POS} intensity={DIRECTIONAL_INTENSITY} color={DIRECTIONAL_COLOR} />

        <Stars radius={STARS_RADIUS} depth={STARS_DEPTH} count={STARS_COUNT} factor={STARS_FACTOR} fade />

        <Earth />

        {/* Equatorial arena ring — subtle boundary that frames the scene */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ARENA_RING_RADIUS, ARENA_RING_TUBE, ARENA_RING_RADIAL_SEGMENTS, ARENA_RING_TUBULAR_SEGMENTS]} />
          <meshBasicMaterial color={ARENA_FLOOR_COLOR} transparent opacity={ARENA_FLOOR_OPACITY} />
        </mesh>

        {satelliteAnomalies.map(({ sat, isAnomalous, anomalyColor }) => (
          <group key={sat.id}>
            <AnomalySatellite
              data={sat}
              isAnomalous={isAnomalous}
              anomalyColor={anomalyColor}
              isSelected={selectedId === sat.id}
              onSelect={() => onSelect(selectedId === sat.id ? null : sat.id)}
            />
            {isAnomalous && (
              <AlertRegion orbit={sat.orbit} color={anomalyColor} />
            )}
          </group>
        ))}

        <CameraControls
          ref={controlsRef}
          minDistance={CAM_MIN_DISTANCE}
          maxDistance={CAM_MAX_DISTANCE}
          dampingFactor={CAM_DAMPING}
        />
        {process.env.NODE_ENV === "development" && <Stats />}
        {onLowFps && <PerformanceMonitor onLowFps={onLowFps} />}
      </>
    );
  },
);
