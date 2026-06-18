"use client";

import { useState } from "react";
import { SceneCanvasLazy } from "@/shared/3d";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import type { SatelliteId } from "@satellite-control/entity-satellite";
import {
  MOCK_GROUND_STATIONS,
  TelemetryDetailPanel,
  TelemetryTunnelScene,
  useTunnelMockTelemetry,
} from "@/widgets/telemetry-tunnel";

export function TelemetryTunnelShell() {
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<SatelliteId | null>(null);
  const satellites = useTunnelMockTelemetry(MOCK_SATELLITES);

  return (
    <main data-testid="telemetry-tunnel-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative min-w-0 flex-1">
        <SceneCanvasLazy
          className="h-full w-full"
          onPointerMissed={() => setSelectedSatelliteId(null)}
        >
          <TelemetryTunnelScene
            satellites={satellites}
            groundStations={MOCK_GROUND_STATIONS}
            selectedSatelliteId={selectedSatelliteId}
            onSelectSatellite={setSelectedSatelliteId}
          />
        </SceneCanvasLazy>
      </div>
      <TelemetryDetailPanel
        selectedSatelliteId={selectedSatelliteId}
        satellites={satellites}
        groundStations={MOCK_GROUND_STATIONS}
      />
    </main>
  );
}
