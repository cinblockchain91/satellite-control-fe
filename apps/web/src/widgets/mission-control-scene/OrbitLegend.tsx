"use client";

import { useTranslations } from "next-intl";

export function OrbitLegend() {
  const t = useTranslations("digitalTwin.orbitLegend");

  return (
    <div
      data-testid="orbit-legend"
      className="rounded-lg border border-border bg-background/80 backdrop-blur-sm px-3 py-2"
    >
      <p className="mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
        {t("title")}
      </p>
      <ul className="flex flex-col gap-1.5">
        <li className="flex items-center gap-2">
          <span className="h-[2px] w-5 shrink-0 rounded-full bg-foreground/40" />
          <span className="text-xs text-foreground/80">{t("orbitPath")}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-foreground/70" />
          <span className="text-xs text-foreground/80">{t("currentPosition")}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-5 shrink-0 items-center justify-center">
            <span className="h-2.5 w-2.5 rotate-45 rounded-[1px] border border-foreground/50" />
          </span>
          <span className="text-xs text-foreground/80">{t("predictedPosition")}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-[2px] w-5 shrink-0 rounded-full bg-red-500" />
          <span className="text-xs text-foreground/80">{t("conjunctionRisk")}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-[2px] w-5 shrink-0 rounded-full bg-foreground/15" />
          <span className="text-xs text-foreground/80">{t("signalLost")}</span>
        </li>
      </ul>
    </div>
  );
}
