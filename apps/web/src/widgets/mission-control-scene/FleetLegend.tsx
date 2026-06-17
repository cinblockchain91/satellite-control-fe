"use client";

import { useTranslations } from "next-intl";
import { STATUS_COLORS } from "./satellites.data";
import type { SatelliteStatus } from "./satellites.data";

const STATUSES: SatelliteStatus[] = ["online", "warning", "degraded", "offline"];

export function FleetLegend() {
  const t = useTranslations("satelliteDetail");
  const tLegend = useTranslations("digitalTwin.legend");

  return (
    <div
      data-testid="fleet-legend"
      className="rounded-lg border border-border bg-background/80 backdrop-blur-sm px-3 py-2"
    >
      <p className="mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
        {tLegend("title")}
      </p>
      <ul className="flex flex-col gap-1">
        {STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span
              data-testid={`legend-dot-${status}`}
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            />
            <span className="text-xs text-foreground/80">{t(`status.${status}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
