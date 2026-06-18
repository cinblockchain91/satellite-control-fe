import { describe, it, expect } from "vitest";
import { SatelliteSchema, SatelliteTelemetrySchema, SatelliteOrbitSchema } from "./satellite.schema";

const validTelemetry = {
  signalStrength: 85,
  battery: 90,
  temperature: 22,
  altitude: 550,
  healthScore: 88,
  latency: 45,
  anomalyLevel: 5,
};

const validOrbit = {
  radius: 2.5,
  inclination: 10,
  raan: 0,
  speed: 0.35,
  initialAngle: 0,
};

const validSatellite = {
  id: "sat-1",
  name: "SAT-Alpha",
  position: [2.5, 0, 0] as [number, number, number],
  status: "online" as const,
  telemetry: validTelemetry,
  orbit: validOrbit,
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

  it("latency không được âm", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, latency: -1 }).success,
    ).toBe(false);
  });

  it("latency = 0 hợp lệ (offline satellite)", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, latency: 0 }).success,
    ).toBe(true);
  });

  it("anomalyLevel không được vượt quá 100", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, anomalyLevel: 101 }).success,
    ).toBe(false);
  });

  it("anomalyLevel không được nhỏ hơn 0", () => {
    expect(
      SatelliteTelemetrySchema.safeParse({ ...validTelemetry, anomalyLevel: -1 }).success,
    ).toBe(false);
  });
});

describe("SatelliteOrbitSchema", () => {
  it("parse thành công với orbit hợp lệ", () => {
    expect(SatelliteOrbitSchema.safeParse(validOrbit).success).toBe(true);
  });

  it("radius phải dương", () => {
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, radius: 0 }).success).toBe(false);
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, radius: -1 }).success).toBe(false);
  });

  it("inclination phải trong [0, 180]", () => {
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, inclination: -1 }).success).toBe(false);
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, inclination: 181 }).success).toBe(false);
  });

  it("raan phải trong [0, 360]", () => {
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, raan: -1 }).success).toBe(false);
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, raan: 361 }).success).toBe(false);
  });

  it("inclination = 0 và 180 đều hợp lệ (boundary)", () => {
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, inclination: 0 }).success).toBe(true);
    expect(SatelliteOrbitSchema.safeParse({ ...validOrbit, inclination: 180 }).success).toBe(true);
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

  it("orbit là bắt buộc", () => {
    const { orbit: _orbit, ...withoutOrbit } = validSatellite;
    expect(SatelliteSchema.safeParse(withoutOrbit).success).toBe(false);
  });

  it("orbit không hợp lệ bị reject", () => {
    expect(
      SatelliteSchema.safeParse({ ...validSatellite, orbit: { ...validOrbit, radius: -1 } }).success,
    ).toBe(false);
  });
});
