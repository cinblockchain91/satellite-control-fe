import { describe, it, expect } from "vitest";
import { orbitToPoints, ORBIT_SEGMENTS } from "./orbit-to-points";

const equatorialOrbit = {
  radius: 2.5,
  inclination: 0,
  raan: 0,
  speed: 1,
  initialAngle: 0,
};

describe("orbitToPoints", () => {
  it("returns ORBIT_SEGMENTS points by default", () => {
    expect(orbitToPoints(equatorialOrbit)).toHaveLength(ORBIT_SEGMENTS);
  });

  it("all points lie at the correct orbit radius (distance invariant)", () => {
    const orbit = { radius: 3.0, inclination: 45, raan: 90, speed: 0.5, initialAngle: 0 };
    for (const [x, y, z] of orbitToPoints(orbit)) {
      expect(Math.sqrt(x * x + y * y + z * z)).toBeCloseTo(orbit.radius, 5);
    }
  });

  it("equatorial orbit (inclination=0) stays in the XZ plane", () => {
    for (const [, y] of orbitToPoints(equatorialOrbit)) {
      expect(Math.abs(y)).toBeLessThan(1e-10);
    }
  });

  it("evenly distributes points — last point is not the same as first", () => {
    const pts = orbitToPoints(equatorialOrbit);
    const [x0, , z0] = pts[0]!;
    const [xN, , zN] = pts[ORBIT_SEGMENTS - 1]!;
    // Gap at 2π/ORBIT_SEGMENTS ≈ 0.12 scene units — much greater than 0.01
    expect(Math.sqrt((xN - x0) ** 2 + (zN - z0) ** 2)).toBeGreaterThan(0.01);
  });
});
