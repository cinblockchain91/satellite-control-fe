import * as React from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  selectedKeys?: (string | number)[];
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
}

export const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  sortKey,
  sortDirection = "asc",
  onSort,
  onRowClick,
  selectedKeys = [],
  loading,
  emptyMessage = "No data available",
  stickyHeader,
}: TableProps<T>) => {
  return (
    <div className="w-full overflow-auto rounded-[var(--st-radius-md)] border border-[var(--st-color-text-muted)] border-opacity-20">
      <table className="w-full border-collapse text-[var(--st-font-size-sm)]">
        {/* Head */}
        <thead
          className={[
            "bg-[var(--st-color-brand-subtle)]",
            stickyHeader && "sticky top-0 z-10",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort?.(String(col.key))}
                className={[
                  "px-[var(--st-spacing-4)] py-[var(--st-spacing-3)]",
                  "text-[var(--st-font-size-xs)] font-medium uppercase tracking-wide",
                  "text-[var(--st-color-text-muted)] border-b border-[var(--st-color-text-muted)] border-opacity-20",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  !col.align && "text-left",
                  col.sortable &&
                    "cursor-pointer select-none hover:text-[var(--st-color-text-default)] transition-colors",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div
                  className={[
                    "inline-flex items-center gap-[var(--st-spacing-1)]",
                    col.align === "center" && "justify-center",
                    col.align === "right" && "justify-end",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {col.header}
                  {col.sortable && (
                    <span className="flex flex-col">
                      {sortKey === String(col.key) ? (
                        sortDirection === "asc" ? (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        )
                      ) : (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.4"
                        >
                          <path d="m7 15 5 5 5-5" />
                          <path d="m7 9 5-5 5 5" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-[var(--st-spacing-4)] py-[var(--st-spacing-3)] border-b border-[var(--st-color-text-muted)] border-opacity-10"
                  >
                    <div className="h-4 rounded bg-gray-100 animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-[var(--st-spacing-4)] py-[var(--st-spacing-10)] text-center text-[var(--st-color-text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const key = String(row[keyField]);
              const isSelected = selectedKeys.includes(key);

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={[
                    "border-b border-[var(--st-color-text-muted)] border-opacity-10",
                    "transition-colors last:border-0",
                    onRowClick &&
                      "cursor-pointer hover:bg-[var(--st-color-brand-subtle)]",
                    isSelected && "bg-[var(--st-color-brand-subtle)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={[
                        "px-[var(--st-spacing-4)] py-[var(--st-spacing-3)]",
                        "text-[var(--st-color-text-default)]",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "-")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = "Table";
