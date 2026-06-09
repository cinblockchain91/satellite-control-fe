import * as RadixSwitch from "@radix-ui/react-switch";
import * as React from "react";

export interface SwitchProps {
  label?: string;
  labelPosition?: "left" | "right";
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  id?: string;
}

export const Switch = ({
  label,
  labelPosition = "right",
  checked,
  onCheckedChange,
  disabled,
  helperText,
  error,
  id,
}: SwitchProps) => {
  const switchId = id ?? React.useId();

  return (
    <div className="flex flex-col gap-[var(--st-spacing-1)]">
      <div className="flex items-center gap-[var(--st-spacing-2)]">
        {label && labelPosition === "left" && (
          <label
            htmlFor={switchId}
            className={[
              "text-[var(--st-font-size-sm)] leading-none select-none",
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer text-[var(--st-color-text-default)]",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </label>
        )}

        <RadixSwitch.Root
          id={switchId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={[
            "relative inline-flex h-6 w-11 flex-shrink-0 items-center",
            "rounded-full border-2 border-transparent outline-none",
            "transition-colors cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-offset-1",
            "focus-visible:ring-[var(--st-color-brand-primary)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "bg-[var(--st-color-feedback-danger)]"
              : "bg-[var(--st-color-text-muted)] data-[state=checked]:bg-[var(--st-color-brand-primary)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <RadixSwitch.Thumb
            className={[
              "block h-5 w-5 rounded-full bg-white shadow",
              "transition-transform duration-[var(--st-motion-duration-fast)]",
              "translate-x-0 data-[state=checked]:translate-x-5",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </RadixSwitch.Root>

        {label && labelPosition === "right" && (
          <label
            htmlFor={switchId}
            className={[
              "text-[var(--st-font-size-sm)] leading-none select-none",
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer text-[var(--st-color-text-default)]",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </label>
        )}
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

Switch.displayName = "Switch";
