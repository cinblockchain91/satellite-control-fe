"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { CrosshairIcon, XIcon, LightbulbIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { detectAnomalies, ANOMALY_VISUAL_RULES } from "./anomaly-detection";
import type { AnomalyType } from "./anomaly-detection";
import { SeverityBadge } from "./SeverityBadge";
import type { AlertEvent } from "./alert-events";
import type { Satellite } from "@/widgets/mission-control-scene";

// Maps satellite status to a Tailwind bg-* class for the status dot.
// Mirrors the status color palette used across the product.
const STATUS_DOT_CLASS: Record<Satellite["status"], string> = {
  online: "bg-green-500",
  warning: "bg-yellow-500",
  degraded: "bg-orange-500",
  offline: "bg-red-500",
};

interface AnomalyDetailPanelProps {
  selectedId: string | null;
  events: AlertEvent[];
  allSatellites: Satellite[];
  onClose: () => void;
}

export function AnomalyDetailPanel({
  selectedId,
  events,
  allSatellites,
  onClose,
}: AnomalyDetailPanelProps) {
  const t = useTranslations("anomalyArena");

  const satellite = useMemo(
    () => allSatellites.find((s) => s.id === selectedId) ?? null,
    [allSatellites, selectedId],
  );

  const anomalies = useMemo(
    () => (satellite ? detectAnomalies(satellite.telemetry, satellite.status) : []),
    [satellite],
  );

  const eventsByType = useMemo(() => {
    const map = new Map<string, AlertEvent>();
    events
      .filter((e) => e.satelliteId === selectedId)
      .forEach((e) => {
        map.set(e.type, e);
      });
    return map;
  }, [events, selectedId]);

  // Compact placeholder — keeps the timeline's height unaffected when nothing is selected.
  if (!satellite) {
    return (
      <div
        data-testid="anomaly-detail-no-selection"
        className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3 text-sm text-muted-foreground"
      >
        <CrosshairIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{t("detail.noSelection")}</span>
      </div>
    );
  }

  return (
    <section
      data-testid="anomaly-detail-panel"
      aria-label={t("detail.title")}
      className="flex max-h-[55vh] shrink-0 flex-col overflow-y-auto border-b border-border"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{t("detail.title")}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-6 w-6 p-0"
          onClick={onClose}
          aria-label={t("detail.close")}
          data-testid="anomaly-detail-close"
        >
          <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </header>

      {/* Satellite identity row */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT_CLASS[satellite.status]}`}
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {satellite.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {t(
            `detail.status.${satellite.status}` as `detail.status.${Satellite["status"]}`,
          )}
        </span>
      </div>

      {/* One card per detected anomaly */}
      <ul className="divide-y divide-border">
        {anomalies.map((anomaly) => {
          const event = eventsByType.get(anomaly.type);
          return (
            <li key={anomaly.type} data-testid="anomaly-detail-card" className="px-4 py-3">
              {/* Type colour chip + label + severity badge */}
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ANOMALY_VISUAL_RULES[anomaly.type].color }}
                  aria-hidden="true"
                />
                <span className="flex-1 text-sm font-medium text-foreground">
                  {t(`type.${anomaly.type}` as `type.${AnomalyType}`)}
                </span>
                <SeverityBadge severity={anomaly.severity} />
              </div>

              {/* Detection timestamp from the alert timeline event */}
              {event && (
                <p className="mb-1 text-xs text-muted-foreground">
                  {t("detail.detectedLabel")}{" "}
                  <time
                    dateTime={event.detectedAt.toISOString()}
                    suppressHydrationWarning
                  >
                    {event.detectedAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </p>
              )}

              {/* Metric / value / threshold */}
              <p
                data-testid="anomaly-detail-metric"
                className="mb-2 text-xs text-muted-foreground"
              >
                {anomaly.metric}: {anomaly.value} / {t("detail.threshold")}: {anomaly.threshold}
              </p>

              {/* Suggested operator action */}
              <div className="flex gap-1.5 rounded-sm bg-muted/50 px-2 py-1.5">
                <LightbulbIcon
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <p
                  data-testid="anomaly-detail-action"
                  className="text-xs text-muted-foreground"
                >
                  {t(`detail.action.${anomaly.type}` as `detail.action.${AnomalyType}`)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
