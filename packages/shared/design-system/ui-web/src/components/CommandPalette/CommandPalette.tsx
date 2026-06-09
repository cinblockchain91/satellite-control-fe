"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Modal } from "../Modal/Modal";

export interface CommandItem {
  value: string;
  label: string;
  description?: string;
  shortcut?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  onSelect?: () => void;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups: CommandGroup[];
  placeholder?: string;
}

export const CommandPalette = ({
  open,
  onOpenChange,
  groups,
  placeholder = "Search commands...",
}: CommandPaletteProps) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size="md" hideCloseButton>
      <Command className="flex flex-col" shouldFilter={true}>
        {/* Search input */}
        <div
          className={[
            "flex items-center gap-[var(--st-spacing-2)]",
            "border-b border-[var(--st-color-text-muted)] border-opacity-20",
            "px-[var(--st-spacing-3)] pb-[var(--st-spacing-3)]",
          ].join(" ")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="flex-shrink-0 text-[var(--st-color-text-muted)]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Command.Input
            placeholder={placeholder}
            className={[
              "flex-1 bg-transparent outline-none",
              "text-[var(--st-font-size-base)] text-[var(--st-color-text-default)]",
              "placeholder:text-[var(--st-color-text-muted)]",
            ].join(" ")}
          />
        </div>

        {/* Results */}
        <Command.List className="max-h-72 overflow-y-auto py-[var(--st-spacing-2)]">
          <Command.Empty className="py-[var(--st-spacing-6)] text-center text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
            No results found
          </Command.Empty>

          {groups.map((group) => (
            <Command.Group
              key={group.label}
              heading={group.label}
              className="px-[var(--st-spacing-2)]"
            >
              <div className="px-[var(--st-spacing-2)] py-[var(--st-spacing-1)] text-[var(--st-font-size-xs)] font-medium text-[var(--st-color-text-muted)] uppercase tracking-wide">
                {group.label}
              </div>

              {group.items.map((item) => (
                <Command.Item
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    item.onSelect?.();
                    onOpenChange?.(false);
                  }}
                  className={[
                    "flex cursor-pointer items-center gap-[var(--st-spacing-3)]",
                    "rounded-[var(--st-radius-md)] px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
                    "text-[var(--st-font-size-sm)] text-[var(--st-color-text-default)]",
                    "outline-none transition-colors",
                    "aria-selected:bg-[var(--st-color-brand-subtle)]",
                    "aria-selected:text-[var(--st-color-brand-primary)]",
                  ].join(" ")}
                >
                  {item.icon && (
                    <item.icon
                      width={16}
                      height={16}
                      className="flex-shrink-0 text-[var(--st-color-text-muted)]"
                    />
                  )}

                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)] truncate">
                        {item.description}
                      </span>
                    )}
                  </div>

                  {item.shortcut && (
                    <div className="flex gap-1">
                      {item.shortcut.split("+").map((key, i) => (
                        <kbd
                          key={i}
                          className={[
                            "inline-flex items-center justify-center",
                            "rounded-[var(--st-radius-sm)] border border-[var(--st-color-text-muted)]",
                            "border-opacity-30 px-1.5 py-0.5",
                            "text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]",
                            "font-mono",
                          ].join(" ")}
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        {/* Footer hint */}
        <div
          className={[
            "flex items-center gap-[var(--st-spacing-4)]",
            "border-t border-[var(--st-color-text-muted)] border-opacity-20",
            "px-[var(--st-spacing-3)] pt-[var(--st-spacing-2)]",
            "text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]",
          ].join(" ")}
        >
          <span>
            <kbd className="font-mono">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> select
          </span>
          <span>
            <kbd className="font-mono">esc</kbd> close
          </span>
        </div>
      </Command>
    </Modal>
  );
};

CommandPalette.displayName = "CommandPalette";
