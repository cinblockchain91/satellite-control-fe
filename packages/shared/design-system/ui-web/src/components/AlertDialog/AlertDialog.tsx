"use client";

import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";
import * as React from "react";

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const AlertDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: AlertDialogProps) => {
  return (
    <RadixAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <RadixAlertDialog.Trigger asChild>{trigger}</RadixAlertDialog.Trigger>
      )}

      <RadixAlertDialog.Portal>
        {/* Backdrop */}
        <RadixAlertDialog.Overlay
          className={[
            "fixed inset-0 z-50 bg-black/50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          ].join(" ")}
        />

        {/* Content */}
        <RadixAlertDialog.Content
          className={[
            "fixed left-1/2 top-1/2 z-50 w-full max-w-sm",
            "-translate-x-1/2 -translate-y-1/2 outline-none",
            "rounded-[var(--st-radius-lg)] bg-white shadow-xl p-[var(--st-spacing-6)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2",
          ].join(" ")}
        >
          {/* Icon — chỉ hiện khi destructive */}
          {variant === "destructive" && (
            <div
              className={[
                "mb-[var(--st-spacing-4)] flex h-12 w-12 items-center justify-center",
                "rounded-full bg-red-50",
              ].join(" ")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--st-color-feedback-danger)]"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
            </div>
          )}

          {/* Title */}
          <RadixAlertDialog.Title className="text-[var(--st-font-size-lg)] font-medium text-[var(--st-color-text-default)] mb-[var(--st-spacing-2)]">
            {title}
          </RadixAlertDialog.Title>

          {/* Description */}
          {description && (
            <RadixAlertDialog.Description className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)] mb-[var(--st-spacing-6)]">
              {description}
            </RadixAlertDialog.Description>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-[var(--st-spacing-3)]">
            <RadixAlertDialog.Cancel
              onClick={onCancel}
              className={[
                "inline-flex items-center justify-center",
                "h-10 px-[var(--st-spacing-4)] rounded-[var(--st-radius-md)]",
                "text-[var(--st-font-size-base)] font-medium",
                "text-[var(--st-color-text-default)]",
                "hover:bg-[var(--st-color-brand-subtle)] transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
              ].join(" ")}
            >
              {cancelLabel}
            </RadixAlertDialog.Cancel>

            <RadixAlertDialog.Action
              onClick={onConfirm}
              className={[
                "inline-flex items-center justify-center",
                "h-10 px-[var(--st-spacing-4)] rounded-[var(--st-radius-md)]",
                "text-[var(--st-font-size-base)] font-medium text-white transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                variant === "destructive"
                  ? "bg-[var(--st-color-feedback-danger)] hover:opacity-90 focus-visible:ring-[var(--st-color-feedback-danger)]"
                  : "bg-[var(--st-color-brand-primary)] hover:bg-[var(--st-color-brand-primary-hover)] focus-visible:ring-[var(--st-color-brand-primary)]",
              ].join(" ")}
            >
              {confirmLabel}
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
};

AlertDialog.displayName = "AlertDialog";
