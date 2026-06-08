import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  clickable?: boolean;
  selected?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// Card root
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable, clickable, selected, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-[var(--st-radius-lg)] border bg-white",
          "border-[var(--st-color-text-muted)] border-opacity-20",
          hoverable && "transition-shadow hover:shadow-md",
          clickable &&
            "cursor-pointer transition-all hover:shadow-md active:scale-[0.99]",
          selected &&
            "border-[var(--st-color-brand-primary)] ring-2 ring-[var(--st-color-brand-primary)] ring-opacity-20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// Card header
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "flex items-start justify-between",
          "px-[var(--st-spacing-6)] pt-[var(--st-spacing-6)]",
          description ? "pb-[var(--st-spacing-2)]" : "pb-[var(--st-spacing-4)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="flex flex-col gap-[var(--st-spacing-1)]">
          <h3 className="text-[var(--st-font-size-base)] font-medium text-[var(--st-color-text-default)]">
            {title}
          </h3>
          {description && (
            <p className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="ml-[var(--st-spacing-4)] flex-shrink-0">{action}</div>
        )}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

// Card content
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "px-[var(--st-spacing-6)] py-[var(--st-spacing-4)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

// Card footer
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "flex items-center justify-end gap-[var(--st-spacing-3)]",
          "px-[var(--st-spacing-6)] pb-[var(--st-spacing-6)] pt-[var(--st-spacing-4)]",
          "border-t border-[var(--st-color-text-muted)] border-opacity-20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";
