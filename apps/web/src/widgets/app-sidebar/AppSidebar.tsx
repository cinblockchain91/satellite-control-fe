"use client";

import { useTranslations } from "next-intl";
import { usePathname, Link, useRouter } from "@/shared/i18n/navigation";
import { useAuthStore } from "@satellite-control/feature-account-auth";
import { authAdapter } from "@/shared/config/adapters";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Satellite,
  Activity,
  Terminal,
  Settings,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  CalendarDays,
  Radio,
  Globe,
} from "lucide-react";
import { env } from "@/shared/config/env";

export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const { account, reset } = useAuthStore();

  async function handleSignOut() {
    await authAdapter.logout();
    reset();
    router.push("/login");
  }

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
  ];

  const satellitesSubNav = [
    { title: t("active"), url: "/dashboard/satellites/active", icon: Radio },
    { title: t("idle"), url: "/dashboard/satellites/idle", icon: Satellite },
    {
      title: t("schedule"),
      url: "/dashboard/satellites/schedule",
      icon: CalendarDays,
    },
  ];

  const operationsNav = [
    { title: t("telemetry"), url: "/dashboard/telemetry", icon: Activity },
    { title: t("commands"), url: "/dashboard/commands", icon: Terminal },
  ];

  const systemNav = [
    { title: t("settings"), url: "/dashboard/settings", icon: Settings },
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
        {/* Platform */}
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

              {/* Satellites collapsible */}
              <Collapsible
                defaultOpen={pathname.startsWith("/dashboard/satellites")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t("satellites")}>
                      <Satellite />
                      <span>{t("satellites")}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {satellitesSubNav.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === sub.url}
                          >
                            <Link href={sub.url}>
                              <sub.icon />
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Operations */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("operations")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsNav.map((item) => (
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

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("system")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map((item) => (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {account?.fullName ?? ""}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {account?.email ?? ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" />
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
