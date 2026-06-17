import { describe, it, expect } from "vitest";
import { computeOrbitPosition } from "./compute-orbit-position";
import type { SatelliteOrbit } from "./satellite.entity";

const equatorial: SatelliteOrbit = {
  radius: 2.5,
  inclination: 0,
  raan: 0,
  speed: 0.3,
  initialAngle: 0,
};

const polar: SatelliteOrbit = {
  radius: 2.5,
  inclination: 90,
  raan: 0,
  speed: 0.3,
  initialAngle: 0,
};

describe("computeOrbitPosition", () => {
  it("quỹ đạo xích đạo tại t=0 bắt đầu trên trục +X", () => {
    const [x, y, z] = computeOrbitPosition(equatorial, 0);
    expect(x).toBeCloseTo(2.5);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });

  it("quỹ đạo xích đạo tại θ=π/2 đến trục +Z", () => {
    const t = Math.PI / 2 / equatorial.speed;
    const [x, y, z] = computeOrbitPosition(equatorial, t);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(2.5);
  });

  it("quỹ đạo cực tại θ=π/2 xuống cực nam (-Y)", () => {
    const t = Math.PI / 2 / polar.speed;
    const [x, y, z] = computeOrbitPosition(polar, t);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-2.5);
    expect(z).toBeCloseTo(0);
  });

  it("quỹ đạo cực tại θ=3π/2 lên cực bắc (+Y)", () => {
    const t = ((3 * Math.PI) / 2) / polar.speed;
    const [x, y, z] = computeOrbitPosition(polar, t);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(2.5);
    expect(z).toBeCloseTo(0);
  });

  it("sau một vòng quỹ đạo đầy đủ trở về vị trí ban đầu", () => {
    const period = (2 * Math.PI) / equatorial.speed;
    const [x0, y0, z0] = computeOrbitPosition(equatorial, 0);
    const [x1, y1, z1] = computeOrbitPosition(equatorial, period);
    expect(x1).toBeCloseTo(x0);
    expect(y1).toBeCloseTo(y0);
    expect(z1).toBeCloseTo(z0);
  });
});
