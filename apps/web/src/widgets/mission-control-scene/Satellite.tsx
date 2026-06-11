"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { type Satellite, STATUS_COLORS } from "./satellites.data";

interface SatelliteProps {
  data: Satellite;
  isSelected: boolean;
  onSelect: () => void;
}

export function Satellite({ data, isSelected, onSelect }: SatelliteProps) {
  const color = STATUS_COLORS[data.status];
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.MeshStandardMaterial>(null);
  const { healthScore } = data.telemetry;

  useFrame((state, delta) => {
    if (isSelected && ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
    }

    if (!bodyRef.current) return;

    if (isSelected) {
      bodyRef.current.emissiveIntensity = 0.8;
    } else if (hovered) {
      bodyRef.current.emissiveIntensity = 0.3;
    } else if (healthScore < 50) {
      // Low health: pulse speed and intensity scale with severity
      const speed = healthScore < 30 ? 3 : 1.5;
      const maxIntensity = healthScore < 30 ? 0.35 : 0.18;
      bodyRef.current.emissiveIntensity =
        (Math.sin(state.clock.elapsedTime * speed) * 0.5 + 0.5) * maxIntensity;
    } else {
      bodyRef.current.emissiveIntensity = 0;
    }
  });

  const scale = isSelected ? 1.4 : hovered ? 1.2 : 1;

  return (
    <group
      position={data.position}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      <mesh>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial
          ref={bodyRef}
          color={color}
          emissive={color}
          emissiveIntensity={0}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.05, 0.4, 0.1]} />
        <meshStandardMaterial
          color={color}
          opacity={0.8}
          transparent
          emissive={color}
          emissiveIntensity={isSelected ? 0.6 : 0}
        />
      </mesh>
      {isSelected && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.02, 8, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
    </group>
  );
}
