"use client";

import { ActivityIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { TelemetryPanel } from "./TelemetryPanel";

export function TelemetryDrawer() {
  const t = useTranslations("telemetryPanel");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-4 right-4 lg:hidden gap-2 shadow-lg"
        >
          <ActivityIcon className="h-4 w-4" />
          {t("title")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 w-72 bg-slate-900 border-slate-700" aria-describedby={undefined}>
        <SheetTitle className="sr-only">{t("title")}</SheetTitle>
        <TelemetryPanel className="w-full border-l-0 h-full" />
      </SheetContent>
    </Sheet>
  );
}
