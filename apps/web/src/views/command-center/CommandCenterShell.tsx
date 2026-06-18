"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SceneCanvasLazy } from "@/shared/3d";
import { Button } from "@/shared/components/ui/button";
import type { CameraPreset } from "@/widgets/command-center-scene";
import { CommandCenterScene, useMockCommandDispatch, CAMERA_PRESETS } from "@/widgets/command-center-scene";
import type { SatelliteId } from "@satellite-control/entity-satellite";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import { useTunnelMockTelemetry } from "@/widgets/telemetry-tunnel";
import { toast } from "sonner";

export function CommandCenterShell() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");
  const [isLowFps, setIsLowFps] = useState(false);
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<SatelliteId | null>(null);
  const t = useTranslations("commandCenter");
  // Swap point: replace useMockCommandDispatch with a real dispatch hook when backend is ready
  const { commands, dispatch } = useMockCommandDispatch();
  const satellites = useTunnelMockTelemetry(MOCK_SATELLITES);

  function handleSelectSatellite(id: SatelliteId) {
    setSelectedSatelliteId(id);
    setCameraPreset("screens");
  }

  function handleSetCameraPreset(preset: CameraPreset) {
    setCameraPreset(preset);
    if (preset === "overview") setSelectedSatelliteId(null);
  }

  return (
    <main data-testid="command-center-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative min-w-0 flex-1">
        <SceneCanvasLazy className="h-full w-full">
          <CommandCenterScene
            cameraPreset={cameraPreset}
            onLowFps={setIsLowFps}
            selectedSatelliteId={selectedSatelliteId}
            onDispatch={(type) => {
              if (selectedSatelliteId === null) return;
              const satName =
                satellites.find((s) => s.id === selectedSatelliteId)?.name ??
                String(selectedSatelliteId);
              const command = t(`commandType.${type}`);
              toast.promise(dispatch(selectedSatelliteId, type), {
                loading: t("commandPending",      { satellite: satName, command }),
                success: t("commandAcknowledged", { satellite: satName, command }),
                error:   t("commandFailed",       { satellite: satName, command }),
              });
            }}
            commands={commands}
            satellites={satellites}
            onSelectSatellite={handleSelectSatellite}
            onFocusPanel={() => setCameraPreset("panels")}
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

        <div
          role="group"
          aria-label={t("cameraPresetLabel")}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-lg border border-white/10 bg-black/40 p-1 backdrop-blur-sm"
        >
          {CAMERA_PRESETS.map((preset) => (
            <Button
              key={preset}
              size="sm"
              variant={cameraPreset === preset ? "default" : "ghost"}
              aria-pressed={cameraPreset === preset}
              onClick={() => handleSetCameraPreset(preset)}
            >
              {t(`cameraPreset.${preset}`)}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
