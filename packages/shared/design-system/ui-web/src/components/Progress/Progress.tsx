import * as RadixProgress from "@radix-ui/react-progress";
import * as React from "react";

export type ProgressVariant = "default" | "success" | "warning" | "danger";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
}

const trackSizeMap: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const fillColorMap: Record<ProgressVariant, string> = {
  default: "bg-[var(--st-color-brand-primary)]",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-[var(--st-color-feedback-danger)]",
};

export const Progress = ({
  value = 0,
  max = 100,
  variant = "default",
  size = "md",
  label,
  showValue = false,
  animated = false,
  indeterminate = false,
}: ProgressProps) => {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="flex flex-col gap-[var(--st-spacing-1)]">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]">
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
              {pct}%
            </span>
          )}
        </div>
      )}

      <RadixProgress.Root
        value={indeterminate ? null : value}
        max={max}
        className={[
          "relative w-full overflow-hidden rounded-full",
          "bg-[var(--st-color-text-muted)] bg-opacity-20",
          trackSizeMap[size],
        ].join(" ")}
      >
        <RadixProgress.Indicator
          className={[
            "h-full rounded-full transition-all duration-[var(--st-motion-duration-normal)]",
            fillColorMap[variant],
            animated && !indeterminate && "transition-[width]",
            indeterminate &&
              "animate-[indeterminate_1.5s_ease-in-out_infinite]",
          ]
            .filter(Boolean)
            .join(" ")}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </RadixProgress.Root>
    </div>
  );
};

Progress.displayName = "Progress";
