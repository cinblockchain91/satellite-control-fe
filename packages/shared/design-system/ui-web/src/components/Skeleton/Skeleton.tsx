import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-[var(--st-radius-sm)]",
  md: "rounded-[var(--st-radius-md)]",
  lg: "rounded-[var(--st-radius-lg)]",
  full: "rounded-full",
};

// Base skeleton
export const Skeleton = ({
  width,
  height,
  rounded = "md",
  className,
  style,
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={["animate-pulse bg-gray-100", roundedMap[rounded], className]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height, ...style }}
      {...props}
    />
  );
};

Skeleton.displayName = "Skeleton";

// Skeleton Text — multiple lines
export interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
}

export const SkeletonText = ({
  lines = 3,
  lastLineWidth = "60%",
}: SkeletonTextProps) => {
  return (
    <div className="flex flex-col gap-[var(--st-spacing-2)]">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = "SkeletonText";

// Skeleton Avatar
export interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg";
}

const avatarSizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
};

export const SkeletonAvatar = ({ size = "md" }: SkeletonAvatarProps) => {
  const px = avatarSizeMap[size];
  return <Skeleton width={px} height={px} rounded="full" />;
};

SkeletonAvatar.displayName = "SkeletonAvatar";

// Skeleton Card
export const SkeletonCard = () => {
  return (
    <div className="rounded-[var(--st-radius-lg)] border border-[var(--st-color-text-muted)] border-opacity-20 p-[var(--st-spacing-6)]">
      <div className="flex items-start gap-[var(--st-spacing-3)] mb-[var(--st-spacing-4)]">
        <SkeletonAvatar size="md" />
        <div className="flex-1 flex flex-col gap-[var(--st-spacing-2)]">
          <Skeleton height={16} width="50%" />
          <Skeleton height={14} width="30%" />
        </div>
      </div>
      <SkeletonText lines={3} lastLineWidth="70%" />
    </div>
  );
};

SkeletonCard.displayName = "SkeletonCard";

// Skeleton Table Row
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable = ({
  rows = 5,
  columns = 4,
}: SkeletonTableProps) => {
  return (
    <div className="rounded-[var(--st-radius-md)] border border-[var(--st-color-text-muted)] border-opacity-20 overflow-hidden">
      {/* Header */}
      <div className="flex gap-[var(--st-spacing-4)] bg-[var(--st-color-brand-subtle)] px-[var(--st-spacing-4)] py-[var(--st-spacing-3)]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={12} width={`${100 / columns}%`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-[var(--st-spacing-4)] px-[var(--st-spacing-4)] py-[var(--st-spacing-3)] border-t border-[var(--st-color-text-muted)] border-opacity-10"
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton
              key={j}
              height={14}
              width={j === columns - 1 ? "40%" : `${100 / columns}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

SkeletonTable.displayName = "SkeletonTable";
