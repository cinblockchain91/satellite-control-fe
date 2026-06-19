import type { Satellite } from "@/widgets/mission-control-scene";
import { detectAnomalies } from "./anomaly-detection";
import type { AnomalyType, AnomalySeverity } from "./anomaly-detection";

// ─── Types ────────────────────────────────────────────────────────────────────

/** One alert event surfaced in the timeline panel. */
export interface AlertEvent {
  /** Stable id for React keys — `${satelliteId}-${type}`. */
  id: string;
  /** Non-branded string so the timeline has no dependency on SatelliteId. */
  satelliteId: string;
  satelliteName: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  detectedAt: Date;
}

// ─── Event derivation ─────────────────────────────────────────────────────────

/**
 * Minutes between successive satellites in the mock history.
 * Each satellite's anomalies are spaced MOCK_MINUTES_PER_SATELLITE apart so
 * the timeline shows a plausible staggered detection sequence.
 *
 * Backend swap point: replace this call with events from a /api/anomalies
 * endpoint; AlertTimeline consumes AlertEvent[] regardless of origin.
 */
const MOCK_MINUTES_PER_SATELLITE = 3;

/**
 * Derives alert events from a fleet snapshot.
 *
 * @param satellites  Current fleet state (typically MOCK_SATELLITES).
 * @param now         Current timestamp in ms — injected so the function stays
 *                    pure and tests can supply a fixed timestamp.
 *
 * Sort order: critical before warning; most-recent first within the same
 * severity.
 */
export function buildAlertEvents(satellites: Satellite[], now: number): AlertEvent[] {
  const events: AlertEvent[] = [];

  satellites.forEach((sat, satIndex) => {
    const anomalies = detectAnomalies(sat.telemetry, sat.status);
    anomalies.forEach((anomaly, anomalyIndex) => {
      const minutesAgo = satIndex * MOCK_MINUTES_PER_SATELLITE + anomalyIndex;
      events.push({
        id: `${sat.id}-${anomaly.type}`,
        satelliteId: sat.id,
        satelliteName: sat.name,
        type: anomaly.type,
        severity: anomaly.severity,
        detectedAt: new Date(now - minutesAgo * 60_000),
      });
    });
  });

  return events.sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === "critical" ? -1 : 1;
    }
    return b.detectedAt.getTime() - a.detectedAt.getTime();
  });
}
