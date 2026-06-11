"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

export interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function SceneCanvas({ children, className }: SceneCanvasProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls enableDamping />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
