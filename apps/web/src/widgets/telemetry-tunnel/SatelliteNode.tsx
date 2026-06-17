"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import type { Satellite } from "@satellite-control/entity-satellite";

interface SatelliteNodeProps {
  data: Satellite;
  color: string;
}

export function SatelliteNode({ data, color }: SatelliteNodeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={data.position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      <mesh>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.25}
          opacity={data.status === "offline" ? 0.45 : 1}
          transparent={data.status === "offline"}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.04, 0.32, 0.08]} />
        <meshStandardMaterial color={color} opacity={0.7} transparent emissive={color} emissiveIntensity={0.15} />
      </mesh>
      {hovered && (
        <Html position={[0, 0.25, 0]} center distanceFactor={8}>
          <div className="pointer-events-none flex items-center gap-1.5 whitespace-nowrap rounded border border-border bg-background/90 px-2 py-0.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
}
