"use client";

import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/shared/i18n/navigation";
import { useAuthStore } from "@satellite-control/feature-account-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  LayoutDashboard,
  Globe,
  Monitor,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { env } from "@/shared/config/env";

export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { account } = useAuthStore();

  const initials = account?.fullName
    ? account.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const platformNav = [
    { title: t("dashboard"), url: "/dashboard", icon: LayoutDashboard },
    ...(env.featureDigitalTwin
      ? [{ title: t("digitalTwin"), url: "/digital-twin", icon: Globe }]
      : []),
    ...(env.featureTelemetryTunnel
      ? [{ title: t("telemetryTunnel"), url: "/telemetry-tunnel", icon: Zap }]
      : []),
    ...(env.featureCommandCenter
      ? [{ title: t("commandCenter"), url: "/command-center", icon: Monitor }]
      : []),
    ...(env.featureAnomalyArena
      ? [{ title: t("anomalyArena"), url: "/anomaly-arena", icon: AlertTriangle }]
      : []),
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"></div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Satellite Control
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Mission Control
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none select-none">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {account?.fullName ?? ""}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {account?.email ?? ""}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
