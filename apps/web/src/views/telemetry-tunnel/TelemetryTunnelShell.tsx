"use client";

import { SceneCanvasLazy } from "@/shared/3d";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import { MOCK_GROUND_STATIONS, TelemetryTunnelScene } from "@/widgets/telemetry-tunnel";

export function TelemetryTunnelShell() {
  return (
    <main data-testid="telemetry-tunnel-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative flex-1 min-w-0">
        <SceneCanvasLazy className="h-full w-full">
          <TelemetryTunnelScene
            satellites={MOCK_SATELLITES}
            groundStations={MOCK_GROUND_STATIONS}
          />
        </SceneCanvasLazy>
      </div>
    </main>
  );
}
