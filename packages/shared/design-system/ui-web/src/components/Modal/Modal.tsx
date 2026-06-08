"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import * as React from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)]",
};

export const Modal = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  size = "md",
  children,
  footer,
  hideCloseButton,
}: ModalProps) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}

      <RadixDialog.Portal>
        {/* Backdrop */}
        <RadixDialog.Overlay
          className={[
            "fixed inset-0 z-50 bg-black/50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Content */}
        <RadixDialog.Content
          className={[
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            "rounded-[var(--st-radius-lg)] bg-white shadow-xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2",
            sizeMap[size],
          ]
            .filter(Boolean)
            .join(" ")}
        >
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
                  <RadixDialog.Title className="text-[var(--st-font-size-lg)] font-medium text-[var(--st-color-text-default)]">
                    {title}
                  </RadixDialog.Title>
                )}
                {description && (
                  <RadixDialog.Description className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
                    {description}
                  </RadixDialog.Description>
                )}
              </div>

              {!hideCloseButton && (
                <RadixDialog.Close
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
                </RadixDialog.Close>
              )}
            </div>
          )}

          {/* Body */}
          {children && (
            <div className="px-[var(--st-spacing-6)] py-[var(--st-spacing-4)]">
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
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

Modal.displayName = "Modal";
