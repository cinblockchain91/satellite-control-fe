import type { Satellite } from "@satellite-control/entity-satellite";

export interface StatusCounts {
  online: number;
  warning: number;
  degraded: number;
  offline: number;
}

export function countByStatus(satellites: readonly Satellite[]): StatusCounts {
  const counts: StatusCounts = { online: 0, warning: 0, degraded: 0, offline: 0 };
  for (const sat of satellites) {
    counts[sat.status]++;
  }
  return counts;
}
