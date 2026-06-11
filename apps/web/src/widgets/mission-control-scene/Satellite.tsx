"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { type SatelliteData, STATUS_COLORS } from "./satellites.data";

interface SatelliteProps {
  data: SatelliteData;
  isSelected: boolean;
  onSelect: () => void;
}

export function Satellite({ data, isSelected, onSelect }: SatelliteProps) {
  const color = STATUS_COLORS[data.status];
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (isSelected && ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
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
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.3 : 0}
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
