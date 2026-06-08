"use client";

import * as React from "react";

export interface SidebarItem {
  value: string;
  label: string;
  href?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  badge?: string | number;
  disabled?: boolean;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  activeValue?: string;
  onValueChange?: (value: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const SidebarItemComponent = ({
  item,
  activeValue,
  onValueChange,
  collapsed,
  depth = 0,
}: {
  item: SidebarItem;
  activeValue?: string;
  onValueChange?: (value: string) => void;
  collapsed?: boolean;
  depth?: number;
}) => {
  const [expanded, setExpanded] = React.useState(
    item.children?.some((c) => c.value === activeValue) ?? false,
  );
  const isActive = activeValue === item.value;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      <button
        disabled={item.disabled}
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
          else onValueChange?.(item.value);
        }}
        title={collapsed ? item.label : undefined}
        className={[
          "flex w-full items-center gap-[var(--st-spacing-2)]",
          "rounded-[var(--st-radius-md)] transition-colors outline-none",
          "text-[var(--st-font-size-sm)] font-medium",
          "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          collapsed
            ? "justify-center px-[var(--st-spacing-2)] py-[var(--st-spacing-2)]"
            : "px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
          depth > 0 && !collapsed ? "pl-[var(--st-spacing-8)]" : "",
          isActive
            ? "bg-[var(--st-color-brand-subtle)] text-[var(--st-color-brand-primary)]"
            : "text-[var(--st-color-text-muted)] hover:bg-[var(--st-color-brand-subtle)] hover:text-[var(--st-color-text-default)]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {item.icon && (
          <item.icon width={18} height={18} className="flex-shrink-0" />
        )}

        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>

            {item.badge !== undefined && (
              <span
                className={[
                  "inline-flex items-center justify-center",
                  "rounded-full px-[var(--st-spacing-1)] min-w-[18px] h-[18px]",
                  "text-[10px] font-medium",
                  "bg-[var(--st-color-brand-subtle)] text-[var(--st-color-brand-primary)]",
                ].join(" ")}
              >
                {item.badge}
              </span>
            )}

            {hasChildren && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={[
                  "flex-shrink-0 transition-transform duration-[var(--st-motion-duration-fast)]",
                  expanded ? "rotate-180" : "",
                ].join(" ")}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </>
        )}
      </button>

      {/* Children */}
      {hasChildren && expanded && !collapsed && (
        <ul className="mt-[var(--st-spacing-1)] flex flex-col gap-[var(--st-spacing-1)]">
          {item.children!.map((child) => (
            <SidebarItemComponent
              key={child.value}
              item={child}
              activeValue={activeValue}
              onValueChange={onValueChange}
              collapsed={collapsed}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const Sidebar = ({
  items,
  activeValue,
  onValueChange,
  collapsed,
  onCollapsedChange,
  header,
  footer,
}: SidebarProps) => {
  return (
    <aside
      className={[
        "flex flex-col h-full",
        "border-r border-[var(--st-color-text-muted)] border-opacity-20",
        "bg-white transition-all duration-[var(--st-motion-duration-normal)]",
        collapsed ? "w-[60px]" : "w-[240px]",
      ].join(" ")}
    >
      {/* Header */}
      {header && (
        <div
          className={[
            "flex items-center border-b border-[var(--st-color-text-muted)] border-opacity-20",
            "px-[var(--st-spacing-3)] py-[var(--st-spacing-4)]",
            collapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          {!collapsed && header}

          {/* Collapse toggle */}
          {onCollapsedChange && (
            <button
              onClick={() => onCollapsedChange(!collapsed)}
              className={[
                "flex h-8 w-8 flex-shrink-0 items-center justify-center",
                "rounded-[var(--st-radius-md)] text-[var(--st-color-text-muted)]",
                "hover:bg-[var(--st-color-brand-subtle)] hover:text-[var(--st-color-text-default)]",
                "transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
              ].join(" ")}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={[
                  "transition-transform duration-[var(--st-motion-duration-fast)]",
                  collapsed ? "rotate-180" : "",
                ].join(" ")}
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-[var(--st-spacing-2)] py-[var(--st-spacing-3)]">
        <ul className="flex flex-col gap-[var(--st-spacing-1)]">
          {items.map((item) => (
            <SidebarItemComponent
              key={item.value}
              item={item}
              activeValue={activeValue}
              onValueChange={onValueChange}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {footer && (
        <div
          className={[
            "border-t border-[var(--st-color-text-muted)] border-opacity-20",
            "px-[var(--st-spacing-2)] py-[var(--st-spacing-3)]",
          ].join(" ")}
        >
          {footer}
        </div>
      )}
    </aside>
  );
};

Sidebar.displayName = "Sidebar";
