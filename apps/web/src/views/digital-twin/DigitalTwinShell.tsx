"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SceneCanvasLazy } from "@/shared/3d";
import { MissionControlScene, MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import { TelemetryDrawer, TelemetryPanel } from "@/widgets/telemetry-panel";
import type { SelectedSatelliteInfo } from "@/widgets/telemetry-panel";

export function DigitalTwinShell() {
  const t = useTranslations("digitalTwin");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const found = selectedId
    ? (MOCK_SATELLITES.find((s) => s.id === selectedId) ?? null)
    : null;

  const selectedSatellite: SelectedSatelliteInfo | null = found
    ? { id: found.id, name: found.name, status: found.status, ...found.telemetry }
    : null;

  return (
    <main data-testid="digital-twin-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative flex-1 min-w-0">
        <SceneCanvasLazy className="h-full w-full" onPointerMissed={() => setSelectedId(null)}>
          <MissionControlScene selectedId={selectedId} onSelect={setSelectedId} />
        </SceneCanvasLazy>

        {/* Legend zone — content filled by issue #63 */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-background/80 backdrop-blur-sm px-3 py-2 hidden lg:block">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("legendPlaceholder")}
          </span>
        </div>

        <TelemetryDrawer selectedSatellite={selectedSatellite} />
      </div>

      <TelemetryPanel className="hidden lg:flex" selectedSatellite={selectedSatellite} />
    </main>
  );
}
