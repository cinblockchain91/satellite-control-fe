"use client";

import { useState, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Satellite } from "@satellite-control/entity-satellite";
import type { TelemetryStreamState } from "./telemetry-stream";

const SELECTION_RING_RADIUS = 0.14;  // outside the pulse ring (0.1) so both are visible simultaneously
const SELECTION_RING_TUBE = 0.004;
const SELECTION_RING_OPACITY = 0.7;
const DIM_NODE_OPACITY = 0.12;

const PULSE_CONFIG: Record<Exclude<TelemetryStreamState, "nominal">, {
  frequency: number;
  maxScale: number;
  maxOpacity: number;
  color: string;
}> = {
  warning:  { frequency: 1.0, maxScale: 2.0, maxOpacity: 0.50, color: "#fbbf24" },
  critical: { frequency: 2.5, maxScale: 2.8, maxOpacity: 0.85, color: "#f87171" },
};

interface SatelliteNodeProps {
  data: Satellite;
  color: string;
  streamState: TelemetryStreamState;
  isSelected: boolean;
  isActive?: boolean;
  onSelect: () => void;
}

export function SatelliteNode({ data, color, streamState, isSelected, isActive = true, onSelect }: SatelliteNodeProps) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);

  const pulseConfig = streamState === "nominal" ? null : PULSE_CONFIG[streamState];

  useFrame((state) => {
    if (!ringRef.current || !pulseConfig) return;
    const progress = (state.clock.elapsedTime * pulseConfig.frequency) % 1;
    ringRef.current.scale.setScalar(1.0 + (pulseConfig.maxScale - 1.0) * progress);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
      pulseConfig.maxOpacity * (1 - progress);
  });

  return (
    <group
      position={data.position}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      <mesh>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? (isSelected ? 0.9 : hovered ? 0.6 : 0.25) : 0}
          opacity={isActive ? (data.status === "offline" ? 0.45 : 1) : DIM_NODE_OPACITY}
          transparent={!isActive || data.status === "offline"}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.04, 0.32, 0.08]} />
        <meshStandardMaterial color={color} opacity={isActive ? 0.7 : DIM_NODE_OPACITY} transparent emissive={color} emissiveIntensity={isActive ? 0.15 : 0} />
      </mesh>
      {isSelected && (
        <mesh>
          <torusGeometry args={[SELECTION_RING_RADIUS, SELECTION_RING_TUBE, 6, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={SELECTION_RING_OPACITY} depthWrite={false} />
        </mesh>
      )}
      {isActive && pulseConfig !== null && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.1, 0.006, 6, 32]} />
          <meshBasicMaterial
            color={pulseConfig.color}
            transparent
            opacity={pulseConfig.maxOpacity}
            depthWrite={false}
          />
        </mesh>
      )}
      {isActive && hovered && (
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
