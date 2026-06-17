import { describe, it, expect } from "vitest";
import { buildSnapshot } from "./telemetry-snapshot";
import { SatelliteId } from "@satellite-control/entity-satellite";
import type { Satellite } from "@satellite-control/entity-satellite";

const stubOrbit = { radius: 2.5, inclination: 0, raan: 0, speed: 0.3, initialAngle: 0 };

function makeSat(
  status: Satellite["status"],
  signal: number,
  battery: number,
  temperature: number,
  id: string,
): Satellite {
  return {
    id: SatelliteId(`sat-${id}`),
    name: `SAT-${id}`,
    position: [0, 0, 0],
    status,
    orbit: stubOrbit,
    telemetry: { signalStrength: signal, battery, temperature, altitude: 500, healthScore: 80 },
  };
}

describe("buildSnapshot", () => {
  it("returns zeros for empty fleet", () => {
    const snap = buildSnapshot([], 0);
    expect(snap.satelliteCount).toBe(0);
    expect(snap.onlineCount).toBe(0);
    expect(snap.systemStatus).toBe("nominal");
  });

  it("counts total and online satellites correctly", () => {
    const sats = [
      makeSat("online", 90, 90, 20, "1"),
      makeSat("online", 80, 80, 22, "2"),
      makeSat("offline", 0, 10, 50, "3"),
    ];
    const snap = buildSnapshot(sats, 0);
    expect(snap.satelliteCount).toBe(3);
    expect(snap.onlineCount).toBe(2);
  });

  it("averages telemetry from all satellites at tick 0 (no drift)", () => {
    const sats = [
      makeSat("online", 80, 60, 20, "1"),
      makeSat("online", 60, 40, 30, "2"),
    ];
    const snap = buildSnapshot(sats, 0);
    // sin(0) = 0, so no drift at tick 0
    expect(snap.signalStrength).toBe(70);
    expect(snap.battery).toBe(50);
    expect(snap.temperature).toBe(25);
  });

  it("derives systemStatus as critical when fewer than half are online", () => {
    const sats = [
      makeSat("online", 90, 90, 20, "1"),
      makeSat("offline", 0, 0, 0, "2"),
      makeSat("offline", 0, 0, 0, "3"),
    ];
    const snap = buildSnapshot(sats, 0);
    expect(snap.systemStatus).toBe("critical");
  });

  it("derives systemStatus as nominal when majority online and signal high", () => {
    const sats = [
      makeSat("online", 90, 90, 20, "1"),
      makeSat("online", 85, 88, 22, "2"),
      makeSat("online", 80, 85, 24, "3"),
    ];
    const snap = buildSnapshot(sats, 0);
    expect(snap.systemStatus).toBe("nominal");
  });
});
