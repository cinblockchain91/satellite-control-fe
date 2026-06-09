import * as React from "react";

// Heading
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = "h1", className, children, ...props }, ref) => {
    const sizeMap = {
      h1: "text-[var(--st-font-size-4xl)] font-[var(--st-font-weight-bold)] leading-[var(--st-font-line-height-tight)]",
      h2: "text-[var(--st-font-size-3xl)] font-[var(--st-font-weight-bold)] leading-[var(--st-font-line-height-tight)]",
      h3: "text-[var(--st-font-size-2xl)] font-[var(--st-font-weight-medium)] leading-[var(--st-font-line-height-tight)]",
      h4: "text-[var(--st-font-size-xl)] font-[var(--st-font-weight-medium)] leading-[var(--st-font-line-height-normal)]",
    };

    return (
      <Tag
        ref={ref}
        className={[
          "text-[var(--st-color-text-default)]",
          sizeMap[Tag],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Heading.displayName = "Heading";

// Text
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div";
  size?: "sm" | "base" | "lg";
  muted?: boolean;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    { as: Tag = "p", size = "base", muted, className, children, ...props },
    ref,
  ) => {
    const sizeMap = {
      sm: "text-[var(--st-font-size-sm)]",
      base: "text-[var(--st-font-size-base)]",
      lg: "text-[var(--st-font-size-lg)]",
    };

    return (
      <Tag
        ref={ref}
        className={[
          sizeMap[size],
          "leading-[var(--st-font-line-height-normal)]",
          muted
            ? "text-[var(--st-color-text-muted)]"
            : "text-[var(--st-color-text-default)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Text.displayName = "Text";

// Caption
export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  muted?: boolean;
}

export const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ muted, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[
          "text-[var(--st-font-size-xs)]",
          "leading-[var(--st-font-line-height-normal)]",
          muted
            ? "text-[var(--st-color-text-muted)]"
            : "text-[var(--st-color-text-default)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Caption.displayName = "Caption";

// Code
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={[
          "text-[var(--st-font-size-sm)]",
          "font-[var(--st-font-family-mono)]",
          "bg-[var(--st-color-brand-subtle)]",
          "text-[var(--st-color-brand-primary)]",
          "px-[var(--st-spacing-1)] py-[2px]",
          "rounded-[var(--st-radius-sm)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </code>
    );
  },
);

Code.displayName = "Code";
