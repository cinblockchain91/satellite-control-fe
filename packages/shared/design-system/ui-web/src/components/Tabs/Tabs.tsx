"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import * as React from "react";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

export interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs = ({
  items,
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  children,
}: TabsProps) => {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={[
        orientation === "vertical"
          ? "flex flex-row gap-[var(--st-spacing-6)]"
          : "flex flex-col",
      ].join(" ")}
    >
      {/* Tab list */}
      <RadixTabs.List
        className={[
          orientation === "horizontal"
            ? [
                "flex flex-row border-b border-[var(--st-color-text-muted)] border-opacity-20",
                "gap-[var(--st-spacing-1)]",
              ].join(" ")
            : [
                "flex flex-col gap-[var(--st-spacing-1)]",
                "border-r border-[var(--st-color-text-muted)] border-opacity-20",
                "pr-[var(--st-spacing-3)] min-w-[160px]",
              ].join(" "),
        ].join(" ")}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={[
              "inline-flex items-center gap-[var(--st-spacing-2)]",
              "text-[var(--st-font-size-sm)] font-medium outline-none",
              "transition-colors select-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
              orientation === "horizontal"
                ? [
                    "px-[var(--st-spacing-3)] pb-[var(--st-spacing-3)] pt-[var(--st-spacing-2)]",
                    "border-b-2 border-transparent -mb-px",
                    "text-[var(--st-color-text-muted)]",
                    "hover:text-[var(--st-color-text-default)]",
                    "data-[state=active]:border-[var(--st-color-brand-primary)]",
                    "data-[state=active]:text-[var(--st-color-brand-primary)]",
                  ].join(" ")
                : [
                    "px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
                    "rounded-[var(--st-radius-md)] w-full text-left",
                    "text-[var(--st-color-text-muted)]",
                    "hover:bg-[var(--st-color-brand-subtle)] hover:text-[var(--st-color-text-default)]",
                    "data-[state=active]:bg-[var(--st-color-brand-subtle)]",
                    "data-[state=active]:text-[var(--st-color-brand-primary)]",
                  ].join(" "),
            ].join(" ")}
          >
            {item.icon && (
              <item.icon width={15} height={15} className="flex-shrink-0" />
            )}
            {item.label}
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
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {/* Tab content */}
      <div
        className={[
          orientation === "horizontal" ? "pt-[var(--st-spacing-4)]" : "flex-1",
        ].join(" ")}
      >
        {children}
      </div>
    </RadixTabs.Root>
  );
};

Tabs.displayName = "Tabs";

export const TabContent = ({ value, children }: TabContentProps) => {
  return (
    <RadixTabs.Content
      value={value}
      className="outline-none data-[state=inactive]:hidden"
    >
      {children}
    </RadixTabs.Content>
  );
};

TabContent.displayName = "TabContent";
