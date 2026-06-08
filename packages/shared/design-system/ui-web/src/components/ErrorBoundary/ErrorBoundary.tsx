"use client";

import * as React from "react";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  showDetails?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <DefaultErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.displayName = "ErrorBoundary";

// Default fallback UI
export interface DefaultErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  showDetails?: boolean;
}

export const DefaultErrorFallback = ({
  error,
  onRetry,
  showDetails = false,
}: DefaultErrorFallbackProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        "rounded-[var(--st-radius-lg)] border border-red-200 bg-red-50",
        "px-[var(--st-spacing-6)] py-[var(--st-spacing-10)]",
        "gap-[var(--st-spacing-4)]",
      ].join(" ")}
      role="alert"
    >
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--st-color-feedback-danger)]"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-[var(--st-spacing-1)]">
        <h3 className="text-[var(--st-font-size-lg)] font-medium text-red-900">
          Something went wrong
        </h3>
        <p className="text-[var(--st-font-size-sm)] text-red-600 max-w-sm">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
      </div>

      {/* Error details */}
      {showDetails && error && (
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-[var(--st-font-size-xs)] text-red-500 hover:text-red-700 underline outline-none"
          >
            {expanded ? "Hide" : "Show"} error details
          </button>
          {expanded && (
            <pre
              className={[
                "mt-[var(--st-spacing-2)] text-left overflow-auto",
                "rounded-[var(--st-radius-md)] bg-red-100 p-[var(--st-spacing-3)]",
                "text-[var(--st-font-size-xs)] text-red-800 max-h-32",
              ].join(" ")}
            >
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          )}
        </div>
      )}

      {/* Retry */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={[
            "inline-flex items-center gap-[var(--st-spacing-2)]",
            "rounded-[var(--st-radius-md)] px-[var(--st-spacing-4)] h-10",
            "text-[var(--st-font-size-sm)] font-medium text-white",
            "bg-[var(--st-color-feedback-danger)] hover:opacity-90 transition-opacity",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-color-feedback-danger)] focus-visible:ring-offset-2",
          ].join(" ")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Try again
        </button>
      )}
    </div>
  );
};

DefaultErrorFallback.displayName = "DefaultErrorFallback";
