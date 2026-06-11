"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function SceneCanvas({ children, className }: SceneCanvasProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
