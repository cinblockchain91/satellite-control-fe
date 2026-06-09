import * as React from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "default" | "success" | "warning" | "danger";

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const strokeMap: Record<SpinnerSize, number> = {
  xs: 2,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 3.5,
};

const colorMap: Record<SpinnerVariant, string> = {
  default: "text-[var(--st-color-brand-primary)]",
  success: "text-green-500",
  warning: "text-amber-500",
  danger: "text-[var(--st-color-feedback-danger)]",
};

export const Spinner = ({
  size = "md",
  variant = "default",
  label,
  className,
}: SpinnerProps) => {
  const px = sizeMap[size];
  const stroke = strokeMap[size];
  const r = (px - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={[
        "inline-flex flex-col items-center gap-[var(--st-spacing-2)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        className={["animate-spin", colorMap[variant]].join(" ")}
      >
        {/* Track */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          opacity={0.2}
        />
        {/* Arc */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
          transform={`rotate(-90 ${px / 2} ${px / 2})`}
        />
      </svg>

      {label && (
        <span
          className={[
            "text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]",
          ].join(" ")}
        >
          {label}
        </span>
      )}
    </div>
  );
};

Spinner.displayName = "Spinner";
