"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FLOW_PARTICLE_COUNT = 4;
const FLOW_SPEED = 0.4;         // normalized units/second: 1.0 = full beam length per second
const FLOW_PARTICLE_COLOR = "#7dd3fc"; // sky-400 — contrasts with status-colored beams
const FLOW_PARTICLE_RADIUS = 0.02;

interface FlowParticlesProps {
  from: [number, number, number];
  to: [number, number, number];
  isOffline?: boolean;
}

export function FlowParticles({ from, to, isOffline = false }: FlowParticlesProps) {
  const particleRefs = useRef<(THREE.Group | null)[]>(
    Array.from({ length: FLOW_PARTICLE_COUNT }, () => null),
  );
  // Stable vectors for useFrame — not recomputed every render
  const fromVec = useRef(new THREE.Vector3(...from));
  const toVec = useRef(new THREE.Vector3(...to));

  useFrame((state) => {
    if (isOffline) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < FLOW_PARTICLE_COUNT; i++) {
      const group = particleRefs.current[i];
      if (!group) continue;
      // Phase offset spreads particles evenly along the beam at all times
      const progress = (t * FLOW_SPEED + i / FLOW_PARTICLE_COUNT) % 1;
      group.position.lerpVectors(fromVec.current, toVec.current, progress);
    }
  });

  if (isOffline) return null;

  return (
    <>
      {Array.from({ length: FLOW_PARTICLE_COUNT }, (_, i) => (
        <group
          key={i}
          ref={(el) => { particleRefs.current[i] = el; }}
          position={from}
        >
          <mesh>
            <sphereGeometry args={[FLOW_PARTICLE_RADIUS, 6, 6]} />
            <meshBasicMaterial color={FLOW_PARTICLE_COLOR} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
}
