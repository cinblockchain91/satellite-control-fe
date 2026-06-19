import type { SatelliteTelemetry, SatelliteStatus } from "@satellite-control/entity-satellite";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Named anomaly scenarios the Anomaly Arena can visualise.
 * camelCase values map 1-to-1 to i18n keys: `anomalyArena.type.<value>`.
 *
 * Backend swap point: when the backend sends named anomaly types, replace
 * calls to `detectAnomalies()` with the backend-provided array at the API
 * boundary — no changes required in 3D components or panels.
 */
export type AnomalyType =
  | "signalDrop"
  | "overheating"
  | "unstableOrbit"
  | "communicationLoss";

export type AnomalySeverity = "warning" | "critical";

/** One detected anomaly for a single satellite at a point in time. */
export interface AnomalyDetection {
  type: AnomalyType;
  severity: AnomalySeverity;
  /** Which telemetry metric triggered the anomaly. */
  metric: string;
  /** Current value of that metric. */
  value: number;
  /** The threshold that was crossed. */
  threshold: number;
}

// ─── Thresholds ───────────────────────────────────────────────────────────────

/**
 * All anomaly detection thresholds in one place.
 * Do not inline these values in 3D components or UI panels.
 *
 * Note: signalDrop and overheating values intentionally match
 * METRIC_THRESHOLDS in telemetry-stream.ts. They are kept separate
 * because stream-state classification and anomaly-type detection are
 * different concerns that may diverge as the product evolves.
 */
export const ANOMALY_THRESHOLDS = {
  communicationLoss: {
    /** signalStrength ≤ this value is treated as "no signal" when offline. */
    maxSignalStrength: 5,
  },
  signalDrop: {
    /** signalStrength below this → warning. */
    warning: 60,
    /** signalStrength below this → critical. */
    critical: 30,
  },
  overheating: {
    /** temperature (°C) above this → warning. */
    warning: 45,
    /** temperature (°C) above this → critical. */
    critical: 60,
  },
  unstableOrbit: {
    /** anomalyLevel above this → warning (proxy for orbit instability). */
    warning: 20,
    /** anomalyLevel above this → critical. */
    critical: 50,
    /**
     * unstableOrbit only fires when signal and temperature are nominal —
     * otherwise the anomalyLevel rise is attributable to those causes.
     */
    minSignalForProxy: 60,
    maxTempForProxy: 45,
  },
} as const;

// ─── Visual rules ─────────────────────────────────────────────────────────────

/**
 * Type-identity color for each anomaly.  Used in 3D highlights, legend chips,
 * and orbit-path tinting.  Severity colours (warning/critical) are separate —
 * see ANOMALY_SEVERITY_COLORS.
 */
export const ANOMALY_VISUAL_RULES = {
  signalDrop: { color: "#eab308" },         // yellow-500
  overheating: { color: "#f97316" },        // orange-500
  unstableOrbit: { color: "#a855f7" },      // purple-500
  communicationLoss: { color: "#ef4444" },  // red-500 — always critical
} as const satisfies Record<AnomalyType, { color: string }>;

/**
 * Severity colours mirror the existing stream-state palette so badges look
 * consistent with the Telemetry Tunnel and fleet-overview panels.
 */
export const ANOMALY_SEVERITY_COLORS = {
  warning: "#eab308",   // yellow-500
  critical: "#ef4444",  // red-500
} as const satisfies Record<AnomalySeverity, string>;

// ─── Detection ────────────────────────────────────────────────────────────────

/**
 * Derives the set of active anomalies for a satellite from its current
 * telemetry and connection status.  Pure function — safe to call inside
 * `useMemo` or a throttled `useFrame`.
 *
 * Priority order (highest first):
 *   1. communicationLoss — satellite is unreachable; other readings untrustworthy
 *   2. signalDrop        — link is degraded but satellite is still reachable
 *   3. overheating       — thermal anomaly, independent of link quality
 *   4. unstableOrbit     — anomalyLevel proxy, only when signal/temp are nominal
 *
 * communicationLoss returns early; the rest accumulate (multi-anomaly is valid).
 */
export function detectAnomalies(
  telemetry: SatelliteTelemetry,
  status: SatelliteStatus,
): AnomalyDetection[] {
  // 1. Communication loss — offline + no signal.
  // Per ADR-003: latency = 0 is the canonical marker for offline; we use
  // status + signalStrength to avoid relying on the latency sentinel.
  if (
    status === "offline" &&
    telemetry.signalStrength <= ANOMALY_THRESHOLDS.communicationLoss.maxSignalStrength
  ) {
    return [
      {
        type: "communicationLoss",
        severity: "critical",
        metric: "signalStrength",
        value: telemetry.signalStrength,
        threshold: ANOMALY_THRESHOLDS.communicationLoss.maxSignalStrength,
      },
    ];
  }

  const anomalies: AnomalyDetection[] = [];

  // 2. Signal drop — link is weakening but satellite still reachable.
  if (telemetry.signalStrength < ANOMALY_THRESHOLDS.signalDrop.critical) {
    anomalies.push({
      type: "signalDrop",
      severity: "critical",
      metric: "signalStrength",
      value: telemetry.signalStrength,
      threshold: ANOMALY_THRESHOLDS.signalDrop.critical,
    });
  } else if (telemetry.signalStrength < ANOMALY_THRESHOLDS.signalDrop.warning) {
    anomalies.push({
      type: "signalDrop",
      severity: "warning",
      metric: "signalStrength",
      value: telemetry.signalStrength,
      threshold: ANOMALY_THRESHOLDS.signalDrop.warning,
    });
  }

  // 3. Overheating — thermal management failure.
  if (telemetry.temperature > ANOMALY_THRESHOLDS.overheating.critical) {
    anomalies.push({
      type: "overheating",
      severity: "critical",
      metric: "temperature",
      value: telemetry.temperature,
      threshold: ANOMALY_THRESHOLDS.overheating.critical,
    });
  } else if (telemetry.temperature > ANOMALY_THRESHOLDS.overheating.warning) {
    anomalies.push({
      type: "overheating",
      severity: "warning",
      metric: "temperature",
      value: telemetry.temperature,
      threshold: ANOMALY_THRESHOLDS.overheating.warning,
    });
  }

  // 4. Unstable orbit — anomalyLevel used as proxy.
  // Only fires when signal and temperature are nominal so that a high
  // anomalyLevel caused by those issues is not misclassified as an orbit fault.
  const signalNominal =
    telemetry.signalStrength >= ANOMALY_THRESHOLDS.unstableOrbit.minSignalForProxy;
  const tempNominal =
    telemetry.temperature <= ANOMALY_THRESHOLDS.unstableOrbit.maxTempForProxy;

  if (signalNominal && tempNominal) {
    if (telemetry.anomalyLevel > ANOMALY_THRESHOLDS.unstableOrbit.critical) {
      anomalies.push({
        type: "unstableOrbit",
        severity: "critical",
        metric: "anomalyLevel",
        value: telemetry.anomalyLevel,
        threshold: ANOMALY_THRESHOLDS.unstableOrbit.critical,
      });
    } else if (telemetry.anomalyLevel > ANOMALY_THRESHOLDS.unstableOrbit.warning) {
      anomalies.push({
        type: "unstableOrbit",
        severity: "warning",
        metric: "anomalyLevel",
        value: telemetry.anomalyLevel,
        threshold: ANOMALY_THRESHOLDS.unstableOrbit.warning,
      });
    }
  }

  return anomalies;
}
