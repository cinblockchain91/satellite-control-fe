"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { computeOrbitPosition } from "@satellite-control/entity-satellite";
import type { SatelliteOrbit } from "@satellite-control/entity-satellite";

/** Demo-scaled lookahead: 300 scene-seconds ≈ "+5 min" in the UI label. */
export const PREDICTION_WINDOW = 300;

interface PredictedMarkerProps {
  orbit: SatelliteOrbit;
  color: string;
}

export function PredictedMarker({ orbit, color }: PredictedMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const [x, y, z] = computeOrbitPosition(orbit, state.clock.elapsedTime + PREDICTION_WINDOW);
    groupRef.current.position.set(x, y, z);
  });

  return (
    <group ref={groupRef} position={computeOrbitPosition(orbit, PREDICTION_WINDOW)}>
      <mesh>
        <octahedronGeometry args={[0.06, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} wireframe />
      </mesh>
    </group>
  );
}
