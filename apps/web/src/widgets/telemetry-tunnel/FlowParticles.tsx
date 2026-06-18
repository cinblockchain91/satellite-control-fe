"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TelemetryStreamState } from "./telemetry-stream";

const FLOW_PARTICLE_COUNT = 4;
const FLOW_PARTICLE_RADIUS = 0.02;

const STREAM_STATE_COLORS: Record<TelemetryStreamState, string> = {
  nominal: "#7dd3fc",  // sky-400
  warning: "#fbbf24",  // amber-400
  critical: "#f87171", // red-400
};

const STREAM_STATE_SPEEDS: Record<TelemetryStreamState, number> = {
  nominal: 0.4,
  warning: 0.8,
  critical: 1.4,
};

interface FlowParticlesProps {
  from: [number, number, number];
  to: [number, number, number];
  streamState: TelemetryStreamState;
  isOffline?: boolean;
}

export function FlowParticles({ from, to, streamState, isOffline = false }: FlowParticlesProps) {
  const particleRefs = useRef<(THREE.Group | null)[]>(
    Array.from({ length: FLOW_PARTICLE_COUNT }, () => null),
  );
  const fromVec = useRef(new THREE.Vector3(...from));
  const toVec = useRef(new THREE.Vector3(...to));

  useFrame((state) => {
    if (isOffline) return;
    const t = state.clock.elapsedTime;
    const speed = STREAM_STATE_SPEEDS[streamState];
    for (let i = 0; i < FLOW_PARTICLE_COUNT; i++) {
      const group = particleRefs.current[i];
      if (!group) continue;
      const progress = (t * speed + i / FLOW_PARTICLE_COUNT) % 1;
      group.position.lerpVectors(fromVec.current, toVec.current, progress);
    }
  });

  if (isOffline) return null;

  const color = STREAM_STATE_COLORS[streamState];

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
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
}
