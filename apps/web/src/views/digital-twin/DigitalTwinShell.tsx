"use client";

import { useRef, useState } from "react";
import { SceneCanvasLazy } from "@/shared/3d";
import {
  CameraControlsOverlay,
  FleetLegend,
  MissionControlScene,
  MOCK_SATELLITES,
  type CameraControlsHandle,
} from "@/widgets/mission-control-scene";
import { TelemetryDrawer, TelemetryPanel } from "@/widgets/telemetry-panel";
import type { SelectedSatelliteInfo } from "@/widgets/telemetry-panel";

export function DigitalTwinShell() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sceneRef = useRef<CameraControlsHandle>(null);

  const found = selectedId
    ? (MOCK_SATELLITES.find((s) => s.id === selectedId) ?? null)
    : null;

  const selectedSatellite: SelectedSatelliteInfo | null = found
    ? { id: found.id, name: found.name, status: found.status, ...found.telemetry }
    : null;

  function handleCameraReset() {
    sceneRef.current?.resetView();
    setSelectedId(null);
  }

  return (
    <main data-testid="digital-twin-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative flex-1 min-w-0">
        <SceneCanvasLazy className="h-full w-full" onPointerMissed={() => setSelectedId(null)}>
          <MissionControlScene ref={sceneRef} selectedId={selectedId} onSelect={setSelectedId} />
        </SceneCanvasLazy>

        {/* Camera controls hint — bottom-center of canvas area */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <CameraControlsOverlay onReset={handleCameraReset} />
        </div>

        {/* Fleet legend — bottom-left, desktop only */}
        <div className="absolute bottom-4 left-4 hidden lg:block">
          <FleetLegend />
        </div>

        <TelemetryDrawer selectedSatellite={selectedSatellite} satellites={MOCK_SATELLITES} />
      </div>

      <TelemetryPanel
        className="hidden lg:flex"
        selectedSatellite={selectedSatellite}
        satellites={MOCK_SATELLITES}
      />
    </main>
  );
}
