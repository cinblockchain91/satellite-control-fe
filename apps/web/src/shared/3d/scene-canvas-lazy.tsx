"use client";

import dynamic from "next/dynamic";

export const SceneCanvasLazy = dynamic(
  () => import("./scene-canvas").then((m) => m.SceneCanvas),
  { ssr: false }
);
