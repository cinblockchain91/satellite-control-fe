import * as React from "react";

export interface EmptyStateProps {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: {
    wrapper: "py-[var(--st-spacing-8)]",
    iconSize: 32,
    iconWrapper: "h-12 w-12",
    title: "text-[var(--st-font-size-base)]",
    description: "text-[var(--st-font-size-sm)]",
  },
  md: {
    wrapper: "py-[var(--st-spacing-12)]",
    iconSize: 40,
    iconWrapper: "h-16 w-16",
    title: "text-[var(--st-font-size-lg)]",
    description: "text-[var(--st-font-size-base)]",
  },
  lg: {
    wrapper: "py-[var(--st-spacing-16)]",
    iconSize: 48,
    iconWrapper: "h-20 w-20",
    title: "text-[var(--st-font-size-2xl)]",
    description: "text-[var(--st-font-size-lg)]",
  },
};

// Default icon khi không truyền icon prop
const DefaultIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

export const EmptyState = ({
  icon: IconComponent,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
}: EmptyStateProps) => {
  const s = sizeMap[size];
  const Icon = IconComponent ?? DefaultIcon;

  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        "px-[var(--st-spacing-6)]",
        s.wrapper,
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className={[
          "mb-[var(--st-spacing-4)] flex items-center justify-center",
          "rounded-full bg-[var(--st-color-brand-subtle)]",
          "text-[var(--st-color-brand-primary)]",
          s.iconWrapper,
        ].join(" ")}
      >
        <Icon width={s.iconSize} height={s.iconSize} />
      </div>

      {/* Title */}
      <h3
        className={[
          "font-medium text-[var(--st-color-text-default)]",
          "mb-[var(--st-spacing-2)]",
          s.title,
        ].join(" ")}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={[
            "max-w-sm text-[var(--st-color-text-muted)]",
            "mb-[var(--st-spacing-6)]",
            s.description,
          ].join(" ")}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-[var(--st-spacing-3)]">
          {secondaryAction}
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = "EmptyState";
