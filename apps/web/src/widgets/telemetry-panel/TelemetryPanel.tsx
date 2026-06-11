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

const STATUS_BADGE_CLASS: Record<SystemStatus, string> = {
  nominal: "border-green-500/40 bg-green-500/10 text-green-400",
  warning: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  critical: "border-red-500/40 bg-red-500/10 text-red-400",
};

interface MetricRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

function MetricRow({
  label,
  value,
  valueClass = "text-white",
}: MetricRowProps) {
  return (
    <>
      <div className="flex items-center justify-between py-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className={`text-sm font-mono font-semibold ${valueClass}`}>
          {value}
        </span>
      </div>
      <Separator className="bg-slate-700 last:hidden" />
    </>
  );
}

export function TelemetryPanel({ className }: { className?: string }) {
  const t = useTranslations("telemetryPanel");
  const telemetry = useLiveTelemetry();

  return (
    <aside className={cn("w-72 shrink-0 bg-slate-900 border-l border-slate-700 p-4 flex flex-col gap-4 overflow-y-auto", className)}>
      <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
        {t("title")}
      </h2>

      <Card size="sm" className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider font-normal">
            {t("fleetStatus")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <MetricRow
            label={t("totalSatellites")}
            value={String(telemetry.satelliteCount)}
          />
          <MetricRow
            label={t("online")}
            value={`${telemetry.onlineCount} / ${telemetry.satelliteCount}`}
            valueClass="text-green-400"
          />
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              {t("system")}
            </span>
            <Badge
              variant="outline"
              className={STATUS_BADGE_CLASS[telemetry.systemStatus]}
            >
              {t(`status.${telemetry.systemStatus}`)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card size="sm" className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider font-normal">
            {t("signalAndPower")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <MetricRow
            label={t("signalStrength")}
            value={`${telemetry.signalStrength}%`}
            valueClass={
              telemetry.signalStrength < 60 ? "text-yellow-400" : "text-white"
            }
          />
          <MetricRow
            label={t("battery")}
            value={`${telemetry.battery}%`}
            valueClass={
              telemetry.battery < 70 ? "text-yellow-400" : "text-white"
            }
          />
        </CardContent>
      </Card>

      <Card size="sm" className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider font-normal">
            {t("environment")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <MetricRow
            label={t("temperature")}
            value={`${telemetry.temperature}°C`}
            valueClass={
              telemetry.temperature > 35 ? "text-red-400" : "text-white"
            }
          />
        </CardContent>
      </Card>
    </aside>
  );
}
