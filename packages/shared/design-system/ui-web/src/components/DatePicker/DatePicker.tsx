"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format } from "date-fns";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export interface DatePickerProps {
  value?: Date | undefined;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  dateFormat?: string;
}

export const DatePicker = ({
  value,
  onValueChange,
  placeholder = "Pick a date",
  label,
  error,
  helperText,
  disabled,
  minDate,
  maxDate,
  dateFormat = "MMM dd, yyyy",
}: DatePickerProps) => {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-[var(--st-spacing-1)]">
      {label && (
        <label
          htmlFor={id}
          className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]"
        >
          {label}
        </label>
      )}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          id={id}
          disabled={disabled}
          className={[
            "flex h-10 w-full items-center justify-between",
            "rounded-[var(--st-radius-md)] px-[var(--st-spacing-3)]",
            "text-[var(--st-font-size-base)] outline-none border transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-[var(--st-color-feedback-danger)]"
              : "border-[var(--st-color-text-muted)] data-[state=open]:border-[var(--st-color-brand-primary)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span
            className={
              value
                ? "text-[var(--st-color-text-default)]"
                : "text-[var(--st-color-text-muted)]"
            }
          >
            {value ? format(value, dateFormat) : placeholder}
          </span>

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--st-color-text-muted)]"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className={[
              "z-50 rounded-[var(--st-radius-md)]",
              "border border-[var(--st-color-text-muted)] bg-white shadow-md p-[var(--st-spacing-3)]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            ]
              .filter(Boolean)
              .join(" ")}
            sideOffset={4}
            align="start"
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onValueChange?.(date);
                setOpen(false);
              }}
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
              styles={{
                root: {
                  fontFamily: "inherit",
                  fontSize: "14px",
                },
              }}
              classNames={{
                today: "font-bold text-[var(--st-color-brand-primary)]",
                selected:
                  "bg-[var(--st-color-brand-primary)] text-white rounded-[var(--st-radius-sm)]",
                day_button:
                  "rounded-[var(--st-radius-sm)] hover:bg-[var(--st-color-brand-subtle)] transition-colors",
                chevron: "fill-[var(--st-color-brand-primary)]",
              }}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {error && (
        <p className="text-[var(--st-font-size-sm)] text-[var(--st-color-feedback-danger)]">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
};

DatePicker.displayName = "DatePicker";
