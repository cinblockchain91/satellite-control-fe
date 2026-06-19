"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@satellite-control/feature-account-auth";
import { Link } from "@/shared/i18n/navigation";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import { env } from "@/shared/config/env";
import { Globe, Zap, Monitor, AlertTriangle, ArrowRight, type LucideIcon } from "lucide-react";

type ModuleKey = "digitalTwin" | "telemetryTunnel" | "commandCenter" | "anomalyArena";

const MODULES: { key: ModuleKey; url: string; icon: LucideIcon; enabled: (e: typeof env) => boolean }[] = [
  { key: "digitalTwin", url: "/digital-twin", icon: Globe, enabled: (e) => e.featureDigitalTwin },
  { key: "telemetryTunnel", url: "/telemetry-tunnel", icon: Zap, enabled: (e) => e.featureTelemetryTunnel },
  { key: "commandCenter", url: "/command-center", icon: Monitor, enabled: (e) => e.featureCommandCenter },
  { key: "anomalyArena", url: "/anomaly-arena", icon: AlertTriangle, enabled: (e) => e.featureAnomalyArena },
];

export function DashboardShell() {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const { account } = useAuthStore();

  const firstName = account?.fullName?.split(" ")[0] ?? "Commander";

  const total = MOCK_SATELLITES.length;
  const anomalous = MOCK_SATELLITES.filter(
    (s) => s.status === "warning" || s.status === "degraded",
  ).length;
  const offline = MOCK_SATELLITES.filter((s) => s.status === "offline").length;

  const stats = [
    { label: t("totalSatellites"), value: total, colorClass: "text-foreground" },
    { label: t("anomalousCount"), value: anomalous, colorClass: "text-yellow-500" },
    { label: t("offlineCount"), value: offline, colorClass: "text-red-500" },
  ];

  const enabledModules = MODULES.filter((m) => m.enabled(env));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-8 py-10">
      {/* Hero */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("greeting", { name: firstName })}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </section>

      {/* Fleet overview */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t("fleetOverview")}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, colorClass }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`mt-1 text-4xl font-bold tabular-nums ${colorClass}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission modules */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t("modules")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {enabledModules.map(({ key, url, icon: Icon }) => (
            <Link
              key={key}
              href={url}
              className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-sidebar-primary/10 p-2">
                  <Icon className="h-5 w-5 text-sidebar-primary" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="mt-4 font-semibold">{tNav(key as "digitalTwin")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`${key}.description` as "digitalTwin.description")}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
