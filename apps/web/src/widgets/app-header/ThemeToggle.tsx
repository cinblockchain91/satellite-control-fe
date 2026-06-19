"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" aria-hidden="true" />;
  }

  function cycle() {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark");
  }

  const Icon = theme === "light" ? Sun : theme === "system" ? Monitor : Moon;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={cycle}
      aria-label={t("theme")}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
