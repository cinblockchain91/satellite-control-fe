"use client";

import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Suspense } from "react";
import { SceneLoaderOverlay } from "./scene-loader-overlay";

export interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
}

function CanvasLoader() {
  return (
    <Html fullscreen>
      <SceneLoaderOverlay />
    </Html>
  );
}

export function SceneCanvas({ children, className }: SceneCanvasProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={<CanvasLoader />}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
