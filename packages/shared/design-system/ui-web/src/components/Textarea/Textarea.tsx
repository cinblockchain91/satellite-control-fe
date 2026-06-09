import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      className,
      id,
      disabled,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const textareaId = id ?? React.useId();
    const [count, setCount] = React.useState(
      typeof value === "string" ? value.length : 0,
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-[var(--st-spacing-1)]">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]"
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
              {count}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={[
            "w-full min-h-[100px] rounded-[var(--st-radius-md)]",
            "px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
            "text-[var(--st-font-size-base)] text-[var(--st-color-text-default)]",
            "border transition-colors outline-none resize-y",
            error
              ? "border-[var(--st-color-feedback-danger)] focus:ring-[var(--st-color-feedback-danger)]"
              : "border-[var(--st-color-text-muted)] focus:border-[var(--st-color-brand-primary)] focus:ring-[var(--st-color-brand-primary)]",
            "focus:ring-2 focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:resize-none",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-[var(--st-font-size-sm)] text-[var(--st-color-feedback-danger)]"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${textareaId}-helper`}
            className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
