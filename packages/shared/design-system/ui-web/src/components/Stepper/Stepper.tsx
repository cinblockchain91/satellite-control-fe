"use client";

import * as React from "react";

export type StepStatus = "complete" | "current" | "upcoming" | "error";

export interface Step {
  value: string;
  label: string;
  description?: string;
  status?: StepStatus;
}

export interface StepperProps {
  steps: Step[];
  currentStep?: number;
  orientation?: "horizontal" | "vertical";
  onStepClick?: (index: number) => void;
  clickable?: boolean;
}

const statusStyles: Record<
  StepStatus,
  {
    circle: string;
    label: string;
    connector: string;
  }
> = {
  complete: {
    circle:
      "bg-[var(--st-color-brand-primary)] border-[var(--st-color-brand-primary)] text-white",
    label: "text-[var(--st-color-text-default)]",
    connector: "bg-[var(--st-color-brand-primary)]",
  },
  current: {
    circle:
      "bg-white border-[var(--st-color-brand-primary)] text-[var(--st-color-brand-primary)]",
    label: "text-[var(--st-color-brand-primary)] font-medium",
    connector: "bg-[var(--st-color-text-muted)] bg-opacity-20",
  },
  upcoming: {
    circle:
      "bg-white border-[var(--st-color-text-muted)] border-opacity-30 text-[var(--st-color-text-muted)]",
    label: "text-[var(--st-color-text-muted)]",
    connector: "bg-[var(--st-color-text-muted)] bg-opacity-20",
  },
  error: {
    circle:
      "bg-[var(--st-color-feedback-danger)] border-[var(--st-color-feedback-danger)] text-white",
    label: "text-[var(--st-color-feedback-danger)]",
    connector: "bg-[var(--st-color-text-muted)] bg-opacity-20",
  },
};

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const getStatus = (
  index: number,
  currentStep: number,
  stepStatus?: StepStatus,
): StepStatus => {
  if (stepStatus) return stepStatus;
  if (index < currentStep) return "complete";
  if (index === currentStep) return "current";
  return "upcoming";
};

export const Stepper = ({
  steps,
  currentStep = 0,
  orientation = "horizontal",
  onStepClick,
  clickable,
}: StepperProps) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={[
        "flex",
        isHorizontal ? "flex-row items-start" : "flex-col",
      ].join(" ")}
    >
      {steps.map((step, i) => {
        const status = getStatus(i, currentStep, step.status);
        const styles = statusStyles[status];
        const isLast = i === steps.length - 1;
        const isClickable =
          clickable && (status === "complete" || status === "current");

        return (
          <React.Fragment key={step.value}>
            <div
              className={[
                "flex",
                isHorizontal
                  ? "flex-col items-center"
                  : "flex-row items-start gap-[var(--st-spacing-3)]",
                isHorizontal && !isLast ? "flex-1" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Step circle + connector (horizontal) */}
              <div
                className={[
                  isHorizontal
                    ? "flex w-full items-center"
                    : "flex flex-col items-center",
                ].join(" ")}
              >
                {/* Circle */}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(i)}
                  className={[
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center",
                    "rounded-full border-2 text-[var(--st-font-size-sm)] font-medium",
                    "transition-colors outline-none",
                    styles.circle,
                    isClickable
                      ? "cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)] focus-visible:ring-offset-2"
                      : "cursor-default",
                  ].join(" ")}
                >
                  {status === "complete" ? (
                    <CheckIcon />
                  ) : status === "error" ? (
                    <ErrorIcon />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </button>

                {/* Connector */}
                {!isLast && (
                  <div
                    className={[
                      isHorizontal
                        ? "h-0.5 flex-1"
                        : "w-0.5 flex-1 min-h-[var(--st-spacing-6)] ml-[15px]",
                      styles.connector,
                    ].join(" ")}
                  />
                )}
              </div>

              {/* Label */}
              <div
                className={[
                  isHorizontal
                    ? "mt-[var(--st-spacing-2)] flex flex-col items-center text-center"
                    : "flex flex-col pb-[var(--st-spacing-6)]",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-[var(--st-font-size-sm)]",
                    styles.label,
                  ].join(" ")}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)] mt-0.5">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

Stepper.displayName = "Stepper";
