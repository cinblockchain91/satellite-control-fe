"use client";

import * as React from "react";
import { Table, type TableColumn } from "../Table/Table";

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
}

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  pageSize = 10,
  searchable,
  searchPlaceholder = "Search...",
  searchKeys = [],
}: DataTableProps<T>) => {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string>("");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [hiddenCols, setHiddenCols] = React.useState<Set<string>>(new Set());

  // Search filter
  const filtered = React.useMemo(() => {
    if (!search || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((k) =>
        String(row[k] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, search, searchKeys]);

  // Sort
  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof T];
      const bv = b[sortKey as keyof T];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleColumn = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const visibleColumns = columns.filter((c) => !hiddenCols.has(String(c.key)));

  return (
    <div className="flex flex-col gap-[var(--st-spacing-3)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-[var(--st-spacing-3)]">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1 max-w-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-[var(--st-spacing-3)] top-1/2 -translate-y-1/2 text-[var(--st-color-text-muted)]"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={search}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className={[
                "h-9 w-full rounded-[var(--st-radius-md)] border pl-9 pr-[var(--st-spacing-3)]",
                "text-[var(--st-font-size-sm)] outline-none transition-colors",
                "border-[var(--st-color-text-muted)] border-opacity-30",
                "focus:border-[var(--st-color-brand-primary)] focus:ring-2 focus:ring-[var(--st-color-brand-primary)] focus:ring-offset-1",
                "placeholder:text-[var(--st-color-text-muted)]",
              ].join(" ")}
            />
          </div>
        )}

        {/* Column visibility */}
        <div className="relative ml-auto">
          <details className="group">
            <summary
              className={[
                "flex h-9 cursor-pointer list-none items-center gap-[var(--st-spacing-2)]",
                "rounded-[var(--st-radius-md)] border px-[var(--st-spacing-3)]",
                "text-[var(--st-font-size-sm)] text-[var(--st-color-text-default)]",
                "border-[var(--st-color-text-muted)] border-opacity-30",
                "hover:bg-[var(--st-color-brand-subtle)] transition-colors outline-none",
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
                <path d="M3 9h18M3 15h18" />
              </svg>
              Columns
            </summary>
            <div
              className={[
                "absolute right-0 top-full z-20 mt-1",
                "min-w-[160px] rounded-[var(--st-radius-md)] border bg-white p-[var(--st-spacing-2)] shadow-md",
                "border-[var(--st-color-text-muted)] border-opacity-20",
              ].join(" ")}
            >
              {columns.map((col) => (
                <label
                  key={String(col.key)}
                  className="flex cursor-pointer items-center gap-[var(--st-spacing-2)] rounded-[var(--st-radius-sm)] px-[var(--st-spacing-2)] py-[var(--st-spacing-1)] hover:bg-[var(--st-color-brand-subtle)]"
                >
                  <input
                    type="checkbox"
                    checked={!hiddenCols.has(String(col.key))}
                    onChange={() => toggleColumn(String(col.key))}
                    className="accent-[var(--st-color-brand-primary)]"
                  />
                  <span className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-default)]">
                    {col.header}
                  </span>
                </label>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={visibleColumns}
        data={paginated}
        keyField={keyField}
        sortKey={sortKey}
        sortDirection={sortDir}
        onSort={handleSort}
      />

      {/* Footer */}
      <div className="flex items-center justify-between text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
        <span>
          {filtered.length === 0
            ? "No results"
            : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`}
        </span>

        {/* Pagination */}
        <div className="flex items-center gap-[var(--st-spacing-1)]">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="h-8 w-8 rounded-[var(--st-radius-sm)] border border-[var(--st-color-text-muted)] border-opacity-30 disabled:opacity-40 hover:bg-[var(--st-color-brand-subtle)] transition-colors"
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
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 rounded-[var(--st-radius-sm)] border border-[var(--st-color-text-muted)] border-opacity-30 disabled:opacity-40 hover:bg-[var(--st-color-brand-subtle)] transition-colors"
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

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={[
                    "h-8 w-8 rounded-[var(--st-radius-sm)] border text-[var(--st-font-size-sm)] transition-colors",
                    page === p
                      ? "border-[var(--st-color-brand-primary)] bg-[var(--st-color-brand-primary)] text-white"
                      : "border-[var(--st-color-text-muted)] border-opacity-30 hover:bg-[var(--st-color-brand-subtle)]",
                  ].join(" ")}
                >
                  {p}
                </button>
              ),
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8 rounded-[var(--st-radius-sm)] border border-[var(--st-color-text-muted)] border-opacity-30 disabled:opacity-40 hover:bg-[var(--st-color-brand-subtle)] transition-colors"
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
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="h-8 w-8 rounded-[var(--st-radius-sm)] border border-[var(--st-color-text-muted)] border-opacity-30 disabled:opacity-40 hover:bg-[var(--st-color-brand-subtle)] transition-colors"
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
        </div>
      </div>
    </div>
  );
};

DataTable.displayName = "DataTable";
