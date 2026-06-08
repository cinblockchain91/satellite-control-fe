import * as RadixSlider from "@radix-ui/react-slider";
import * as React from "react";

export interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export const Slider = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  helperText,
  error,
  disabled,
  showValue = true,
  formatValue = (v) => String(v),
}: SliderProps) => {
  return (
    <div className="flex flex-col gap-[var(--st-spacing-1)]">
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]">
            {label}
          </span>
        )}
        {showValue && value && (
          <span className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
            {value.length === 2
              ? `${formatValue(value[0])} – ${formatValue(value[1])}`
              : formatValue(value[0])}
          </span>
        )}
      </div>

      <RadixSlider.Root
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={[
          "relative flex w-full touch-none select-none items-center",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--st-color-text-muted)] opacity-30">
          <RadixSlider.Range
            className={[
              "absolute h-full",
              error
                ? "bg-[var(--st-color-feedback-danger)]"
                : "bg-[var(--st-color-brand-primary)]",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </RadixSlider.Track>

        {value?.map((_, i) => (
          <RadixSlider.Thumb
            key={i}
            className={[
              "block h-5 w-5 rounded-full bg-white shadow-md",
              "border-2 transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-offset-1",
              error
                ? "border-[var(--st-color-feedback-danger)] focus-visible:ring-[var(--st-color-feedback-danger)]"
                : "border-[var(--st-color-brand-primary)] focus-visible:ring-[var(--st-color-brand-primary)]",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </RadixSlider.Root>

      <div className="flex justify-between">
        <span className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]">
          {formatValue(min)}
        </span>
        <span className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]">
          {formatValue(max)}
        </span>
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

Slider.displayName = "Slider";
