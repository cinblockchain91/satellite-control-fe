"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { computeOrbitPosition } from "@satellite-control/entity-satellite";
import type { SatelliteOrbit } from "@satellite-control/entity-satellite";

const RING_RADIUS = 0.45;
const RING_TUBE = 0.015;
const RING_RADIAL_SEGMENTS = 8;
const RING_TUBULAR_SEGMENTS = 64;
const RING_OPACITY = 0.5;

interface AlertRegionProps {
  orbit: SatelliteOrbit;
  color: string;
}

/**
 * A torus ring that follows a satellite along its orbit, marking the
 * surrounding space as an alert zone.  Positioned in the XZ plane at
 * the satellite's current location.
 *
 * Static for issue #108 — animation (pulse, scale) is added in issue #114.
 */
export function AlertRegion({ orbit, color }: AlertRegionProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const [x, y, z] = computeOrbitPosition(orbit, state.clock.elapsedTime);
    ref.current.position.set(x, y, z);
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[RING_RADIUS, RING_TUBE, RING_RADIAL_SEGMENTS, RING_TUBULAR_SEGMENTS]} />
      <meshBasicMaterial color={color} transparent opacity={RING_OPACITY} />
    </mesh>
  );
}
