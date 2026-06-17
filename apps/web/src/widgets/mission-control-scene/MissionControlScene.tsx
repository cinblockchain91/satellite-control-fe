"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { CameraControls, Stars, Stats } from "@react-three/drei";
import * as THREE from "three";
import { Earth } from "./Earth";
import { OrbitPath } from "./OrbitPath";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { PredictedMarker } from "./PredictedMarker";
import { Satellite } from "./Satellite";
import { detectConjunctions } from "./detect-conjunctions";
import { MOCK_SATELLITES, STATUS_COLORS } from "./satellites.data";

export interface CameraControlsHandle {
  resetView(): void;
}

interface MissionControlSceneProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onLowFps?: ((isLow: boolean) => void) | undefined;
}

export const MissionControlScene = forwardRef<CameraControlsHandle, MissionControlSceneProps>(
  function MissionControlScene({ selectedId, onSelect, onLowFps }, ref) {
    const controlsRef = useRef<React.ComponentRef<typeof CameraControls>>(null);
    const [conjunctionIds, setConjunctionIds] = useState<Set<string>>(new Set());
    const lastCheckSecRef = useRef(-1);

    useFrame((state) => {
      const sec = Math.floor(state.clock.elapsedTime);
      if (sec === lastCheckSecRef.current) return;
      lastCheckSecRef.current = sec;
      const pairs = detectConjunctions(MOCK_SATELLITES, state.clock.elapsedTime);
      setConjunctionIds(new Set(pairs.flatMap(([a, b]) => [a, b])));
    });

    useImperativeHandle(
      ref,
      () => ({
        resetView: () => {
          void controlsRef.current?.setLookAt(0, 0, 5, 0, 0, 0, true);
        },
      }),
      [],
    );

    useEffect(() => {
      const controls = controlsRef.current;
      if (!controls) return;
      if (selectedId) {
        const sat = MOCK_SATELLITES.find((s) => s.id === selectedId);
        if (sat) {
          const target = new THREE.Vector3(...sat.position);
          const camPos = target.clone().add(target.clone().normalize().multiplyScalar(0.8));
          void controls.setLookAt(camPos.x, camPos.y, camPos.z, target.x, target.y, target.z, true);
        }
      } else {
        void controls.setLookAt(0, 0, 5, 0, 0, 0, true);
      }
    }, [selectedId]);

    return (
      <>
        <color attach="background" args={["#080c14"]} />

        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#fff8e7" />

        <Stars radius={200} depth={60} count={4000} factor={4} fade />

        <Earth />

        {MOCK_SATELLITES.map((sat) => (
          <OrbitPath
            key={sat.id}
            orbit={sat.orbit}
            color={STATUS_COLORS[sat.status]}
            isSelected={selectedId === sat.id}
            isAtRisk={conjunctionIds.has(sat.id)}
            isOffline={sat.status === "offline"}
          />
        ))}

        {MOCK_SATELLITES.map((sat) => (
          <PredictedMarker
            key={sat.id}
            orbit={sat.orbit}
            color={STATUS_COLORS[sat.status]}
          />
        ))}

        {MOCK_SATELLITES.map((sat) => (
          <Satellite
            key={sat.id}
            data={sat}
            isSelected={selectedId === sat.id}
            isAtRisk={conjunctionIds.has(sat.id)}
            onSelect={() => onSelect(selectedId === sat.id ? null : sat.id)}
          />
        ))}

        <CameraControls
          ref={controlsRef}
          minDistance={0.5}
          maxDistance={20}
          dampingFactor={0.05}
        />
        {process.env.NODE_ENV === "development" && <Stats />}
        {onLowFps && <PerformanceMonitor onLowFps={onLowFps} />}
      </>
    );
  },
);
