import * as React from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  showIcon?: boolean;
}

const variantStyles: Record<
  AlertVariant,
  {
    wrapper: string;
    icon: string;
    title: string;
    content: string;
    dismiss: string;
  }
> = {
  info: {
    wrapper: "bg-blue-50 border-blue-200 text-blue-900",
    icon: "text-blue-500",
    title: "text-blue-900",
    content: "text-blue-700",
    dismiss: "text-blue-400 hover:text-blue-600 hover:bg-blue-100",
  },
  success: {
    wrapper: "bg-green-50 border-green-200 text-green-900",
    icon: "text-green-500",
    title: "text-green-900",
    content: "text-green-700",
    dismiss: "text-green-400 hover:text-green-600 hover:bg-green-100",
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-200 text-amber-900",
    icon: "text-amber-500",
    title: "text-amber-900",
    content: "text-amber-700",
    dismiss: "text-amber-400 hover:text-amber-600 hover:bg-amber-100",
  },
  danger: {
    wrapper: "bg-red-50 border-red-200 text-red-900",
    icon: "text-[var(--st-color-feedback-danger)]",
    title: "text-red-900",
    content: "text-red-700",
    dismiss: "text-red-400 hover:text-red-600 hover:bg-red-100",
  },
};

const DefaultIcons: Record<AlertVariant, React.FC> = {
  info: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  success: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
  warning: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  danger: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
};

export const Alert = ({
  variant = "info",
  title,
  children,
  dismissible,
  onDismiss,
  action,
  icon: CustomIcon,
  showIcon = true,
}: AlertProps) => {
  const [dismissed, setDismissed] = React.useState(false);
  const styles = variantStyles[variant];
  const IconComponent = CustomIcon ?? DefaultIcons[variant];

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={[
        "flex gap-[var(--st-spacing-3)]",
        "rounded-[var(--st-radius-md)] border p-[var(--st-spacing-4)]",
        styles.wrapper,
      ].join(" ")}
    >
      {/* Icon */}
      {showIcon && (
        <div className={["flex-shrink-0 mt-0.5", styles.icon].join(" ")}>
          <IconComponent />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0">
        {title && (
          <p
            className={[
              "text-[var(--st-font-size-sm)] font-medium mb-[var(--st-spacing-1)]",
              styles.title,
            ].join(" ")}
          >
            {title}
          </p>
        )}
        <div
          className={["text-[var(--st-font-size-sm)]", styles.content].join(
            " ",
          )}
        >
          {children}
        </div>

        {/* Action */}
        {action && <div className="mt-[var(--st-spacing-3)]">{action}</div>}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={[
            "flex-shrink-0 flex h-6 w-6 items-center justify-center",
            "rounded-[var(--st-radius-sm)] transition-colors outline-none",
            "focus-visible:ring-2 focus-visible:ring-offset-1",
            styles.dismiss,
          ].join(" ")}
          aria-label="Dismiss"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.displayName = "Alert";
