import { describe, it, expect } from "vitest";
import { SatelliteSchema, SatelliteTelemetrySchema } from "./satellite.schema";

const validTelemetry = {
  signalStrength: 85,
  battery: 90,
  temperature: 22,
  altitude: 550,
  healthScore: 88,
};

const validSatellite = {
  id: "sat-1",
  name: "SAT-Alpha",
  position: [2.5, 0.5, 0] as [number, number, number],
  status: "online" as const,
  telemetry: validTelemetry,
};

describe("SatelliteTelemetrySchema", () => {
  it("parse thành công với telemetry hợp lệ", () => {
    expect(SatelliteTelemetrySchema.safeParse(validTelemetry).success).toBe(true);
  });

  it("signalStrength không được vượt quá 100", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, signalStrength: 101 }).success,
    ).toBe(false);
  });

  it("signalStrength không được nhỏ hơn 0", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, signalStrength: -1 }).success,
    ).toBe(false);
  });

  it("battery không được vượt quá 100", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, battery: 101 }).success,
    ).toBe(false);
  });

  it("healthScore không được vượt quá 100", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, healthScore: 101 }).success,
    ).toBe(false);
  });

  it("healthScore không được nhỏ hơn 0", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, healthScore: -1 }).success,
    ).toBe(false);
  });

  it("altitude không được âm", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, altitude: -1 }).success,
    ).toBe(false);
  });
});

describe("SatelliteSchema", () => {
  it("parse thành công với satellite hợp lệ", () => {
    expect(SatelliteSchema.safeParse(validSatellite).success).toBe(true);
  });

  it("status chỉ chấp nhận online | warning | degraded | offline", () => {
    expect(
      SatelliteSchema.safeParse({ ...validSatellite, status: "unknown" }).success,
    ).toBe(false);
  });

  it("status degraded là hợp lệ", () => {
    expect(
      SatelliteSchema.safeParse({ ...validSatellite, status: "degraded" }).success,
    ).toBe(true);
  });

  it("id không được rỗng", () => {
    expect(SatelliteSchema.safeParse({ ...validSatellite, id: "" }).success).toBe(false);
  });

  it("name không được rỗng", () => {
    expect(SatelliteSchema.safeParse({ ...validSatellite, name: "" }).success).toBe(false);
  });

  it("position phải là tuple 3 số", () => {
    expect(
      SatelliteSchema.safeParse({ ...validSatellite, position: [1, 2] }).success,
    ).toBe(false);
  });

  it("position với 4 phần tử không hợp lệ", () => {
    expect(
      SatelliteSchema.safeParse({ ...validSatellite, position: [1, 2, 3, 4] }).success,
    ).toBe(false);
  });
});
