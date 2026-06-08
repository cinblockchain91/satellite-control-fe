import * as React from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, string> = {
  default: [
    "bg-[var(--st-color-brand-subtle)]",
    "text-[var(--st-color-brand-primary)]",
    "border-[var(--st-color-brand-primary)]",
  ].join(" "),
  success: ["bg-green-50", "text-green-700", "border-green-200"].join(" "),
  warning: ["bg-amber-50", "text-amber-700", "border-amber-200"].join(" "),
  danger: [
    "bg-red-50",
    "text-[var(--st-color-feedback-danger)]",
    "border-red-200",
  ].join(" "),
  info: ["bg-blue-50", "text-blue-700", "border-blue-200"].join(" "),
};

const dotColorMap: Record<BadgeVariant, string> = {
  default: "bg-[var(--st-color-brand-primary)]",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-[var(--st-color-feedback-danger)]",
  info: "bg-blue-500",
};

const sizeMap: Record<BadgeSize, string> = {
  sm: "px-[var(--st-spacing-2)] py-0.5 text-[var(--st-font-size-xs)]",
  md: "px-[var(--st-spacing-2)] py-[var(--st-spacing-1)] text-[var(--st-font-size-sm)]",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "default", size = "md", dot, className, children, ...props },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={[
          "inline-flex items-center gap-[var(--st-spacing-1)]",
          "rounded-full border font-medium",
          variantMap[variant],
          sizeMap[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {dot && (
          <span
            className={[
              "h-1.5 w-1.5 rounded-full flex-shrink-0",
              dotColorMap[variant],
            ].join(" ")}
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
