import * as RadixAvatar from "@radix-ui/react-avatar";
import * as React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[var(--st-font-size-xs)]",
  md: "h-10 w-10 text-[var(--st-font-size-sm)]",
  lg: "h-12 w-12 text-[var(--st-font-size-base)]",
  xl: "h-16 w-16 text-[var(--st-font-size-lg)]",
};

const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, size = "md", className }, ref) => {
    return (
      <RadixAvatar.Root
        ref={ref}
        className={[
          "relative inline-flex flex-shrink-0 items-center justify-center",
          "rounded-full overflow-hidden select-none",
          sizeMap[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <RadixAvatar.Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
        <RadixAvatar.Fallback
          className={[
            "flex h-full w-full items-center justify-center",
            "rounded-full font-medium",
            "bg-[var(--st-color-brand-subtle)] text-[var(--st-color-brand-primary)]",
          ].join(" ")}
          delayMs={600}
        >
          {getInitials(fallback)}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>
    );
  },
);

Avatar.displayName = "Avatar";

// Avatar Group
export const AvatarGroup = ({
  children,
  max,
  size = "md",
}: AvatarGroupProps) => {
  const childArray = React.Children.toArray(children);
  const visible = max ? childArray.slice(0, max) : childArray;
  const overflow = max ? childArray.length - max : 0;

  return (
    <div className="flex items-center">
      {visible.map((child, i) => (
        <div
          key={i}
          className={[
            "relative ring-2 ring-white rounded-full",
            i > 0 ? "-ml-2" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ zIndex: visible.length - i }}
        >
          {child}
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={[
            "relative -ml-2 inline-flex flex-shrink-0 items-center justify-center",
            "rounded-full ring-2 ring-white font-medium",
            "bg-[var(--st-color-text-muted)] text-white",
            sizeMap[size],
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ zIndex: 0 }}
        >
          <span className="text-[var(--st-font-size-xs)]">+{overflow}</span>
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";
