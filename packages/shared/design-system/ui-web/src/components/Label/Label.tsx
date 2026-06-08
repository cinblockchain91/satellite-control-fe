import * as RadixLabel from "@radix-ui/react-label";
import * as React from "react";

export interface LabelProps extends React.ComponentPropsWithoutRef<
  typeof RadixLabel.Root
> {
  required?: boolean;
  disabled?: boolean;
}

export const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  LabelProps
>(({ required, disabled, className, children, ...props }, ref) => {
  return (
    <RadixLabel.Root
      ref={ref}
      className={[
        "text-[var(--st-font-size-sm)] font-medium",
        "text-[var(--st-color-text-default)]",
        "leading-none select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
      {required && (
        <span
          className="ml-[var(--st-spacing-1)] text-[var(--st-color-feedback-danger)]"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </RadixLabel.Root>
  );
});

Label.displayName = "Label";
