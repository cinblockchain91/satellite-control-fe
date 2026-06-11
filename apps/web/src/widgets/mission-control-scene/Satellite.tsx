"use client";

import { type SatelliteData, STATUS_COLORS } from "./satellites.data";

interface SatelliteProps {
  data: SatelliteData;
}

export function Satellite({ data }: SatelliteProps) {
  const color = STATUS_COLORS[data.status];

  return (
    <group position={data.position}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Solar panels */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.05, 0.4, 0.1]} />
        <meshStandardMaterial color={color} opacity={0.8} transparent />
      </mesh>
    </group>
  );
}
