"use client";

import * as RadixNav from "@radix-ui/react-navigation-menu";
import * as React from "react";

export interface NavMenuItem {
  value: string;
  label: string;
  href?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  description?: string;
  children?: NavMenuItem[];
}

export interface NavigationMenuProps {
  items: NavMenuItem[];
  activeValue?: string;
}

export const NavigationMenu = ({ items, activeValue }: NavigationMenuProps) => {
  return (
    <RadixNav.Root className="relative flex items-center">
      <RadixNav.List className="flex items-center gap-[var(--st-spacing-1)]">
        {items.map((item) =>
          item.children && item.children.length > 0 ? (
            // Item có dropdown
            <RadixNav.Item key={item.value}>
              <RadixNav.Trigger
                className={[
                  "inline-flex items-center gap-[var(--st-spacing-1)]",
                  "rounded-[var(--st-radius-md)] px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
                  "text-[var(--st-font-size-sm)] font-medium outline-none",
                  "transition-colors select-none",
                  "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
                  activeValue === item.value
                    ? "text-[var(--st-color-brand-primary)] bg-[var(--st-color-brand-subtle)]"
                    : "text-[var(--st-color-text-muted)] hover:text-[var(--st-color-text-default)] hover:bg-[var(--st-color-brand-subtle)]",
                ].join(" ")}
              >
                {item.icon && (
                  <item.icon width={15} height={15} className="flex-shrink-0" />
                )}
                {item.label}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-[var(--st-motion-duration-fast)] group-data-[state=open]:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </RadixNav.Trigger>

              <RadixNav.Content
                className={[
                  "absolute top-full left-0 mt-[var(--st-spacing-2)]",
                  "min-w-[200px] rounded-[var(--st-radius-md)] bg-white",
                  "border border-[var(--st-color-text-muted)] border-opacity-20 shadow-md",
                  "p-[var(--st-spacing-2)] z-50",
                  "data-[motion=from-start]:animate-in data-[motion=to-start]:animate-out",
                  "data-[motion=from-end]:animate-in data-[motion=to-end]:animate-out",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                ].join(" ")}
              >
                {item.children.map((child) => (
                  <a
                    key={child.value}
                    href={child.href ?? "#"}
                    className={[
                      "flex items-start gap-[var(--st-spacing-3)]",
                      "rounded-[var(--st-radius-sm)] p-[var(--st-spacing-3)]",
                      "outline-none transition-colors",
                      "hover:bg-[var(--st-color-brand-subtle)]",
                      "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
                      activeValue === child.value
                        ? "bg-[var(--st-color-brand-subtle)]"
                        : "",
                    ].join(" ")}
                  >
                    {child.icon && (
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[var(--st-radius-sm)] bg-[var(--st-color-brand-subtle)]">
                        <child.icon
                          width={16}
                          height={16}
                          className="text-[var(--st-color-brand-primary)]"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]">
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)] leading-relaxed">
                          {child.description}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </RadixNav.Content>
            </RadixNav.Item>
          ) : (
            // Item đơn giản
            <RadixNav.Item key={item.value}>
              <RadixNav.Link
                href={item.href ?? "#"}
                className={[
                  "inline-flex items-center gap-[var(--st-spacing-1)]",
                  "rounded-[var(--st-radius-md)] px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
                  "text-[var(--st-font-size-sm)] font-medium outline-none",
                  "transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
                  activeValue === item.value
                    ? "text-[var(--st-color-brand-primary)] bg-[var(--st-color-brand-subtle)]"
                    : "text-[var(--st-color-text-muted)] hover:text-[var(--st-color-text-default)] hover:bg-[var(--st-color-brand-subtle)]",
                ].join(" ")}
              >
                {item.icon && (
                  <item.icon width={15} height={15} className="flex-shrink-0" />
                )}
                {item.label}
              </RadixNav.Link>
            </RadixNav.Item>
          ),
        )}
      </RadixNav.List>

      {/* Viewport cho dropdown */}
      <div className="absolute top-full left-0 w-full">
        <RadixNav.Viewport />
      </div>
    </RadixNav.Root>
  );
};

NavigationMenu.displayName = "NavigationMenu";
