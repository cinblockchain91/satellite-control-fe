import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import * as React from "react";

export interface RadioOption {
  value: string;
  label: string;
  helperText?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

export const RadioGroup = ({
  options,
  value,
  onValueChange,
  label,
  error,
  helperText,
  disabled,
  orientation = "vertical",
}: RadioGroupProps) => {
  return (
    <div className="flex flex-col gap-[var(--st-spacing-1)]">
      {label && (
        <span className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]">
          {label}
        </span>
      )}

      <RadixRadioGroup.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        orientation={orientation}
        className={[
          "flex gap-[var(--st-spacing-3)]",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {options.map((opt) => {
          const optId = `radio-${opt.value}`;
          return (
            <div
              key={opt.value}
              className="flex items-start gap-[var(--st-spacing-2)]"
            >
              <RadixRadioGroup.Item
                id={optId}
                value={opt.value}
                disabled={opt.disabled}
                className={[
                  "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center",
                  "rounded-full border-2 outline-none transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "focus-visible:ring-2 focus-visible:ring-offset-1",
                  "focus-visible:ring-[var(--st-color-brand-primary)]",
                  error
                    ? "border-[var(--st-color-feedback-danger)]"
                    : "border-[var(--st-color-text-muted)] data-[state=checked]:border-[var(--st-color-brand-primary)]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <RadixRadioGroup.Indicator className="h-2.5 w-2.5 rounded-full bg-[var(--st-color-brand-primary)]" />
              </RadixRadioGroup.Item>

              <div className="flex flex-col gap-[var(--st-spacing-1)]">
                <label
                  htmlFor={optId}
                  className={[
                    "text-[var(--st-font-size-sm)] leading-none cursor-pointer select-none",
                    opt.disabled || disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "text-[var(--st-color-text-default)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {opt.label}
                </label>
                {opt.helperText && (
                  <p className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]">
                    {opt.helperText}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </RadixRadioGroup.Root>

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

RadioGroup.displayName = "RadioGroup";
