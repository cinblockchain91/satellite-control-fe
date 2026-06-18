"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SceneCanvasLazy } from "@/shared/3d";
import type { CommandCenterSceneHandle, CameraPreset } from "@/widgets/command-center-scene";
import { CommandCenterScene } from "@/widgets/command-center-scene";

export function CommandCenterShell() {
  const [cameraPreset] = useState<CameraPreset>("overview");
  const [isLowFps, setIsLowFps] = useState(false);
  const sceneRef = useRef<CommandCenterSceneHandle>(null);
  const t = useTranslations("commandCenter");

  return (
    <main data-testid="command-center-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative min-w-0 flex-1">
        <SceneCanvasLazy className="h-full w-full">
          <CommandCenterScene
            ref={sceneRef}
            cameraPreset={cameraPreset}
            onLowFps={setIsLowFps}
          />
        </SceneCanvasLazy>

        {isLowFps && (
          <div
            role="alert"
            data-testid="low-fps-warning"
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-2.5 py-1.5 text-xs text-yellow-400"
          >
            {t("lowFpsWarning")}
          </div>
        )}
      </div>
    </main>
  );
}
