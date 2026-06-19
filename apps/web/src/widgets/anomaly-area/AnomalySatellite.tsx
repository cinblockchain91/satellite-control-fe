"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type * as THREE from "three";
import { computeOrbitPosition } from "@satellite-control/entity-satellite";
import type { Satellite } from "@/widgets/mission-control-scene";

const NOMINAL_COLOR = "#374151"; // gray-700 — dim stand-in for non-anomalous satellites
const NOMINAL_OPACITY = 0.15;

// Satellite body geometry (cube side length in scene units).
const BODY_SIZE = 0.15;
// Solar panel geometry — thin horizontal wing extending from body.
const PANEL_WIDTH = 0.05;
const PANEL_SPAN = 0.4;
const PANEL_DEPTH = 0.1;
const PANEL_OPACITY = 0.8;
const PANEL_EMISSIVE_INTENSITY = 0.2;

// Scale multipliers applied to the group on interaction.
const SCALE_SELECTED = 1.4;
const SCALE_HOVERED = 1.2;

// Emissive glow intensity for anomalous satellites, driven by interaction state.
const EMISSIVE_SELECTED = 0.9;
const EMISSIVE_HOVERED = 0.5;
const EMISSIVE_IDLE = 0.3;

// Tooltip positioning and rendering.
const TOOLTIP_OFFSET: [number, number, number] = [0, 0.28, 0];
const TOOLTIP_DISTANCE_FACTOR = 8;

interface AnomalySatelliteProps {
  data: Satellite;
  isAnomalous: boolean;
  anomalyColor: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function AnomalySatellite({
  data,
  isAnomalous,
  anomalyColor,
  isSelected,
  onSelect,
}: AnomalySatelliteProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  // Reset cursor if this satellite unmounts while the pointer is still over it.
  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const [x, y, z] = computeOrbitPosition(data.orbit, state.clock.elapsedTime);
    groupRef.current.position.set(x, y, z);

    if (!bodyRef.current) return;
    if (isAnomalous) {
      bodyRef.current.emissiveIntensity = isSelected ? EMISSIVE_SELECTED : hovered ? EMISSIVE_HOVERED : EMISSIVE_IDLE;
    } else {
      bodyRef.current.emissiveIntensity = 0;
    }
  });

  const color = isAnomalous ? anomalyColor : NOMINAL_COLOR;
  const scale = isSelected ? SCALE_SELECTED : hovered ? SCALE_HOVERED : 1;

  return (
    <group
      ref={groupRef}
      position={data.position}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* Satellite body */}
      <mesh>
        <boxGeometry args={[BODY_SIZE, BODY_SIZE, BODY_SIZE]} />
        <meshStandardMaterial
          ref={bodyRef}
          color={color}
          emissive={color}
          emissiveIntensity={0}
          opacity={isAnomalous ? 1 : NOMINAL_OPACITY}
          transparent={!isAnomalous}
        />
      </mesh>

      {/* Solar panels — omitted for nominal satellites to reduce visual noise */}
      {isAnomalous && (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[PANEL_WIDTH, PANEL_SPAN, PANEL_DEPTH]} />
          <meshStandardMaterial
            color={color}
            opacity={PANEL_OPACITY}
            transparent
            emissive={color}
            emissiveIntensity={PANEL_EMISSIVE_INTENSITY}
          />
        </mesh>
      )}

      {hovered && (
        <Html position={TOOLTIP_OFFSET} center distanceFactor={TOOLTIP_DISTANCE_FACTOR}>
          <div className="pointer-events-none flex items-center gap-1.5 whitespace-nowrap rounded border border-border bg-background/90 px-2 py-0.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-sm">
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
}
