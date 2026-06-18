"use client";

import { useTranslations } from "next-intl";
import type { TelemetryStreamState } from "./telemetry-stream";

const FILTER_OPTIONS = [null, "nominal", "warning", "critical"] as const satisfies readonly (TelemetryStreamState | null)[];

const STATE_DOT: Record<TelemetryStreamState, string> = {
  nominal:  "bg-sky-400",
  warning:  "bg-amber-400",
  critical: "bg-red-400",
};

const STATE_ACTIVE_CLASS: Record<TelemetryStreamState, string> = {
  nominal:  "bg-sky-500/20 text-sky-400",
  warning:  "bg-amber-500/20 text-amber-400",
  critical: "bg-red-500/20 text-red-400",
};

const ALL_ACTIVE_CLASS = "bg-muted text-foreground";
const IDLE_CLASS = "text-muted-foreground hover:text-foreground hover:bg-muted/60";

interface TelemetryFilterBarProps {
  streamFilter: TelemetryStreamState | null;
  onChange: (filter: TelemetryStreamState | null) => void;
}

export function TelemetryFilterBar({ streamFilter, onChange }: TelemetryFilterBarProps) {
  const t = useTranslations("tunnelPanel");

  const streamStateLabel: Record<TelemetryStreamState, string> = {
    nominal:  t("streamState.nominal"),
    warning:  t("streamState.warning"),
    critical: t("streamState.critical"),
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-background/80 p-1 backdrop-blur-sm">
      {FILTER_OPTIONS.map((option) => {
        const isSelected = streamFilter === option;
        const buttonClass = isSelected
          ? (option === null ? ALL_ACTIVE_CLASS : STATE_ACTIVE_CLASS[option])
          : IDLE_CLASS;
        return (
          <button
            key={option ?? "all"}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(isSelected ? null : option)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${buttonClass}`}
          >
            {option !== null && (
              <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${STATE_DOT[option]}`} />
            )}
            {option === null ? t("filter.all") : streamStateLabel[option]}
          </button>
        );
      })}
    </div>
  );
}
