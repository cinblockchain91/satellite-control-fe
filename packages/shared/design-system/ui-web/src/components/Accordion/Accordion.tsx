"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import * as React from "react";

export interface AccordionItem {
  value: string;
  trigger: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  variant?: "default" | "bordered" | "flush";
}

const variantStyles = {
  default: {
    root: "flex flex-col gap-[var(--st-spacing-2)]",
    item: "rounded-[var(--st-radius-md)] border border-[var(--st-color-text-muted)] border-opacity-20 overflow-hidden",
    trigger: "px-[var(--st-spacing-4)]",
    content: "px-[var(--st-spacing-4)]",
  },
  bordered: {
    root: "rounded-[var(--st-radius-md)] border border-[var(--st-color-text-muted)] border-opacity-20 overflow-hidden",
    item: "border-b border-[var(--st-color-text-muted)] border-opacity-20 last:border-0",
    trigger: "px-[var(--st-spacing-4)]",
    content: "px-[var(--st-spacing-4)]",
  },
  flush: {
    root: "flex flex-col",
    item: "border-b border-[var(--st-color-text-muted)] border-opacity-20 last:border-0",
    trigger: "px-0",
    content: "px-0",
  },
};

export const Accordion = ({
  items,
  type = "single",
  defaultValue,
  value,
  onValueChange,
  collapsible = true,
  variant = "default",
}: AccordionProps) => {
  const styles = variantStyles[variant];

  const rootProps =
    type === "single"
      ? {
          type: "single" as const,
          defaultValue: defaultValue as string | undefined,
          value: value as string | undefined,
          onValueChange: onValueChange as ((v: string) => void) | undefined,
          collapsible,
        }
      : {
          type: "multiple" as const,
          defaultValue: defaultValue as string[] | undefined,
          value: value as string[] | undefined,
          onValueChange: onValueChange as ((v: string[]) => void) | undefined,
        };

  return (
    <RadixAccordion.Root className={styles.root} {...rootProps}>
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={[
            styles.item,
            item.disabled && "opacity-50 cursor-not-allowed",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Trigger */}
          <RadixAccordion.Header>
            <RadixAccordion.Trigger
              className={[
                "flex w-full items-center justify-between gap-[var(--st-spacing-3)]",
                "py-[var(--st-spacing-4)] outline-none",
                "text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]",
                "hover:text-[var(--st-color-brand-primary)] transition-colors",
                "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
                "data-[state=open]:text-[var(--st-color-brand-primary)]",
                "disabled:cursor-not-allowed",
                styles.trigger,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center gap-[var(--st-spacing-2)]">
                {item.icon && (
                  <item.icon
                    width={16}
                    height={16}
                    className="flex-shrink-0 text-[var(--st-color-text-muted)]"
                  />
                )}
                {item.trigger}
              </div>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={[
                  "flex-shrink-0 transition-transform duration-[var(--st-motion-duration-fast)]",
                  "data-[state=open]:rotate-180",
                  "text-[var(--st-color-text-muted)]",
                ].join(" ")}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>

          {/* Content */}
          <RadixAccordion.Content
            className={[
              "overflow-hidden text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            ].join(" ")}
          >
            <div
              className={["pb-[var(--st-spacing-4)]", styles.content].join(" ")}
            >
              {item.content}
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
};

Accordion.displayName = "Accordion";
