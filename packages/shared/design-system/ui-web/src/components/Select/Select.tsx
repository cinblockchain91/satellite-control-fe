import * as RadixSelect from "@radix-ui/react-select";
import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
}

export const Select = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  error,
  helperText,
  disabled,
  clearable,
}: SelectProps) => {
  const id = React.useId();

  return (
    <div className="flex flex-col gap-[var(--st-spacing-1)]">
      {label && (
        <label
          htmlFor={id}
          className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]"
        >
          {label}
        </label>
      )}

      <RadixSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={id}
          className={[
            "flex h-10 w-full items-center justify-between",
            "rounded-[var(--st-radius-md)] px-[var(--st-spacing-3)]",
            "text-[var(--st-font-size-base)] outline-none border transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-[var(--st-color-feedback-danger)] focus:ring-[var(--st-color-feedback-danger)]"
              : "border-[var(--st-color-text-muted)] focus:border-[var(--st-color-brand-primary)] focus:ring-[var(--st-color-brand-primary)]",
            "focus:ring-2 focus:ring-offset-1",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <RadixSelect.Value
            placeholder={
              <span className="text-[var(--st-color-text-muted)]">
                {placeholder}
              </span>
            }
          />
          <RadixSelect.Icon>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--st-color-text-muted)]"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className={[
              "z-50 min-w-[8rem] overflow-hidden",
              "rounded-[var(--st-radius-md)] border border-[var(--st-color-text-muted)]",
              "bg-white shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            ]
              .filter(Boolean)
              .join(" ")}
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-[var(--st-spacing-1)]">
              {clearable && value && (
                <>
                  <RadixSelect.Item
                    value=""
                    className={[
                      "relative flex cursor-pointer select-none items-center",
                      "rounded-[var(--st-radius-sm)] px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
                      "text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]",
                      "outline-none hover:bg-[var(--st-color-brand-subtle)]",
                      "data-[highlighted]:bg-[var(--st-color-brand-subtle)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <RadixSelect.ItemText>Clear</RadixSelect.ItemText>
                  </RadixSelect.Item>
                  <RadixSelect.Separator className="my-1 h-px bg-[var(--st-color-text-muted)] opacity-20" />
                </>
              )}

              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={[
                    "relative flex cursor-pointer select-none items-center",
                    "rounded-[var(--st-radius-sm)] px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
                    "text-[var(--st-font-size-sm)] text-[var(--st-color-text-default)]",
                    "outline-none hover:bg-[var(--st-color-brand-subtle)]",
                    "data-[highlighted]:bg-[var(--st-color-brand-subtle)]",
                    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[var(--st-color-brand-primary)]"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

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

Select.displayName = "Select";
