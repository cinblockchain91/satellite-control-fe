"use client";

import * as React from "react";
import { Spinner } from "../Spinner/Spinner";

export interface LoadingOverlayProps {
  loading?: boolean;
  label?: string;
  fullPage?: boolean;
  blur?: boolean;
  children?: React.ReactNode;
}

export const LoadingOverlay = ({
  loading = true,
  label,
  fullPage = false,
  blur = false,
  children,
}: LoadingOverlayProps) => {
  if (fullPage) {
    if (!loading) return null;

    return (
      <div
        className={[
          "fixed inset-0 z-50 flex items-center justify-center",
          "bg-white/80",
          blur && "backdrop-blur-sm",
        ]
          .filter(Boolean)
          .join(" ")}
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-[var(--st-spacing-4)]">
          <Spinner size="lg" />
          {label && (
            <p className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-muted)]">
              {label}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Scoped overlay — wrap children
  return (
    <div className="relative">
      {children}
      {loading && (
        <div
          className={[
            "absolute inset-0 z-10 flex items-center justify-center",
            "rounded-[var(--st-radius-md)] bg-white/80",
            blur && "backdrop-blur-sm",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-[var(--st-spacing-3)]">
            <Spinner size="md" />
            {label && (
              <p className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-muted)]">
                {label}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

LoadingOverlay.displayName = "LoadingOverlay";
