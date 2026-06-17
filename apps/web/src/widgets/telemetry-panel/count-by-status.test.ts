import { describe, it, expect } from "vitest";
import { countByStatus } from "./count-by-status";
import { SatelliteId } from "@satellite-control/entity-satellite";
import type { Satellite } from "@satellite-control/entity-satellite";

function makeSat(status: Satellite["status"], id = status): Satellite {
  return {
    id: SatelliteId(`sat-${id}`),
    name: `SAT-${id}`,
    position: [0, 0, 0],
    status,
    telemetry: { signalStrength: 0, battery: 0, temperature: 0, altitude: 0, healthScore: 0 },
  };
}

describe("countByStatus", () => {
  it("counts each status correctly", () => {
    const satellites = [
      makeSat("online", "1"),
      makeSat("online", "2"),
      makeSat("warning", "3"),
      makeSat("degraded", "4"),
      makeSat("offline", "5"),
    ];
    expect(countByStatus(satellites)).toEqual({
      online: 2,
      warning: 1,
      degraded: 1,
      offline: 1,
    });
  });

  it("returns all zeros for empty array", () => {
    expect(countByStatus([])).toEqual({
      online: 0,
      warning: 0,
      degraded: 0,
      offline: 0,
    });
  });

  it("handles all-online fleet", () => {
    const satellites = [makeSat("online", "1"), makeSat("online", "2")];
    expect(countByStatus(satellites)).toEqual({
      online: 2,
      warning: 0,
      degraded: 0,
      offline: 0,
    });
  });
});
