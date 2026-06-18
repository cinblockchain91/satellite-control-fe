"use client";

import { useTranslations } from "next-intl";
import type { Satellite, SatelliteId, SatelliteStatus } from "@satellite-control/entity-satellite";
import type { GroundStation, GroundStationStatus } from "./ground-stations.data";
import { classifyMetric, classifyStream } from "./telemetry-stream";
import type { TelemetryMetric, TelemetryStreamState } from "./telemetry-stream";

const METRIC_ORDER: readonly TelemetryMetric[] = [
  "signalStrength",
  "battery",
  "temperature",
  "latency",
  "anomalyLevel",
];

const METRIC_FORMAT: Record<TelemetryMetric, (v: number) => string> = {
  signalStrength: (v) => `${v}%`,
  battery:        (v) => `${v}%`,
  temperature:    (v) => `${v} °C`,
  latency:        (v) => `${v} ms`,
  anomalyLevel:   (v) => `${v} / 100`,
};

const SAT_STATUS_BADGE: Record<SatelliteStatus, string> = {
  online:   "bg-emerald-500/15 text-emerald-400",
  warning:  "bg-amber-500/15 text-amber-400",
  degraded: "bg-orange-500/15 text-orange-400",
  offline:  "bg-red-500/15 text-red-400",
};

const STREAM_STATE_CLASS: Record<TelemetryStreamState, string> = {
  nominal:  "bg-emerald-500/15 text-emerald-400",
  warning:  "bg-amber-500/15 text-amber-400",
  critical: "bg-red-500/15 text-red-400",
};

const METRIC_DOT: Record<TelemetryStreamState, string> = {
  nominal:  "bg-emerald-400",
  warning:  "bg-amber-400",
  critical: "bg-red-400",
};

const GS_STATUS_CLASS: Record<GroundStationStatus, string> = {
  active:  "text-emerald-400",
  standby: "text-amber-400",
  offline: "text-red-400",
};

interface TelemetryDetailPanelProps {
  selectedSatelliteId: SatelliteId | null;
  satellites: Satellite[];
  groundStations: GroundStation[];
}

export function TelemetryDetailPanel({
  selectedSatelliteId,
  satellites,
  groundStations,
}: TelemetryDetailPanelProps) {
  const t = useTranslations("tunnelPanel");

  const satellite =
    selectedSatelliteId !== null
      ? (satellites.find((s) => s.id === selectedSatelliteId) ?? null)
      : null;

  const linkedStations = satellite
    ? groundStations.filter((gs) =>
        gs.linkedSatelliteIds.includes(satellite.id as string),
      )
    : [];

  const streamState = satellite ? classifyStream(satellite.telemetry) : null;

  const satStatusLabel: Record<SatelliteStatus, string> = {
    online:   t("satStatus.online"),
    warning:  t("satStatus.warning"),
    degraded: t("satStatus.degraded"),
    offline:  t("satStatus.offline"),
  };

  const streamStateLabel: Record<TelemetryStreamState, string> = {
    nominal:  t("streamState.nominal"),
    warning:  t("streamState.warning"),
    critical: t("streamState.critical"),
  };

  const gsStatusLabel: Record<GroundStationStatus, string> = {
    active:  t("gsStatus.active"),
    standby: t("gsStatus.standby"),
    offline: t("gsStatus.offline"),
  };

  const metricLabel: Record<TelemetryMetric, string> = {
    signalStrength: t("metrics.signalStrength"),
    battery:        t("metrics.battery"),
    temperature:    t("metrics.temperature"),
    latency:        t("metrics.latency"),
    anomalyLevel:   t("metrics.anomalyLevel"),
  };

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-background">
      {satellite === null ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-border p-4">
            <div>
              <div className="text-sm font-semibold">{satellite.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {satStatusLabel[satellite.status]}
              </div>
            </div>
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${SAT_STATUS_BADGE[satellite.status]}`}
            >
              {satStatusLabel[satellite.status]}
            </span>
          </div>

          {/* Stream state */}
          {streamState !== null && (
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-xs text-muted-foreground">{t("stream")}</span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${STREAM_STATE_CLASS[streamState]}`}
              >
                {streamStateLabel[streamState]}
              </span>
            </div>
          )}

          {/* Telemetry metrics */}
          <div className="border-b border-border">
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
              {t("metricsSection")}
            </div>
            {METRIC_ORDER.map((metric) => {
              const value = satellite.telemetry[metric];
              const state = classifyMetric(metric, value);
              return (
                <div
                  key={metric}
                  className="flex items-center justify-between px-4 py-1.5"
                >
                  <span className="text-xs text-muted-foreground">
                    {metricLabel[metric]}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs tabular-nums">
                      {METRIC_FORMAT[metric](value)}
                    </span>
                    <span
                      className={`inline-block h-2 w-2 shrink-0 rounded-full ${METRIC_DOT[state]}`}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between px-4 py-1.5">
              <span className="text-xs text-muted-foreground">
                {t("metrics.healthScore")}
              </span>
              <span className="text-xs tabular-nums">
                {satellite.telemetry.healthScore}%
              </span>
            </div>
            <div className="flex items-center justify-between px-4 pb-3 pt-1.5">
              <span className="text-xs text-muted-foreground">
                {t("metrics.altitude")}
              </span>
              <span className="text-xs tabular-nums">
                {satellite.telemetry.altitude} km
              </span>
            </div>
          </div>

          {/* Ground stations */}
          <div>
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
              {t("groundStationsSection")}
            </div>
            {linkedStations.length === 0 ? (
              <p className="px-4 pb-3 text-xs text-muted-foreground">
                {t("noLinkedStations")}
              </p>
            ) : (
              linkedStations.map((gs) => (
                <div
                  key={gs.id}
                  className="flex items-center justify-between px-4 py-1.5"
                >
                  <span className="text-xs">{gs.name}</span>
                  <span className={`text-xs ${GS_STATUS_CLASS[gs.status]}`}>
                    {gsStatusLabel[gs.status]}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </aside>
  );
}
