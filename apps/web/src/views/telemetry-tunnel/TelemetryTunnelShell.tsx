"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SceneCanvasLazy } from "@/shared/3d";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import type { SatelliteId } from "@satellite-control/entity-satellite";
import {
  MOCK_GROUND_STATIONS,
  TelemetryDetailPanel,
  TelemetryFilterBar,
  TelemetryTunnelScene,
  useTunnelMockTelemetry,
} from "@/widgets/telemetry-tunnel";
import type { TelemetryStreamState, TelemetryTunnelSceneHandle } from "@/widgets/telemetry-tunnel";

export function TelemetryTunnelShell() {
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<SatelliteId | null>(null);
  const [streamFilter, setStreamFilter] = useState<TelemetryStreamState | null>(null);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isLowFps, setIsLowFps] = useState(false);
  const sceneRef = useRef<TelemetryTunnelSceneHandle>(null);
  const t = useTranslations("tunnelPanel");
  const satellites = useTunnelMockTelemetry(MOCK_SATELLITES);

  useEffect(() => {
    if (!isAutoPilot) return;
    setStreamFilter(null);
    const ids = MOCK_SATELLITES.map((s) => s.id);
    const advance = () => {
      setSelectedSatelliteId((prev) => {
        const idx = prev ? ids.findIndex((id) => id === prev) : -1;
        return ids[(idx + 1) % ids.length]!;
      });
    };
    advance();
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [isAutoPilot]);

  function handleSelect(id: SatelliteId | null) {
    setIsAutoPilot(false);
    setSelectedSatelliteId(id);
  }

  function handleCameraReset() {
    sceneRef.current?.resetView();
    setIsAutoPilot(false);
    setSelectedSatelliteId(null);
  }

  return (
    <main data-testid="telemetry-tunnel-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative min-w-0 flex-1">
        <SceneCanvasLazy
          className="h-full w-full"
          onPointerMissed={() => { setIsAutoPilot(false); setSelectedSatelliteId(null); }}
        >
          <TelemetryTunnelScene
            ref={sceneRef}
            satellites={satellites}
            groundStations={MOCK_GROUND_STATIONS}
            selectedSatelliteId={selectedSatelliteId}
            onSelectSatellite={handleSelect}
            onLowFps={setIsLowFps}
            streamFilter={streamFilter}
          />
        </SceneCanvasLazy>

        {/* Demo badge + auto-pilot row, then filter bar — top-left */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {t("demoBadge")}
            </div>
            <button
              type="button"
              onClick={() => setIsAutoPilot((v) => !v)}
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
                isAutoPilot
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-border bg-background/80 text-muted-foreground backdrop-blur-sm hover:text-foreground"
              }`}
            >
              {isAutoPilot && <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-400" />}
              {isAutoPilot ? t("autoPilotStop") : t("autoPilotStart")}
            </button>
          </div>
          <TelemetryFilterBar streamFilter={streamFilter} onChange={setStreamFilter} />
        </div>

        {/* Camera hint + reset — bottom-center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-xs text-muted-foreground">{t("cameraHint")}</span>
          <span className="text-xs text-muted-foreground/40">·</span>
          <button
            type="button"
            onClick={handleCameraReset}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("cameraReset")}
          </button>
        </div>

        {isLowFps && (
          <div
            data-testid="low-fps-warning"
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-2.5 py-1.5 text-xs text-yellow-400"
          >
            {t("lowFpsWarning")}
          </div>
        )}
      </div>
      <TelemetryDetailPanel
        selectedSatelliteId={selectedSatelliteId}
        satellites={satellites}
        groundStations={MOCK_GROUND_STATIONS}
      />
    </main>
  );
}
