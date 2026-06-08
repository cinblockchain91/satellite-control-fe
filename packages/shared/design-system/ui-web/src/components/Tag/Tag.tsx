import * as React from "react";

export type TagVariant = "default" | "success" | "warning" | "danger" | "info";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  onRemove?: () => void;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
}

const variantMap: Record<TagVariant, string> = {
  default: [
    "bg-[var(--st-color-brand-subtle)]",
    "text-[var(--st-color-brand-primary)]",
    "border-[var(--st-color-brand-primary)] border-opacity-30",
  ].join(" "),
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-[var(--st-color-feedback-danger)] border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

const removeColorMap: Record<TagVariant, string> = {
  default: "hover:bg-[var(--st-color-brand-primary)] hover:text-white",
  success: "hover:bg-green-500 hover:text-white",
  warning: "hover:bg-amber-500 hover:text-white",
  danger: "hover:bg-[var(--st-color-feedback-danger)] hover:text-white",
  info: "hover:bg-blue-500 hover:text-white",
};

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = "default",
      onRemove,
      icon: IconComponent,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={[
          "inline-flex items-center gap-[var(--st-spacing-1)]",
          "rounded-full border px-[var(--st-spacing-2)] py-0.5",
          "text-[var(--st-font-size-sm)] font-medium",
          "transition-colors select-none",
          disabled && "opacity-50 cursor-not-allowed",
          variantMap[variant],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {IconComponent && (
          <IconComponent width={12} height={12} className="flex-shrink-0" />
        )}

        {children}

        {onRemove && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={[
              "ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center",
              "rounded-full transition-colors outline-none",
              removeColorMap[variant],
            ].join(" ")}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = "Tag";
