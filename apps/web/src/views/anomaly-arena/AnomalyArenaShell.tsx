"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcwIcon } from "lucide-react";
import { SceneCanvasLazy } from "@/shared/3d";
import { Button } from "@/shared/components/ui/button";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import {
  AnomalyArenaScene,
  AlertTimeline,
  AnomalyDetailPanel,
  buildAlertEvents,
} from "@/widgets/anomaly-arena";
import type { AnomalyArenaSceneHandle, AlertEvent } from "@/widgets/anomaly-arena";

export function AnomalyArenaShell() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLowFps, setIsLowFps] = useState(false);
  const sceneRef = useRef<AnomalyArenaSceneHandle>(null);
  const t = useTranslations("anomalyArena");

  // Populated after hydration so Date.now() never runs on the server.
  // Eliminates SSR/client timestamp mismatch and locale-formatting divergence.
  // Backend swap point: replace setEvents with a useQuery / SWR call when /api/anomalies is ready.
  const [events, setEvents] = useState<AlertEvent[]>([]);
  useEffect(() => {
    setEvents(buildAlertEvents(MOCK_SATELLITES, Date.now()));
  }, []);

  function handleReset() {
    sceneRef.current?.resetView();
    setSelectedId(null);
  }

  return (
    <main data-testid="anomaly-arena-shell" className="flex h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div className="relative min-w-0 flex-1">
        <SceneCanvasLazy
          className="h-full w-full"
          onPointerMissed={() => setSelectedId(null)}
        >
          <AnomalyArenaScene
            ref={sceneRef}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onLowFps={setIsLowFps}
          />
        </SceneCanvasLazy>

        {/* Demo badge — top-left */}
        <div className="absolute left-4 top-4">
          <div className="flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            {t("demoBadge")}
          </div>
        </div>

        {/* Camera hint + reset — bottom-center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div
            data-testid="camera-controls-hint"
            className="flex items-center gap-3 rounded-lg border border-border bg-background/80 px-3 py-2 backdrop-blur-sm"
          >
            <span className="text-xs text-muted-foreground">{t("cameraHint")}</span>
            <div className="h-3 w-px bg-border" />
            <Button
              size="sm"
              variant="ghost"
              className="h-6 gap-1.5 px-2 text-xs"
              onClick={handleReset}
            >
              <RotateCcwIcon className="h-3 w-3" aria-hidden="true" />
              {t("cameraReset")}
            </Button>
          </div>
        </div>

        {/* Low-FPS warning — top-right */}
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

      {/* Right panel: detail + timeline, hidden on small screens */}
      <aside
        data-testid="alert-timeline-panel"
        className="hidden w-80 shrink-0 border-l border-border md:flex md:flex-col"
      >
        <AnomalyDetailPanel
          selectedId={selectedId}
          events={events}
          allSatellites={MOCK_SATELLITES}
          onClose={() => setSelectedId(null)}
        />
        <AlertTimeline
          events={events}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </aside>
    </main>
  );
}
