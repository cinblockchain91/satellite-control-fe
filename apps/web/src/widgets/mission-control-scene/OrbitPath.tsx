"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import type { SatelliteOrbit } from "@satellite-control/entity-satellite";
import { orbitToPoints } from "./orbit-to-points";

interface OrbitPathProps {
  orbit: SatelliteOrbit;
  color: string;
  isSelected: boolean;
}

export function OrbitPath({ orbit, color, isSelected }: OrbitPathProps) {
  const points = useMemo(() => {
    const pts = orbitToPoints(orbit);
    // Append first point to close the loop without relying on a `closed` prop
    return [...pts, pts[0]!] as [number, number, number][];
  }, [orbit]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      opacity={isSelected ? 0.85 : 0.2}
      transparent
      depthWrite={false}
    />
  );
}
