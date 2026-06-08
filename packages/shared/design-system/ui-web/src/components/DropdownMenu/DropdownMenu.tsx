"use client";

import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import * as React from "react";

export interface DropdownMenuItem {
  type?: "item" | "separator" | "label";
  label?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
  children?: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const itemClass = (destructive?: boolean, disabled?: boolean) =>
  [
    "relative flex cursor-pointer select-none items-center gap-[var(--st-spacing-2)]",
    "rounded-[var(--st-radius-sm)] px-[var(--st-spacing-2)] py-[var(--st-spacing-2)]",
    "text-[var(--st-font-size-sm)] outline-none transition-colors",
    destructive
      ? "text-[var(--st-color-feedback-danger)] focus:bg-red-50"
      : "text-[var(--st-color-text-default)] focus:bg-[var(--st-color-brand-subtle)]",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
  ]
    .filter(Boolean)
    .join(" ");

export const DropdownMenu = ({
  trigger,
  items,
  side = "bottom",
  align = "start",
  sideOffset = 4,
}: DropdownMenuProps) => {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={[
            "z-50 min-w-[160px] overflow-hidden",
            "rounded-[var(--st-radius-md)] border border-[var(--st-color-text-muted)]",
            "border-opacity-20 bg-white p-[var(--st-spacing-1)] shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:slide-in-from-bottom-2",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {items.map((item, i) => {
            if (item.type === "separator") {
              return (
                <RadixDropdown.Separator
                  key={i}
                  className="my-[var(--st-spacing-1)] h-px bg-[var(--st-color-text-muted)] opacity-20"
                />
              );
            }

            if (item.type === "label") {
              return (
                <RadixDropdown.Label
                  key={i}
                  className="px-[var(--st-spacing-2)] py-[var(--st-spacing-1)] text-[var(--st-font-size-xs)] font-medium text-[var(--st-color-text-muted)] uppercase tracking-wide"
                >
                  {item.label}
                </RadixDropdown.Label>
              );
            }

            // Sub menu
            if (item.children && item.children.length > 0) {
              return (
                <RadixDropdown.Sub key={i}>
                  <RadixDropdown.SubTrigger
                    className={itemClass(item.destructive, item.disabled)}
                  >
                    {item.icon && (
                      <item.icon
                        width={14}
                        height={14}
                        className="flex-shrink-0"
                      />
                    )}
                    <span className="flex-1">{item.label}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </RadixDropdown.SubTrigger>

                  <RadixDropdown.Portal>
                    <RadixDropdown.SubContent
                      sideOffset={4}
                      className={[
                        "z-50 min-w-[160px] overflow-hidden",
                        "rounded-[var(--st-radius-md)] border border-[var(--st-color-text-muted)]",
                        "border-opacity-20 bg-white p-[var(--st-spacing-1)] shadow-md",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {item.children.map((child, j) => (
                        <RadixDropdown.Item
                          key={j}
                          disabled={child.disabled}
                          onClick={child.onClick}
                          className={itemClass(
                            child.destructive,
                            child.disabled,
                          )}
                        >
                          {child.icon && (
                            <child.icon
                              width={14}
                              height={14}
                              className="flex-shrink-0"
                            />
                          )}
                          <span className="flex-1">{child.label}</span>
                        </RadixDropdown.Item>
                      ))}
                    </RadixDropdown.SubContent>
                  </RadixDropdown.Portal>
                </RadixDropdown.Sub>
              );
            }

            return (
              <RadixDropdown.Item
                key={i}
                disabled={item.disabled}
                onClick={item.onClick}
                className={itemClass(item.destructive, item.disabled)}
              >
                {item.icon && (
                  <item.icon width={14} height={14} className="flex-shrink-0" />
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]">
                    {item.shortcut}
                  </span>
                )}
              </RadixDropdown.Item>
            );
          })}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
};

DropdownMenu.displayName = "DropdownMenu";
