import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  clearable?: boolean;
}

export const Combobox = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  label,
  error,
  helperText,
  disabled,
  clearable,
}: ComboboxProps) => {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (val: string) => {
    onValueChange?.(val === value && clearable ? "" : val);
    setOpen(false);
    setSearch("");
  };

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

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          id={id}
          disabled={disabled}
          className={[
            "flex h-10 w-full items-center justify-between",
            "rounded-[var(--st-radius-md)] px-[var(--st-spacing-3)]",
            "text-[var(--st-font-size-base)] outline-none border transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-[var(--st-color-feedback-danger)]"
              : "border-[var(--st-color-text-muted)] data-[state=open]:border-[var(--st-color-brand-primary)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span
            className={
              selected
                ? "text-[var(--st-color-text-default)]"
                : "text-[var(--st-color-text-muted)]"
            }
          >
            {selected ? selected.label : placeholder}
          </span>

          <div className="flex items-center gap-[var(--st-spacing-1)]">
            {clearable && selected && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onValueChange?.("");
                }}
                className="text-[var(--st-color-text-muted)] hover:text-[var(--st-color-text-default)] transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </span>
            )}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={[
                "text-[var(--st-color-text-muted)] transition-transform duration-[var(--st-motion-duration-fast)]",
                open ? "rotate-180" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className={[
              "z-50 w-[var(--radix-popover-trigger-width)]",
              "overflow-hidden rounded-[var(--st-radius-md)]",
              "border border-[var(--st-color-text-muted)] bg-white shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            ]
              .filter(Boolean)
              .join(" ")}
            sideOffset={4}
            align="start"
          >
            {/* Search input */}
            <div className="border-b border-[var(--st-color-text-muted)] border-opacity-20 p-[var(--st-spacing-2)]">
              <div className="flex items-center gap-[var(--st-spacing-2)]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--st-color-text-muted)] flex-shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full text-[var(--st-font-size-sm)] outline-none text-[var(--st-color-text-default)] placeholder:text-[var(--st-color-text-muted)] bg-transparent"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-60 overflow-y-auto p-[var(--st-spacing-1)]">
              {filtered.length === 0 ? (
                <div className="py-[var(--st-spacing-3)] text-center text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
                  No results found
                </div>
              ) : (
                filtered.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    className={[
                      "flex items-center justify-between",
                      "rounded-[var(--st-radius-sm)] px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
                      "text-[var(--st-font-size-sm)] transition-colors",
                      opt.disabled
                        ? "opacity-50 cursor-not-allowed text-[var(--st-color-text-muted)]"
                        : "cursor-pointer text-[var(--st-color-text-default)] hover:bg-[var(--st-color-brand-subtle)]",
                      opt.value === value &&
                        "bg-[var(--st-color-brand-subtle)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span>{opt.label}</span>
                    {opt.value === value && (
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
                    )}
                  </div>
                ))
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

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

Combobox.displayName = "Combobox";
