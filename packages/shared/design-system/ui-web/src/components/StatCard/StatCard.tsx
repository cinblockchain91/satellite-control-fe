import * as React from "react";

export type StatTrend = "up" | "down" | "neutral";

export interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: StatTrend;
  trendValue?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const trendColorMap: Record<StatTrend, string> = {
  up: "text-green-600",
  down: "text-[var(--st-color-feedback-danger)]",
  neutral: "text-[var(--st-color-text-muted)]",
};

const TrendUp = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const TrendDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const TrendNeutral = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M5 12h14" />
  </svg>
);

const TrendIcon = ({ trend }: { trend: StatTrend }) => {
  if (trend === "up") return <TrendUp />;
  if (trend === "down") return <TrendDown />;
  return <TrendNeutral />;
};

export const StatCard = ({
  label,
  value,
  description,
  trend,
  trendValue,
  icon: IconComponent,
}: StatCardProps) => {
  return (
    <div
      className={[
        "flex flex-col gap-[var(--st-spacing-3)]",
        "rounded-[var(--st-radius-lg)] border bg-white p-[var(--st-spacing-5)]",
        "border-[var(--st-color-text-muted)] border-opacity-20",
      ].join(" ")}
    >
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-muted)]">
          {label}
        </span>
        {IconComponent && (
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--st-radius-md)] bg-[var(--st-color-brand-subtle)]">
            <IconComponent
              width={18}
              height={18}
              className="text-[var(--st-color-brand-primary)]"
            />
          </div>
        )}
      </div>

      {/* Value */}
      <span className="text-[var(--st-font-size-3xl)] font-medium text-[var(--st-color-text-default)] leading-none">
        {value}
      </span>

      {/* Bottom row: trend + description */}
      {(trend || description) && (
        <div className="flex items-center gap-[var(--st-spacing-1)]">
          {trend && (
            <span
              className={[
                "flex items-center gap-0.5 font-medium text-[var(--st-font-size-sm)]",
                trendColorMap[trend],
              ].join(" ")}
            >
              <TrendIcon trend={trend} />
              {trendValue}
            </span>
          )}
          {description && (
            <span className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

StatCard.displayName = "StatCard";
