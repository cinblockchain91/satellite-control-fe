"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil } from "lucide-react";
import { useAuthStore } from "@satellite-control/feature-account-auth";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { AccountRole } from "@satellite-control/entity-account";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const t = useTranslations("profile");
  const { account, setAccount } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    if (open) {
      setNameInput(account?.fullName ?? "");
      setEditing(false);
    }
  }, [open, account?.fullName]);

  if (!account) return null;

  const initials = account.fullName
    .split(" ")
    .map((n) => n.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "??";

  function handleSave() {
    if (!account) return;
    const trimmed = nameInput.trim();
    if (trimmed) {
      setAccount({ ...account, fullName: trimmed });
    }
    setEditing(false);
  }

  function handleCancel() {
    setNameInput(account?.fullName ?? "");
    setEditing(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 pt-2">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Badge variant="secondary" className="capitalize">
            {t(`role.${account.role}` as `role.${AccountRole}`)}
          </Badge>
        </div>

        <div className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">{t("fullName")}</Label>
            {editing ? (
              <div className="flex gap-2">
                <Input
                  id="profile-name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleSave}>
                  {t("save")}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-sm">{account.fullName}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => {
                    setNameInput(account.fullName);
                    setEditing(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                  <span className="sr-only">{t("edit")}</span>
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t("email")}</Label>
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              {account.email}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("username")}</Label>
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              {account.username}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("memberSince")}{" "}
            <time dateTime={account.createdAt} suppressHydrationWarning>
              {new Date(account.createdAt).toLocaleDateString()}
            </time>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
