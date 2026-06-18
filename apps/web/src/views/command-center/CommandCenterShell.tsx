"use client";

import { SceneCanvasLazy } from "@/shared/3d";

export function CommandCenterShell() {
  return (
    <main data-testid="command-center-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <SceneCanvasLazy className="h-full w-full" />
    </main>
  );
}
