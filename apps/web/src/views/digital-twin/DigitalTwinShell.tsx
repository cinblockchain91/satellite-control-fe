"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SceneCanvasLazy } from "@/shared/3d";
import {
  CameraControlsOverlay,
  FleetLegend,
  MissionControlScene,
  MOCK_SATELLITES,
  OrbitLegend,
  type CameraControlsHandle,
} from "@/widgets/mission-control-scene";
import { TelemetryDrawer, TelemetryPanel } from "@/widgets/telemetry-panel";
import type { SelectedSatelliteInfo } from "@/widgets/telemetry-panel";

export function DigitalTwinShell() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLowFps, setIsLowFps] = useState(false);
  const [conjunctionIds, setConjunctionIds] = useState<Set<string>>(new Set());
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const sceneRef = useRef<CameraControlsHandle>(null);
  const t = useTranslations("digitalTwin");

  useEffect(() => {
    if (!isAutoPilot) return;
    const ids = MOCK_SATELLITES.map((s) => s.id);
    const advance = () => {
      setSelectedId((prev) => {
        const idx = prev ? ids.findIndex((id) => id === prev) : -1;
        return ids[(idx + 1) % ids.length]!;
      });
    };
    advance();
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [isAutoPilot]);

  const found = selectedId
    ? (MOCK_SATELLITES.find((s) => s.id === selectedId) ?? null)
    : null;

  const selectedSatellite: SelectedSatelliteInfo | null = found
    ? { id: found.id, name: found.name, status: found.status, ...found.telemetry }
    : null;

  function handleSelect(id: string | null) {
    setIsAutoPilot(false);
    setSelectedId(id);
  }

  function handleCameraReset() {
    sceneRef.current?.resetView();
    setIsAutoPilot(false);
    setSelectedId(null);
  }

  return (
    <main data-testid="digital-twin-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative flex-1 min-w-0">
        <SceneCanvasLazy className="h-full w-full" onPointerMissed={() => { setIsAutoPilot(false); setSelectedId(null); }}>
          <MissionControlScene
            ref={sceneRef}
            selectedId={selectedId}
            onSelect={handleSelect}
            onLowFps={setIsLowFps}
            onConjunctionChange={setConjunctionIds}
          />
        </SceneCanvasLazy>

        {/* Demo badge + auto-pilot — top-left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            {t("demoBadge")}
          </div>
          <button
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

        {/* Camera controls hint — bottom-center of canvas area */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <CameraControlsOverlay onReset={handleCameraReset} />
        </div>

        {/* Fleet legend — bottom-left, desktop only */}
        <div className="absolute bottom-4 left-4 hidden lg:block">
          <FleetLegend />
        </div>

        {/* Orbit legend — bottom-right of canvas, desktop only */}
        <div className="absolute bottom-4 right-4 hidden lg:block">
          <OrbitLegend />
        </div>

        {isLowFps && (
          <div
            data-testid="low-fps-warning"
            className="absolute top-14 right-4 lg:top-4 flex items-center gap-1.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-2.5 py-1.5 text-xs text-yellow-400"
          >
            {t("lowFpsWarning")}
          </div>
        )}

        <TelemetryDrawer selectedSatellite={selectedSatellite} satellites={MOCK_SATELLITES} conjunctionIds={conjunctionIds} />
      </div>

      <TelemetryPanel
        className="hidden lg:flex"
        selectedSatellite={selectedSatellite}
        satellites={MOCK_SATELLITES}
        conjunctionIds={conjunctionIds}
      />
    </main>
  );
}
