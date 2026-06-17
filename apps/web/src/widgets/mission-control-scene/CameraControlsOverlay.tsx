"use client";

import { useEffect, useState } from "react";
import { RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";

interface CameraControlsOverlayProps {
  onReset: () => void;
}

export function CameraControlsOverlay({ onReset }: CameraControlsOverlayProps) {
  const t = useTranslations("digitalTwin.cameraControls");
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0);
  }, []);

  return (
    <div
      data-testid="camera-controls-hint"
      className="flex items-center gap-3 rounded-lg border border-border bg-background/80 backdrop-blur-sm px-3 py-2"
    >
      <span className="text-xs text-muted-foreground">
        {isTouch ? t("hintTouch") : t("hint")}
      </span>
      <div className="h-3 w-px bg-border" />
      <Button
        size="sm"
        variant="ghost"
        className="h-6 gap-1.5 px-2 text-xs"
        onClick={onReset}
      >
        <RotateCcwIcon className="h-3 w-3" />
        {t("reset")}
      </Button>
    </div>
  );
}
