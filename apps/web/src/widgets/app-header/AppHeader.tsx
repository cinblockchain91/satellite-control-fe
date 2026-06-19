"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut, User } from "lucide-react";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAuthStore } from "@satellite-control/feature-account-auth";
import { authAdapter } from "@/shared/config/adapters";
import { LocaleSwitcher } from "@/widgets/locale-switcher";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDialog } from "@/widgets/profile-dialog";

export function AppHeader() {
  const t = useTranslations("nav");
  const { account, reset } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = account?.fullName
    ? account.fullName
        .split(" ")
        .map((n) => n.charAt(0))
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  async function handleSignOut() {
    await authAdapter.logout();
    reset();
    window.location.replace("/login");
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={account?.fullName ?? "User menu"}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold leading-none">
                  {account?.fullName ?? ""}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {account?.email ?? ""}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
