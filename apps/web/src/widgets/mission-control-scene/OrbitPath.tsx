"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import type { SatelliteOrbit } from "@satellite-control/entity-satellite";
import { orbitToPoints } from "./orbit-to-points";

interface OrbitPathProps {
  orbit: SatelliteOrbit;
  color: string;
  isSelected: boolean;
  isAtRisk: boolean;
  isOffline: boolean;
}

export function OrbitPath({ orbit, color, isSelected, isAtRisk, isOffline }: OrbitPathProps) {
  const points = useMemo(() => {
    const pts = orbitToPoints(orbit);
    return [...pts, pts[0]!] as [number, number, number][];
  }, [orbit]);

  const lineColor = isAtRisk ? "#ef4444" : color;
  const opacity = isOffline ? 0.08 : isSelected ? 0.85 : isAtRisk ? 0.7 : 0.2;

  return (
    <Line
      points={points}
      color={lineColor}
      lineWidth={isAtRisk ? 1.5 : 1}
      opacity={opacity}
      transparent
      depthWrite={false}
    />
  );
}
