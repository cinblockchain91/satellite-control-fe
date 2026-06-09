"use client";

import { Drawer as VaulDrawer } from "vaul";
import * as React from "react";

export type DrawerSide = "left" | "right" | "bottom";

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  side?: DrawerSide;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

export const Drawer = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  side = "right",
  children,
  footer,
  hideCloseButton,
}: DrawerProps) => {
  const isBottom = side === "bottom";

  const contentClass = {
    right: [
      "fixed right-0 top-0 z-50 h-full w-full max-w-sm",
      "rounded-l-[var(--st-radius-lg)] bg-white shadow-xl outline-none",
      "flex flex-col",
    ].join(" "),
    left: [
      "fixed left-0 top-0 z-50 h-full w-full max-w-sm",
      "rounded-r-[var(--st-radius-lg)] bg-white shadow-xl outline-none",
      "flex flex-col",
    ].join(" "),
    bottom: [
      "fixed bottom-0 left-0 right-0 z-50",
      "max-h-[85vh] rounded-t-[var(--st-radius-lg)] bg-white shadow-xl outline-none",
      "flex flex-col",
    ].join(" "),
  };

  return (
    <VaulDrawer.Root open={open} onOpenChange={onOpenChange} direction={side}>
      {trigger && <VaulDrawer.Trigger asChild>{trigger}</VaulDrawer.Trigger>}

      <VaulDrawer.Portal>
        {/* Backdrop */}
        <VaulDrawer.Overlay className="fixed inset-0 z-50 bg-black/50" />

        {/* Content */}
        <VaulDrawer.Content className={contentClass[side]}>
          {/* Handle — chỉ hiện khi bottom */}
          {isBottom && (
            <div className="mx-auto mt-[var(--st-spacing-3)] h-1.5 w-12 rounded-full bg-[var(--st-color-text-muted)] opacity-30" />
          )}

          {/* Header */}
          {(title || description || !hideCloseButton) && (
            <div
              className={[
                "flex items-start justify-between",
                "px-[var(--st-spacing-6)] pt-[var(--st-spacing-6)]",
                children
                  ? "pb-[var(--st-spacing-4)]"
                  : "pb-[var(--st-spacing-6)]",
                "border-b border-[var(--st-color-text-muted)] border-opacity-20",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex flex-col gap-[var(--st-spacing-1)]">
                {title && (
                  <VaulDrawer.Title className="text-[var(--st-font-size-lg)] font-medium text-[var(--st-color-text-default)]">
                    {title}
                  </VaulDrawer.Title>
                )}
                {description && (
                  <VaulDrawer.Description className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
                    {description}
                  </VaulDrawer.Description>
                )}
              </div>

              {!hideCloseButton && (
                <VaulDrawer.Close
                  className={[
                    "rounded-[var(--st-radius-sm)] p-[var(--st-spacing-1)]",
                    "text-[var(--st-color-text-muted)] hover:text-[var(--st-color-text-default)]",
                    "hover:bg-[var(--st-color-brand-subtle)] transition-colors outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </VaulDrawer.Close>
              )}
            </div>
          )}

          {/* Body */}
          {children && (
            <div className="flex-1 overflow-y-auto px-[var(--st-spacing-6)] py-[var(--st-spacing-4)]">
              {children}
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div
              className={[
                "flex items-center justify-end gap-[var(--st-spacing-3)]",
                "px-[var(--st-spacing-6)] py-[var(--st-spacing-4)]",
                "border-t border-[var(--st-color-text-muted)] border-opacity-20",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {footer}
            </div>
          )}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};

Drawer.displayName = "Drawer";
