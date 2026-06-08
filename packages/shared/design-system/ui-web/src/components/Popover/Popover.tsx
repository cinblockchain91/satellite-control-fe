"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import * as React from "react";

export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  title?: string;
  showArrow?: boolean;
  hideCloseButton?: boolean;
}

export const Popover = ({
  open,
  onOpenChange,
  trigger,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  title,
  showArrow = false,
  hideCloseButton = false,
}: PopoverProps) => {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={[
            "z-50 w-72 rounded-[var(--st-radius-md)] bg-white p-[var(--st-spacing-4)]",
            "border border-[var(--st-color-text-muted)] border-opacity-20 shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:slide-in-from-bottom-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-center justify-between mb-[var(--st-spacing-3)]">
              {title && (
                <p className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]">
                  {title}
                </p>
              )}
              {!hideCloseButton && (
                <RadixPopover.Close
                  className={[
                    "ml-auto rounded-[var(--st-radius-sm)] p-[var(--st-spacing-1)]",
                    "text-[var(--st-color-text-muted)] hover:text-[var(--st-color-text-default)]",
                    "hover:bg-[var(--st-color-brand-subtle)] transition-colors outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </RadixPopover.Close>
              )}
            </div>
          )}

          {/* Content */}
          <div className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-default)]">
            {children}
          </div>

          {/* Arrow */}
          {showArrow && <RadixPopover.Arrow className="fill-white" />}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

Popover.displayName = "Popover";
