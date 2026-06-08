"use client";

import * as React from "react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblings?: number;
}

const btnClass = (active?: boolean, disabled?: boolean) =>
  [
    "h-8 w-8 rounded-[var(--st-radius-sm)] border text-[var(--st-font-size-sm)] transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
    active
      ? "border-[var(--st-color-brand-primary)] bg-[var(--st-color-brand-primary)] text-white"
      : "border-[var(--st-color-text-muted)] border-opacity-30 hover:bg-[var(--st-color-brand-subtle)] text-[var(--st-color-text-default)]",
    disabled && "opacity-40 cursor-not-allowed pointer-events-none",
  ]
    .filter(Boolean)
    .join(" ");

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblings = 1,
}: PaginationProps) => {
  const pages = React.useMemo(() => {
    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const left = Math.max(2, page - siblings);
    const right = Math.min(totalPages - 1, page + siblings);

    const hasLeftDots = left > 2;
    const hasRightDots = right < totalPages - 1;

    const middle = range(left, right);

    return [
      1,
      ...(hasLeftDots ? ["..."] : []),
      ...middle,
      ...(hasRightDots ? ["..."] : []),
      ...(totalPages > 1 ? [totalPages] : []),
    ] as (number | "...")[];
  }, [page, totalPages, siblings]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-[var(--st-spacing-1)]">
      {/* First */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className={btnClass(false, page === 1)}
          aria-label="First page"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mx-auto"
          >
            <path d="m11 17-5-5 5-5" />
            <path d="m18 17-5-5 5-5" />
          </svg>
        </button>
      )}

      {/* Prev */}
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={btnClass(false, page === 1)}
        aria-label="Previous page"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="flex h-8 w-8 items-center justify-center text-[var(--st-color-text-muted)] text-[var(--st-font-size-sm)]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={btnClass(page === p)}
            aria-label={`Page ${p}`}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={btnClass(false, page === totalPages)}
        aria-label="Next page"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Last */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className={btnClass(false, page === totalPages)}
          aria-label="Last page"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mx-auto"
          >
            <path d="m13 17 5-5-5-5" />
            <path d="m6 17 5-5-5-5" />
          </svg>
        </button>
      )}
    </div>
  );
};

Pagination.displayName = "Pagination";
