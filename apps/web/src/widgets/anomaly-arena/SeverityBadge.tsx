"use client";

import { useTranslations } from "next-intl";
import { AlertTriangleIcon, AlertOctagonIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { AnomalySeverity } from "./anomaly-detection";

interface SeverityBadgeProps {
  severity: AnomalySeverity;
}

/**
 * Renders an AnomalySeverity as a shadcn Badge with the appropriate color and
 * icon.  Owns its own translation call so every consumer gets the same label
 * from the same i18n key — callers must not supply their own label string.
 *
 * warning  → outline badge, yellow palette, AlertTriangle icon
 * critical → destructive badge (shadcn built-in red), AlertOctagon icon
 */
export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const t = useTranslations("anomalyArena");

  if (severity === "critical") {
    return (
      <Badge variant="destructive">
        <AlertOctagonIcon aria-hidden="true" />
        {t("severity.critical")}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
    >
      <AlertTriangleIcon aria-hidden="true" />
      {t("severity.warning")}
    </Badge>
  );
}
