"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/components/lib/utils";
import { useLiveTelemetry, type SystemStatus } from "./telemetry.mock";
import type { SelectedSatelliteInfo } from "./types";

const FLEET_STATUS_CLASS: Record<SystemStatus, string> = {
  nominal: "border-green-500/40 bg-green-500/10 text-green-400",
  warning: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  critical: "border-red-500/40 bg-red-500/10 text-red-400",
};

const SAT_STATUS_CLASS: Record<"online" | "warning" | "degraded" | "offline", string> = {
  online: "border-green-500/40 bg-green-500/10 text-green-400",
  warning: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  degraded: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  offline: "border-red-500/40 bg-red-500/10 text-red-400",
};

interface MetricRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

function MetricRow({ label, value, valueClass = "text-foreground" }: MetricRowProps) {
  return (
    <>
      <div className="flex items-center justify-between py-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-mono font-semibold ${valueClass}`}>{value}</span>
      </div>
      <Separator className="last:hidden" />
    </>
  );
}

interface TelemetryPanelProps {
  className?: string;
  selectedSatellite?: SelectedSatelliteInfo | null;
}

export function TelemetryPanel({ className, selectedSatellite }: TelemetryPanelProps) {
  const t = useTranslations("telemetryPanel");
  const td = useTranslations("satelliteDetail");
  const telemetry = useLiveTelemetry();

  return (
    <aside className={cn("w-72 shrink-0 bg-card border-l border-border p-4 flex flex-col gap-4 overflow-y-auto", className)}>
      <h2 className="text-xs font-semibold text-foreground/70 uppercase tracking-widest">
        {t("title")}
      </h2>

      {selectedSatellite ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{selectedSatellite.name}</span>
            <Badge variant="outline" className={SAT_STATUS_CLASS[selectedSatellite.status]}>
              {td(`status.${selectedSatellite.status}`)}
            </Badge>
          </div>

          <Card size="sm" className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-normal">
                {td("signalAndPower")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <MetricRow
                label={td("signalStrength")}
                value={`${selectedSatellite.signalStrength}%`}
                valueClass={selectedSatellite.signalStrength < 60 ? "text-yellow-400" : "text-foreground"}
              />
              <MetricRow
                label={td("battery")}
                value={`${selectedSatellite.battery}%`}
                valueClass={selectedSatellite.battery < 70 ? "text-yellow-400" : "text-foreground"}
              />
            </CardContent>
          </Card>

          <Card size="sm" className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-normal">
                {td("environment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <MetricRow
                label={td("temperature")}
                value={`${selectedSatellite.temperature}°C`}
                valueClass={selectedSatellite.temperature > 35 ? "text-red-400" : "text-foreground"}
              />
              <MetricRow label={td("altitude")} value={`${selectedSatellite.altitude} km`} />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">{td("noSelection")}</p>

          <Card size="sm" className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-normal">
                {t("fleetStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <MetricRow label={t("totalSatellites")} value={String(telemetry.satelliteCount)} />
              <MetricRow
                label={t("online")}
                value={`${telemetry.onlineCount} / ${telemetry.satelliteCount}`}
                valueClass="text-green-400"
              />
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("system")}</span>
                <Badge variant="outline" className={FLEET_STATUS_CLASS[telemetry.systemStatus]}>
                  {t(`status.${telemetry.systemStatus}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-normal">
                {t("signalAndPower")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <MetricRow
                label={t("signalStrength")}
                value={`${telemetry.signalStrength}%`}
                valueClass={telemetry.signalStrength < 60 ? "text-yellow-400" : "text-foreground"}
              />
              <MetricRow
                label={t("battery")}
                value={`${telemetry.battery}%`}
                valueClass={telemetry.battery < 70 ? "text-yellow-400" : "text-foreground"}
              />
            </CardContent>
          </Card>

          <Card size="sm" className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider font-normal">
                {t("environment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <MetricRow
                label={t("temperature")}
                value={`${telemetry.temperature}°C`}
                valueClass={telemetry.temperature > 35 ? "text-red-400" : "text-foreground"}
              />
            </CardContent>
          </Card>
        </>
      )}
    </aside>
  );
}
