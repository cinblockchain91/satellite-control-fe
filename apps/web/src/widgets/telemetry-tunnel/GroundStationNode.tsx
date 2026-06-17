"use client";

import { useState, useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { GroundStation } from "./ground-stations.data";

interface GroundStationNodeProps {
  data: GroundStation;
  color: string;
}

export function GroundStationNode({ data, color }: GroundStationNodeProps) {
  const [hovered, setHovered] = useState(false);

  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const outward = new THREE.Vector3(...data.position).normalize();
    return new THREE.Quaternion().setFromUnitVectors(up, outward);
  }, [data.position]);

  return (
    <group
      position={data.position}
      quaternion={quaternion}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* Antenna cone */}
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.03, 0.09, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.6 : 0.25} />
      </mesh>
      {/* Base ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.008, 6, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {hovered && (
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
