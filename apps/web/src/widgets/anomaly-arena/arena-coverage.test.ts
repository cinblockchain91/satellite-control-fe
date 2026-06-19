import { describe, it, expect } from "vitest";
import { MOCK_SATELLITES } from "@/widgets/mission-control-scene";
import { detectAnomalies } from "./anomaly-detection";
import type { AnomalyType } from "./anomaly-detection";

/**
 * Guard tests — verify MOCK_SATELLITES provides full anomaly type + severity
 * coverage for the arena demo.  If a satellite is changed and a type is no
 * longer triggered, these tests catch it before it reaches production.
 */

const allAnomalies = MOCK_SATELLITES.flatMap((s) =>
  detectAnomalies(s.telemetry, s.status),
);
const coveredTypes = new Set(allAnomalies.map((a) => a.type));
const coveredSeverities = new Set(allAnomalies.map((a) => a.severity));

const REQUIRED_TYPES: AnomalyType[] = [
  "signalDrop",
  "overheating",
  "unstableOrbit",
  "communicationLoss",
];

describe("MOCK_SATELLITES arena coverage", () => {
  it.each(REQUIRED_TYPES)('covers the "%s" anomaly type', (type) => {
    expect(coveredTypes.has(type)).toBe(true);
  });

  it("covers warning severity", () => {
    expect(coveredSeverities.has("warning")).toBe(true);
  });

  it("covers critical severity", () => {
    expect(coveredSeverities.has("critical")).toBe(true);
  });

  it("includes at least one nominal satellite as a visual reference", () => {
    const nominalCount = MOCK_SATELLITES.filter(
      (s) => detectAnomalies(s.telemetry, s.status).length === 0,
    ).length;
    expect(nominalCount).toBeGreaterThanOrEqual(1);
  });

  it("demonstrates overheating at critical severity (temp > 60°C)", () => {
    expect(
      allAnomalies.some((a) => a.type === "overheating" && a.severity === "critical"),
    ).toBe(true);
  });

  it("demonstrates unstableOrbit with nominal signal and temperature", () => {
    const unstable = allAnomalies.find((a) => a.type === "unstableOrbit");
    expect(unstable).toBeDefined();
    const sat = MOCK_SATELLITES.find((s) =>
      detectAnomalies(s.telemetry, s.status).some((a) => a.type === "unstableOrbit"),
    );
    expect(sat).toBeDefined();
    // Guard: unstableOrbit must fire because of anomalyLevel, not signal/temp degradation
    expect(sat!.telemetry.signalStrength).toBeGreaterThanOrEqual(60);
    expect(sat!.telemetry.temperature).toBeLessThanOrEqual(45);
  });
});
