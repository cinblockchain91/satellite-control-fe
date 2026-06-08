"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import * as React from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  delayDuration?: number;
  showArrow?: boolean;
}

export const TooltipProvider = RadixTooltip.Provider;

export const Tooltip = ({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
  delayDuration = 200,
  showArrow = true,
}: TooltipProps) => {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>

      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={[
            "z-50 max-w-xs rounded-[var(--st-radius-sm)]",
            "bg-[var(--st-color-text-default)] px-[var(--st-spacing-2)] py-[var(--st-spacing-1)]",
            "text-[var(--st-font-size-xs)] text-white leading-normal",
            "shadow-md outline-none select-none",
            "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-1",
            "data-[side=top]:slide-in-from-bottom-1",
            "data-[side=left]:slide-in-from-right-1",
            "data-[side=right]:slide-in-from-left-1",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {content}
          {showArrow && (
            <RadixTooltip.Arrow className="fill-[var(--st-color-text-default)]" />
          )}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
};

Tooltip.displayName = "Tooltip";
