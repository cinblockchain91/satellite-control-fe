"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import type * as THREE from "three";

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("/textures/earth.jpg", (t) => {
      t.colorSpace = "srgb";
      const mat = materialRef.current;
      if (!mat) return;
      mat.map = t;
      mat.color.set("#ffffff");
      mat.needsUpdate = true;
    });
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial ref={materialRef} color="#1a6b3c" roughness={0.8} />
    </mesh>
  );
}
