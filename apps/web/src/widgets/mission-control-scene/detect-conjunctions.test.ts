import { describe, it, expect } from "vitest";
import { detectConjunctions, CONJUNCTION_THRESHOLD } from "./detect-conjunctions";

const baseOrbit = { radius: 2.5, inclination: 0, raan: 0, speed: 1, initialAngle: 0 };

describe("detectConjunctions", () => {
  it("detects two satellites at the same position", () => {
    const satellites = [
      { id: "sat-1", orbit: baseOrbit },
      { id: "sat-2", orbit: baseOrbit }, // identical orbit → same position at every t
    ];
    const result = detectConjunctions(satellites, 0);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("sat-1");
    expect(result[0]).toContain("sat-2");
  });

  it("does not detect satellites far apart", () => {
    // raan=0 vs raan=180: opposite sides of Earth, distance = 2*r = 5.0
    const satellites = [
      { id: "sat-1", orbit: { ...baseOrbit, raan: 0 } },
      { id: "sat-2", orbit: { ...baseOrbit, raan: 180 } },
    ];
    expect(detectConjunctions(satellites, 0)).toHaveLength(0);
  });

  it("respects the threshold parameter", () => {
    // chord between initialAngle=0 and initialAngle=0.1 on r=2.5 circle ≈ 0.25 scene units
    const sat1 = { id: "sat-1", orbit: { ...baseOrbit, initialAngle: 0 } };
    const sat2 = { id: "sat-2", orbit: { ...baseOrbit, initialAngle: 0.1 } };
    expect(detectConjunctions([sat1, sat2], 0, 0.3)).toHaveLength(1);
    expect(detectConjunctions([sat1, sat2], 0, 0.1)).toHaveLength(0);
  });

  it("does not pair a satellite with itself", () => {
    expect(detectConjunctions([{ id: "sat-1", orbit: baseOrbit }], 0)).toHaveLength(0);
  });

  it("uses CONJUNCTION_THRESHOLD as default when threshold is omitted", () => {
    // Two satellites at same position — distance 0 < any positive threshold
    const satellites = [
      { id: "sat-1", orbit: baseOrbit },
      { id: "sat-2", orbit: baseOrbit },
    ];
    const withDefault = detectConjunctions(satellites, 0);
    const withExplicit = detectConjunctions(satellites, 0, CONJUNCTION_THRESHOLD);
    expect(withDefault).toEqual(withExplicit);
  });
});
