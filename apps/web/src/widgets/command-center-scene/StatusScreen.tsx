import { useState } from "react";
import { Html, useCursor } from "@react-three/drei";
import type { Satellite } from "@satellite-control/entity-satellite";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./scene-config";
import { SatelliteStatusPanel } from "./SatelliteStatusPanel";

const BEZEL_INSET = 0.1;
const BEZEL_DEPTH = 0.08;
const FRAME_COLOR = "#0d1020";
const SCREEN_COLOR = "#000a1f";
const SCREEN_EMISSIVE = "#0020aa";
const SCREEN_EMISSIVE_INTENSITY = 1.2;
const SELECTED_BEZEL_EMISSIVE = "#1040a0";
const SELECTED_BEZEL_EMISSIVE_INTENSITY = 0.5;
const GLOW_LIGHT_COLOR = "#1040ff";
const GLOW_LIGHT_INTENSITY = 1.5;
const GLOW_LIGHT_DISTANCE = 6;

interface StatusScreenProps {
  position: [number, number, number];
  satellite: Satellite | undefined;
  isSelected: boolean;
  onSelect: () => void;
}

export function StatusScreen({ position, satellite, isSelected, onSelect }: StatusScreenProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && satellite !== undefined);

  return (
    <group position={position}>
      {/* Clickable bezel — emissive tint when selected */}
      <mesh
        onClick={(e) => { e.stopPropagation(); if (satellite !== undefined) onSelect(); }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[SCREEN_WIDTH + BEZEL_INSET, SCREEN_HEIGHT + BEZEL_INSET, BEZEL_DEPTH]} />
        <meshStandardMaterial
          color={FRAME_COLOR}
          emissive={isSelected ? SELECTED_BEZEL_EMISSIVE : "#000000"}
          emissiveIntensity={isSelected ? SELECTED_BEZEL_EMISSIVE_INTENSITY : 0}
          roughness={0.9}
        />
      </mesh>
      {/* Emissive screen surface */}
      <mesh position={[0, 0, BEZEL_DEPTH / 2 + 0.005]}>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshStandardMaterial
          color={SCREEN_COLOR}
          emissive={SCREEN_EMISSIVE}
          emissiveIntensity={SCREEN_EMISSIVE_INTENSITY}
        />
      </mesh>
      {/* Screen glow */}
      <pointLight
        color={GLOW_LIGHT_COLOR}
        intensity={GLOW_LIGHT_INTENSITY}
        distance={GLOW_LIGHT_DISTANCE}
      />
      {/* Telemetry overlay — only when a satellite is assigned */}
      {satellite !== undefined && (
        <Html
          center
          transform
          distanceFactor={6}
          position={[0, 0, BEZEL_DEPTH / 2 + 0.01]}
        >
          <SatelliteStatusPanel satellite={satellite} />
        </Html>
      )}
    </group>
  );
}
