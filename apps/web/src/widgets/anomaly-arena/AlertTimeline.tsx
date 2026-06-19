"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/shared/components/lib/utils";
import { SeverityBadge } from "./SeverityBadge";
import type { AlertEvent } from "./alert-events";
import type { AnomalyType } from "./anomaly-detection";

const MAX_VISIBLE_EVENTS = 50;

interface AlertTimelineProps {
  events: AlertEvent[];
  selectedId: string | null;
  onSelect: (satelliteId: string) => void;
}

export function AlertTimeline({ events, selectedId, onSelect }: AlertTimelineProps) {
  const t = useTranslations("anomalyArena");
  const visible = events.slice(0, MAX_VISIBLE_EVENTS);

  return (
    <section
      aria-label={t("timeline.title")}
      data-testid="alert-timeline"
      className="flex h-full flex-col"
    >
      <header className="flex shrink-0 items-center border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{t("timeline.title")}</h2>
        {visible.length > 0 && (
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            {visible.length}
          </span>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div
            data-testid="alert-timeline-empty"
            className="flex h-full items-center justify-center p-4"
          >
            <p className="text-sm text-muted-foreground">{t("timeline.empty")}</p>
          </div>
        ) : (
          <ol>
            {visible.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  data-testid="alert-event"
                  aria-pressed={selectedId === event.satelliteId}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors",
                    "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    selectedId === event.satelliteId && "bg-muted",
                  )}
                  onClick={() => onSelect(event.satelliteId)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {event.satelliteName}
                    </span>
                    <SeverityBadge severity={event.severity} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t(`type.${event.type}` as `type.${AnomalyType}`)}
                    </span>
                    <time
                      dateTime={event.detectedAt.toISOString()}
                      suppressHydrationWarning
                      className="shrink-0 text-xs tabular-nums text-muted-foreground"
                    >
                      {event.detectedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
