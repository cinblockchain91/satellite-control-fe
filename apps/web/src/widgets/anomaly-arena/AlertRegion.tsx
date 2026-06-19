"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { computeOrbitPosition } from "@satellite-control/entity-satellite";
import type { SatelliteOrbit } from "@satellite-control/entity-satellite";
import type { AnomalySeverity } from "./anomaly-detection";

const RING_RADIUS = 0.45;
const RING_TUBE = 0.015;
const RING_RADIAL_SEGMENTS = 8;
const RING_TUBULAR_SEGMENTS = 64;

const RING_SCALE_MIN = 1.0;
const RING_SCALE_MAX = 1.15;
const RING_OPACITY_MIN = 0.3;
const RING_OPACITY_MAX = 0.5;

// Pulse frequencies — hardcoded here; Issue #114 extracts these as named animation constants.
const PULSE_FREQ_WARNING = 0.5;  // Hz — one pulse every 2 s
const PULSE_FREQ_CRITICAL = 1.2; // Hz — one pulse every ~0.8 s

interface AlertRegionProps {
  orbit: SatelliteOrbit;
  color: string;
  severity: AnomalySeverity;
}

export function AlertRegion({ orbit, color, severity }: AlertRegionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const [x, y, z] = computeOrbitPosition(orbit, state.clock.elapsedTime);
    meshRef.current.position.set(x, y, z);

    const freq = severity === "critical" ? PULSE_FREQ_CRITICAL : PULSE_FREQ_WARNING;
    const t = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * freq * Math.PI * 2);
    meshRef.current.scale.setScalar(RING_SCALE_MIN + (RING_SCALE_MAX - RING_SCALE_MIN) * t);
    matRef.current.opacity = RING_OPACITY_MIN + (RING_OPACITY_MAX - RING_OPACITY_MIN) * t;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[RING_RADIUS, RING_TUBE, RING_RADIAL_SEGMENTS, RING_TUBULAR_SEGMENTS]} />
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={RING_OPACITY_MIN} />
    </mesh>
  );
}
