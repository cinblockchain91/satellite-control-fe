"use client";

import { useState } from "react";
import { SceneCanvasLazy } from "@/shared/3d";
import { MissionControlScene, MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import { TelemetryDrawer, TelemetryPanel } from "@/widgets/telemetry-panel";
import type { SelectedSatelliteInfo } from "@/widgets/telemetry-panel";

export function DashboardShell() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const found = selectedId ? (MOCK_SATELLITES.find((s) => s.id === selectedId) ?? null) : null;
  const selectedSatellite: SelectedSatelliteInfo | null = found
    ? { id: found.id, name: found.name, status: found.status, ...found.telemetry }
    : null;

  return (
    <main className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative flex-1 min-w-0">
        <SceneCanvasLazy className="h-full w-full">
          <MissionControlScene selectedId={selectedId} onSelect={setSelectedId} />
        </SceneCanvasLazy>
        <TelemetryDrawer selectedSatellite={selectedSatellite} />
      </div>
      <TelemetryPanel className="hidden lg:flex" selectedSatellite={selectedSatellite} />
    </main>
  );
}
