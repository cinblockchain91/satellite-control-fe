"use client";

import { useState, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GroundStation } from "./ground-stations.data";

const PING_FREQUENCY = 0.6;   // Hz — active station radar sweep rate
const PING_MAX_SCALE = 2.2;   // ring expands to this multiple of its base size
const PING_MAX_OPACITY = 0.45;
const DIM_NODE_OPACITY = 0.12;

interface GroundStationNodeProps {
  data: GroundStation;
  color: string;
  isActive?: boolean;
}

export function GroundStationNode({ data, color, isActive = true }: GroundStationNodeProps) {
  const [hovered, setHovered] = useState(false);
  const pingRef = useRef<THREE.Mesh>(null);

  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const outward = new THREE.Vector3(...data.position).normalize();
    return new THREE.Quaternion().setFromUnitVectors(up, outward);
  }, [data.position]);

  useFrame((state) => {
    if (!pingRef.current) return;
    const progress = (state.clock.elapsedTime * PING_FREQUENCY) % 1;
    pingRef.current.scale.setScalar(1.0 + (PING_MAX_SCALE - 1.0) * progress);
    (pingRef.current.material as THREE.MeshBasicMaterial).opacity = PING_MAX_OPACITY * (1 - progress);
  });

  return (
    <group
      position={data.position}
      quaternion={quaternion}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.03, 0.09, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? (hovered ? 0.6 : 0.25) : 0}
          opacity={isActive ? 1 : DIM_NODE_OPACITY}
          transparent={!isActive}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.008, 6, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.3 : 0}
          opacity={isActive ? 1 : DIM_NODE_OPACITY}
          transparent={!isActive}
        />
      </mesh>
      {isActive && data.status === "active" && (
        <mesh ref={pingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.04, 0.004, 6, 16]} />
          <meshBasicMaterial color={color} transparent opacity={PING_MAX_OPACITY} depthWrite={false} />
        </mesh>
      )}
      {isActive && hovered && (
        <Html position={[0, 0.18, 0]} center distanceFactor={8}>
          <div className="pointer-events-none flex items-center gap-1.5 whitespace-nowrap rounded border border-border bg-background/90 px-2 py-0.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
}
