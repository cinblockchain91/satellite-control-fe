"use client";

import { useTranslations } from "next-intl";
import type { Satellite, SatelliteStatus } from "@satellite-control/entity-satellite";

const STATUS_COLOR: Record<SatelliteStatus, string> = {
  online:   "#22c55e",
  warning:  "#eab308",
  degraded: "#f97316",
  offline:  "#6b7280",
};

const BAR_COLOR: Record<SatelliteStatus, string> = {
  online:   "#1a6040",
  warning:  "#604010",
  degraded: "#603010",
  offline:  "#303030",
};

interface MetricRowProps {
  label: string;
  value: number;
  unit: string;
  status: SatelliteStatus;
}

function MetricRow({ label, value, unit, status }: MetricRowProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "4px", gap: "4px" }}>
      <span style={{ width: "40px", opacity: 0.6, fontSize: "9px" }}>{label}</span>
      <div style={{ flex: 1, height: "3px", backgroundColor: "#1a2040", borderRadius: "2px" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: BAR_COLOR[status],
            borderRadius: "2px",
          }}
        />
      </div>
      <span style={{ width: "30px", textAlign: "right", fontSize: "9px" }}>
        {Math.round(value)}{unit}
      </span>
    </div>
  );
}

interface SatelliteStatusPanelProps {
  satellite: Satellite;
}

export function SatelliteStatusPanel({ satellite }: SatelliteStatusPanelProps) {
  const t = useTranslations("commandCenter");
  const statusColor = STATUS_COLOR[satellite.status];
  const { telemetry, status } = satellite;

  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "rgba(8, 12, 20, 0.92)",
        border: `1px solid ${statusColor}50`,
        borderRadius: "3px",
        padding: "8px 10px",
        fontFamily: "ui-monospace, monospace",
        fontSize: "10px",
        color: "#c0d0f0",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          paddingBottom: "5px",
          borderBottom: `1px solid ${statusColor}30`,
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "11px", letterSpacing: "0.04em" }}>
          {satellite.name}
        </span>
        <span
          style={{
            color: statusColor,
            fontSize: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {t(`status.${status}`)}
        </span>
      </div>

      {/* Metrics */}
      <MetricRow label={t("screenSignal")}  value={telemetry.signalStrength} unit="%" status={status} />
      <MetricRow label={t("screenBattery")} value={telemetry.battery}        unit="%" status={status} />
      <MetricRow label={t("screenHealth")}  value={telemetry.healthScore}    unit="%" status={status} />

      {/* Temperature — no bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ opacity: 0.6, fontSize: "9px" }}>{t("screenTemp")}</span>
        <span style={{ fontSize: "9px" }}>{Math.round(telemetry.temperature)} K</span>
      </div>
    </div>
  );
}
