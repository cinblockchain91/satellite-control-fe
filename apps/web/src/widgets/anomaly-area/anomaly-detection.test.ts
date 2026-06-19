import { describe, it, expect } from "vitest";
import {
  detectAnomalies,
  ANOMALY_THRESHOLDS,
  ANOMALY_VISUAL_RULES,
  ANOMALY_SEVERITY_COLORS,
} from "./anomaly-detection";
import type { SatelliteTelemetry } from "@satellite-control/entity-satellite";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const nominalTelemetry: SatelliteTelemetry = {
  signalStrength: 92,
  battery: 88,
  temperature: 22,
  altitude: 550,
  healthScore: 94,
  latency: 45,
  anomalyLevel: 5,
};

// ─── detectAnomalies ──────────────────────────────────────────────────────────

describe("detectAnomalies", () => {
  describe("nominal — no anomalies", () => {
    it("returns empty array when all metrics are nominal", () => {
      expect(detectAnomalies(nominalTelemetry, "online")).toHaveLength(0);
    });
  });

  // ── communicationLoss ───────────────────────────────────────────────────────

  describe("communicationLoss", () => {
    it("detects when status is offline and signal is at or below maxSignalStrength", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: 0, latency: 0 },
        "offline",
      );
      expect(result).toHaveLength(1);
      expect(result[0]?.type).toBe("communicationLoss");
      expect(result[0]?.severity).toBe("critical");
    });

    it("detects at exact maxSignalStrength boundary (offline)", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: ANOMALY_THRESHOLDS.communicationLoss.maxSignalStrength },
        "offline",
      );
      expect(result[0]?.type).toBe("communicationLoss");
    });

    it("does not detect communicationLoss when signal is above maxSignalStrength even if offline", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: ANOMALY_THRESHOLDS.communicationLoss.maxSignalStrength + 1 },
        "offline",
      );
      expect(result.find((a) => a.type === "communicationLoss")).toBeUndefined();
    });

    it("does not detect communicationLoss when signal is 0 but status is not offline", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: 0 },
        "degraded",
      );
      expect(result.find((a) => a.type === "communicationLoss")).toBeUndefined();
    });

    it("returns only communicationLoss and stops — other anomalies are not evaluated", () => {
      // SAT-Gamma scenario: offline + signal 0 + high temperature + high anomalyLevel
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: 0, latency: 0, temperature: 80, anomalyLevel: 82 },
        "offline",
      );
      expect(result).toHaveLength(1);
      expect(result[0]?.type).toBe("communicationLoss");
    });
  });

  // ── signalDrop ──────────────────────────────────────────────────────────────

  describe("signalDrop", () => {
    it("detects warning when signal is between critical and warning thresholds", () => {
      const midWarning = Math.floor(
        (ANOMALY_THRESHOLDS.signalDrop.critical + ANOMALY_THRESHOLDS.signalDrop.warning) / 2,
      );
      const result = detectAnomalies({ ...nominalTelemetry, signalStrength: midWarning }, "warning");
      const anomaly = result.find((a) => a.type === "signalDrop");
      expect(anomaly?.severity).toBe("warning");
    });

    it("detects critical when signal is below critical threshold", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: ANOMALY_THRESHOLDS.signalDrop.critical - 1 },
        "degraded",
      );
      const anomaly = result.find((a) => a.type === "signalDrop");
      expect(anomaly?.severity).toBe("critical");
    });

    it("boundary: signal exactly at warning threshold is nominal (not warned)", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: ANOMALY_THRESHOLDS.signalDrop.warning },
        "online",
      );
      expect(result.find((a) => a.type === "signalDrop")).toBeUndefined();
    });

    it("boundary: signal exactly at critical threshold is warning (not critical)", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: ANOMALY_THRESHOLDS.signalDrop.critical },
        "degraded",
      );
      const anomaly = result.find((a) => a.type === "signalDrop");
      expect(anomaly?.severity).toBe("warning");
    });

    it("records the correct metric, value, and threshold", () => {
      const signal = 25;
      const result = detectAnomalies({ ...nominalTelemetry, signalStrength: signal }, "degraded");
      const anomaly = result.find((a) => a.type === "signalDrop");
      expect(anomaly?.metric).toBe("signalStrength");
      expect(anomaly?.value).toBe(signal);
      expect(anomaly?.threshold).toBe(ANOMALY_THRESHOLDS.signalDrop.critical);
    });
  });

  // ── overheating ─────────────────────────────────────────────────────────────

  describe("overheating", () => {
    it("detects warning when temperature is between warning and critical thresholds", () => {
      const midWarning = Math.ceil(
        (ANOMALY_THRESHOLDS.overheating.warning + ANOMALY_THRESHOLDS.overheating.critical) / 2,
      );
      const result = detectAnomalies({ ...nominalTelemetry, temperature: midWarning }, "online");
      const anomaly = result.find((a) => a.type === "overheating");
      expect(anomaly?.severity).toBe("warning");
    });

    it("detects critical when temperature exceeds critical threshold", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, temperature: ANOMALY_THRESHOLDS.overheating.critical + 1 },
        "online",
      );
      const anomaly = result.find((a) => a.type === "overheating");
      expect(anomaly?.severity).toBe("critical");
    });

    it("boundary: temperature exactly at warning threshold is nominal", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, temperature: ANOMALY_THRESHOLDS.overheating.warning },
        "online",
      );
      expect(result.find((a) => a.type === "overheating")).toBeUndefined();
    });

    it("boundary: temperature exactly at critical threshold is warning", () => {
      const result = detectAnomalies(
        { ...nominalTelemetry, temperature: ANOMALY_THRESHOLDS.overheating.critical },
        "online",
      );
      const anomaly = result.find((a) => a.type === "overheating");
      expect(anomaly?.severity).toBe("warning");
    });

    it("records the correct metric, value, and threshold", () => {
      const temp = 65;
      const result = detectAnomalies({ ...nominalTelemetry, temperature: temp }, "online");
      const anomaly = result.find((a) => a.type === "overheating");
      expect(anomaly?.metric).toBe("temperature");
      expect(anomaly?.value).toBe(temp);
      expect(anomaly?.threshold).toBe(ANOMALY_THRESHOLDS.overheating.critical);
    });
  });

  // ── unstableOrbit ───────────────────────────────────────────────────────────

  describe("unstableOrbit", () => {
    // Telemetry with nominal signal/temp so anomalyLevel is the only trigger
    const orbitTelemetry: SatelliteTelemetry = {
      ...nominalTelemetry,
      signalStrength: ANOMALY_THRESHOLDS.unstableOrbit.minSignalForProxy,
      temperature: ANOMALY_THRESHOLDS.unstableOrbit.maxTempForProxy,
    };

    it("detects warning when anomalyLevel exceeds warning threshold and signal/temp are nominal", () => {
      const result = detectAnomalies(
        { ...orbitTelemetry, anomalyLevel: ANOMALY_THRESHOLDS.unstableOrbit.warning + 1 },
        "online",
      );
      const anomaly = result.find((a) => a.type === "unstableOrbit");
      expect(anomaly?.severity).toBe("warning");
    });

    it("detects critical when anomalyLevel exceeds critical threshold and signal/temp are nominal", () => {
      const result = detectAnomalies(
        { ...orbitTelemetry, anomalyLevel: ANOMALY_THRESHOLDS.unstableOrbit.critical + 1 },
        "online",
      );
      const anomaly = result.find((a) => a.type === "unstableOrbit");
      expect(anomaly?.severity).toBe("critical");
    });

    it("does NOT detect unstableOrbit when signal is degraded — classified as signalDrop instead", () => {
      const result = detectAnomalies(
        {
          ...nominalTelemetry,
          signalStrength: ANOMALY_THRESHOLDS.unstableOrbit.minSignalForProxy - 1,
          anomalyLevel: ANOMALY_THRESHOLDS.unstableOrbit.critical + 10,
        },
        "degraded",
      );
      expect(result.find((a) => a.type === "unstableOrbit")).toBeUndefined();
      expect(result.find((a) => a.type === "signalDrop")).toBeDefined();
    });

    it("does NOT detect unstableOrbit when temperature is elevated — classified as overheating instead", () => {
      const result = detectAnomalies(
        {
          ...nominalTelemetry,
          temperature: ANOMALY_THRESHOLDS.unstableOrbit.maxTempForProxy + 1,
          anomalyLevel: ANOMALY_THRESHOLDS.unstableOrbit.critical + 10,
        },
        "online",
      );
      expect(result.find((a) => a.type === "unstableOrbit")).toBeUndefined();
      expect(result.find((a) => a.type === "overheating")).toBeDefined();
    });

    it("boundary: anomalyLevel exactly at warning threshold is nominal", () => {
      const result = detectAnomalies(
        { ...orbitTelemetry, anomalyLevel: ANOMALY_THRESHOLDS.unstableOrbit.warning },
        "online",
      );
      expect(result.find((a) => a.type === "unstableOrbit")).toBeUndefined();
    });

    it("records the correct metric, value, and threshold", () => {
      const level = 75;
      const result = detectAnomalies({ ...orbitTelemetry, anomalyLevel: level }, "online");
      const anomaly = result.find((a) => a.type === "unstableOrbit");
      expect(anomaly?.metric).toBe("anomalyLevel");
      expect(anomaly?.value).toBe(level);
      expect(anomaly?.threshold).toBe(ANOMALY_THRESHOLDS.unstableOrbit.critical);
    });
  });

  // ── Multi-anomaly ───────────────────────────────────────────────────────────

  describe("multi-anomaly", () => {
    it("detects signalDrop and overheating simultaneously", () => {
      const result = detectAnomalies(
        {
          ...nominalTelemetry,
          signalStrength: 25, // critical signal
          temperature: 50,    // warning temperature
        },
        "degraded",
      );
      expect(result.find((a) => a.type === "signalDrop")?.severity).toBe("critical");
      expect(result.find((a) => a.type === "overheating")?.severity).toBe("warning");
    });

    it("SAT-Delta scenario: warning signal + overheating warning + unstableOrbit suppressed", () => {
      // signal 34 is in [30, 60) → warning (not critical; critical threshold is < 30)
      // temp 48 is in (45, 60] → overheating warning
      // anomalyLevel 55 is high but signal is below minSignalForProxy → unstableOrbit suppressed
      const result = detectAnomalies(
        { ...nominalTelemetry, signalStrength: 34, temperature: 48, anomalyLevel: 55 },
        "degraded",
      );
      expect(result.find((a) => a.type === "signalDrop")?.severity).toBe("warning");
      expect(result.find((a) => a.type === "overheating")?.severity).toBe("warning");
      expect(result.find((a) => a.type === "unstableOrbit")).toBeUndefined();
    });
  });

  // ── Constants integrity ─────────────────────────────────────────────────────

  describe("ANOMALY_VISUAL_RULES", () => {
    it("has a color entry for every AnomalyType", () => {
      const types = ["signalDrop", "overheating", "unstableOrbit", "communicationLoss"] as const;
      for (const type of types) {
        expect(ANOMALY_VISUAL_RULES[type].color).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
  });

  describe("ANOMALY_SEVERITY_COLORS", () => {
    it("has color entries for warning and critical", () => {
      expect(ANOMALY_SEVERITY_COLORS.warning).toMatch(/^#[0-9a-f]{6}$/i);
      expect(ANOMALY_SEVERITY_COLORS.critical).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
