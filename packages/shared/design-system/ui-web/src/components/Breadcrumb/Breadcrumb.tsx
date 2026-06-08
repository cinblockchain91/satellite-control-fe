import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

const DefaultSeparator = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-[var(--st-color-text-muted)]"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const Breadcrumb = ({ items, separator, maxItems }: BreadcrumbProps) => {
  const Sep = separator ?? <DefaultSeparator />;

  // Collapse khi quá nhiều items
  const visible: (BreadcrumbItem | "...")[] = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) return items;
    return [items[0], "...", ...items.slice(items.length - (maxItems - 2))];
  }, [items, maxItems]);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-[var(--st-spacing-1)]">
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;

          if (item === "...") {
            return (
              <React.Fragment key="ellipsis">
                <li className="flex items-center">
                  <span className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)] px-[var(--st-spacing-1)]">
                    …
                  </span>
                </li>
                <li className="flex items-center" aria-hidden>
                  {Sep}
                </li>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={i}>
              <li className="flex items-center">
                {isLast ? (
                  <span
                    className={[
                      "inline-flex items-center gap-[var(--st-spacing-1)]",
                      "text-[var(--st-font-size-sm)] font-medium",
                      "text-[var(--st-color-text-default)]",
                    ].join(" ")}
                    aria-current="page"
                  >
                    {item.icon && (
                      <item.icon
                        width={14}
                        height={14}
                        className="flex-shrink-0"
                      />
                    )}
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className={[
                      "inline-flex items-center gap-[var(--st-spacing-1)]",
                      "text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]",
                      "hover:text-[var(--st-color-text-default)] transition-colors",
                      "rounded-[var(--st-radius-sm)] outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[var(--st-color-brand-primary)]",
                    ].join(" ")}
                  >
                    {item.icon && (
                      <item.icon
                        width={14}
                        height={14}
                        className="flex-shrink-0"
                      />
                    )}
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={[
                      "inline-flex items-center gap-[var(--st-spacing-1)]",
                      "text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]",
                    ].join(" ")}
                  >
                    {item.icon && (
                      <item.icon
                        width={14}
                        height={14}
                        className="flex-shrink-0"
                      />
                    )}
                    {item.label}
                  </span>
                )}
              </li>

              {!isLast && (
                <li className="flex items-center" aria-hidden>
                  {Sep}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = "Breadcrumb";
