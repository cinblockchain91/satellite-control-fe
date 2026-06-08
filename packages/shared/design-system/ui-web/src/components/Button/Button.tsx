import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium rounded-[var(--st-radius-md)] transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--st-color-brand-primary)] text-white",
          "hover:bg-[var(--st-color-brand-primary-hover)]",
          "focus-visible:ring-[var(--st-color-brand-primary)]",
        ].join(" "),
        secondary: [
          "bg-transparent text-[var(--st-color-brand-primary)]",
          "border border-[var(--st-color-brand-primary)]",
          "hover:bg-[var(--st-color-brand-subtle)]",
          "focus-visible:ring-[var(--st-color-brand-primary)]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--st-color-text-default)]",
          "hover:bg-[var(--st-color-brand-subtle)]",
          "focus-visible:ring-[var(--st-color-brand-primary)]",
        ].join(" "),
        destructive: [
          "bg-[var(--st-color-feedback-danger)] text-white",
          "hover:opacity-90",
          "focus-visible:ring-[var(--st-color-feedback-danger)]",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-[var(--st-spacing-3)] text-[var(--st-font-size-sm)]",
        md: "h-10 px-[var(--st-spacing-4)] text-[var(--st-font-size-base)]",
        lg: "h-12 px-[var(--st-spacing-6)] text-[var(--st-font-size-lg)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild,
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
