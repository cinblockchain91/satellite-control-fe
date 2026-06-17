"use client";

import { Line } from "@react-three/drei";

interface TelemetryBeamProps {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  isOffline?: boolean;
}

export function TelemetryBeam({ from, to, color = "#38bdf8", isOffline = false }: TelemetryBeamProps) {
  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={1}
      opacity={isOffline ? 0.08 : 0.35}
      transparent
      depthWrite={false}
    />
  );
}
