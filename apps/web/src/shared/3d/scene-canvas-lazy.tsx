"use client";

import dynamic from "next/dynamic";
import { SceneLoaderOverlay } from "./scene-loader-overlay";

export const SceneCanvasLazy = dynamic(
  () => import("./scene-canvas").then((m) => m.SceneCanvas),
  { ssr: false, loading: () => <SceneLoaderOverlay /> }
);
