import { describe, it, expect } from "vitest";
import { SatelliteId } from "@satellite-control/entity-satellite";
import type { Satellite } from "@/widgets/mission-control-scene";
import { buildAlertEvents } from "./alert-events";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_TELEMETRY = {
  battery: 80,
  altitude: 550,
  healthScore: 90,
  latency: 50,
};

const NOMINAL_SAT: Satellite = {
  id: SatelliteId("sat-nominal"),
  name: "SAT-Nominal",
  position: [2.5, 0, 0],
  status: "online",
  orbit: { radius: 2.5, inclination: 0, raan: 0, speed: 0.3, initialAngle: 0 },
  telemetry: { ...BASE_TELEMETRY, signalStrength: 90, temperature: 20, anomalyLevel: 5 },
};

// communicationLoss (critical, early-return — no other anomalies accumulated)
const OFFLINE_SAT: Satellite = {
  id: SatelliteId("sat-offline"),
  name: "SAT-Offline",
  position: [0, 0, 0],
  status: "offline",
  orbit: { radius: 2, inclination: 0, raan: 0, speed: 0.3, initialAngle: 0 },
  telemetry: { ...BASE_TELEMETRY, signalStrength: 0, temperature: 55, anomalyLevel: 80, latency: 0 },
};

// signalDrop warning only
const SIGNAL_SAT: Satellite = {
  id: SatelliteId("sat-signal"),
  name: "SAT-Signal",
  position: [1, 0, 0],
  status: "warning",
  orbit: { radius: 2, inclination: 0, raan: 0, speed: 0.3, initialAngle: 0 },
  telemetry: { ...BASE_TELEMETRY, signalStrength: 45, temperature: 20, anomalyLevel: 5 },
};

// signalDrop warning + overheating warning (two anomalies)
const MULTI_SAT: Satellite = {
  id: SatelliteId("sat-multi"),
  name: "SAT-Multi",
  position: [2, 0, 0],
  status: "degraded",
  orbit: { radius: 2.5, inclination: 0, raan: 0, speed: 0.3, initialAngle: 0 },
  telemetry: { ...BASE_TELEMETRY, signalStrength: 34, temperature: 48, anomalyLevel: 55 },
};

const NOW = 1_700_000_000_000; // fixed timestamp for determinism

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("buildAlertEvents", () => {
  it("returns an empty array for a fleet with no anomalies", () => {
    const events = buildAlertEvents([NOMINAL_SAT], NOW);
    expect(events).toHaveLength(0);
  });

  it("returns an empty array for an empty fleet", () => {
    const events = buildAlertEvents([], NOW);
    expect(events).toHaveLength(0);
  });

  it("creates one event per anomaly for a satellite with a single anomaly", () => {
    const events = buildAlertEvents([SIGNAL_SAT], NOW);
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe("signalDrop");
    expect(events[0]?.severity).toBe("warning");
  });

  it("creates multiple events for a satellite with multiple anomalies", () => {
    const events = buildAlertEvents([MULTI_SAT], NOW);
    expect(events).toHaveLength(2);
    const types = events.map((e) => e.type);
    expect(types).toContain("signalDrop");
    expect(types).toContain("overheating");
  });

  it("maps satelliteName and satelliteId correctly", () => {
    const events = buildAlertEvents([SIGNAL_SAT], NOW);
    expect(events[0]?.satelliteName).toBe("SAT-Signal");
    expect(events[0]?.satelliteId).toBe("sat-signal");
  });

  it("assigns unique ids to each event", () => {
    const events = buildAlertEvents([SIGNAL_SAT, MULTI_SAT], NOW);
    const ids = events.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("sorts critical events before warning events regardless of satellite order", () => {
    // SIGNAL_SAT (warning) at index 0, OFFLINE_SAT (critical) at index 1
    const events = buildAlertEvents([SIGNAL_SAT, OFFLINE_SAT], NOW);
    expect(events[0]?.severity).toBe("critical");
    expect(events[0]?.satelliteId).toBe("sat-offline");
  });

  it("within the same severity sorts most-recent events first", () => {
    // Two warning satellites: SIGNAL_SAT at index 0 (minutesAgo=0), MULTI_SAT at index 1 (minutesAgo=3+)
    // SIGNAL_SAT events have smaller minutesAgo → larger detectedAt → appear first
    const events = buildAlertEvents([SIGNAL_SAT, MULTI_SAT], NOW);
    const warningEvents = events.filter((e) => e.severity === "warning");
    expect(warningEvents[0]?.satelliteId).toBe("sat-signal");
  });

  it("assigns detectedAt as a Date instance with correct relative offset", () => {
    const events = buildAlertEvents([SIGNAL_SAT], NOW);
    // SIGNAL_SAT is at index 0, anomaly index 0 → minutesAgo = 0
    expect(events[0]?.detectedAt).toBeInstanceOf(Date);
    expect(events[0]?.detectedAt.getTime()).toBe(NOW);
  });

  it("assigns increasing age to anomalies within the same satellite", () => {
    const events = buildAlertEvents([MULTI_SAT], NOW);
    // MULTI_SAT is at index 0: anomaly[0] → 0 min ago, anomaly[1] → 1 min ago
    expect(events[0]).toBeDefined();
    expect(events[1]).toBeDefined();
    const t0 = events[0]!.detectedAt.getTime();
    const t1 = events[1]!.detectedAt.getTime();
    expect(t0).toBeGreaterThanOrEqual(t1);
  });
});
