import * as RadixCheckbox from "@radix-ui/react-checkbox";
import * as React from "react";

export interface CheckboxProps {
  label?: string;
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
}

export const Checkbox = ({
  label,
  checked,
  onCheckedChange,
  disabled,
  error,
  helperText,
  id,
}: CheckboxProps) => {
  const checkboxId = id ?? React.useId();

  return (
    <div className="flex flex-col gap-[var(--st-spacing-1)]">
      <div className="flex items-center gap-[var(--st-spacing-2)]">
        <RadixCheckbox.Root
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={[
            "flex h-5 w-5 flex-shrink-0 items-center justify-center",
            "rounded-[var(--st-radius-sm)] border transition-colors outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:ring-2 focus-visible:ring-offset-1",
            "focus-visible:ring-[var(--st-color-brand-primary)]",
            error
              ? "border-[var(--st-color-feedback-danger)]"
              : "border-[var(--st-color-text-muted)] data-[state=checked]:border-[var(--st-color-brand-primary)] data-[state=checked]:bg-[var(--st-color-brand-primary)] data-[state=indeterminate]:border-[var(--st-color-brand-primary)] data-[state=indeterminate]:bg-[var(--st-color-brand-primary)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <RadixCheckbox.Indicator>
            {checked === "indeterminate" ? (
              <svg
                width="10"
                height="2"
                viewBox="0 0 10 2"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M1 1h8" />
              </svg>
            ) : (
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 4l3 3 5-6" />
              </svg>
            )}
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>

        {label && (
          <label
            htmlFor={checkboxId}
            className={[
              "text-[var(--st-font-size-sm)] leading-none cursor-pointer select-none",
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "text-[var(--st-color-text-default)]",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </label>
        )}
      </div>

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

Checkbox.displayName = "Checkbox";
