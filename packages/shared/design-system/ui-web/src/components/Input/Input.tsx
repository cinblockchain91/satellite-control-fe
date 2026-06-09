import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, disabled, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <div className="flex flex-col gap-[var(--st-spacing-1)]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={[
            "h-10 w-full rounded-[var(--st-radius-md)] px-[var(--st-spacing-3)]",
            "text-[var(--st-font-size-base)] text-[var(--st-color-text-default)]",
            "border transition-colors outline-none",
            error
              ? "border-[var(--st-color-feedback-danger)] focus:ring-[var(--st-color-feedback-danger)]"
              : "border-[var(--st-color-text-muted)] focus:border-[var(--st-color-brand-primary)] focus:ring-[var(--st-color-brand-primary)]",
            "focus:ring-2 focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[var(--st-font-size-sm)] text-[var(--st-color-feedback-danger)]"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
