import * as React from "react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  size?: IconSize;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon = ({
  icon: IconComponent,
  size = "md",
  label,
  className,
  style,
}: IconProps) => {
  const px = sizeMap[size];

  return (
    <IconComponent
      width={px}
      height={px}
      aria-hidden={!label}
      aria-label={label}
      role={label ? "img" : undefined}
      className={[
        "inline-block flex-shrink-0",
        "fill-none stroke-current",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    />
  );
};

Icon.displayName = "Icon";
