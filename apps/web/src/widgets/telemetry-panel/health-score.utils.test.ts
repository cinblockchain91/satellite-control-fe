import { describe, it, expect } from "vitest";
import { healthScoreVariant } from "./health-score.utils";

describe("healthScoreVariant", () => {
  it("returns green for score >= 70", () => {
    expect(healthScoreVariant(100)).toEqual({ text: "text-green-400", bar: "bg-green-500" });
    expect(healthScoreVariant(82)).toEqual({ text: "text-green-400", bar: "bg-green-500" });
    expect(healthScoreVariant(70)).toEqual({ text: "text-green-400", bar: "bg-green-500" });
  });

  it("returns yellow for score 40–69", () => {
    expect(healthScoreVariant(69)).toEqual({ text: "text-yellow-400", bar: "bg-yellow-500" });
    expect(healthScoreVariant(55)).toEqual({ text: "text-yellow-400", bar: "bg-yellow-500" });
    expect(healthScoreVariant(40)).toEqual({ text: "text-yellow-400", bar: "bg-yellow-500" });
  });

  it("returns red for score < 40", () => {
    expect(healthScoreVariant(39)).toEqual({ text: "text-red-400", bar: "bg-red-500" });
    expect(healthScoreVariant(25)).toEqual({ text: "text-red-400", bar: "bg-red-500" });
    expect(healthScoreVariant(0)).toEqual({ text: "text-red-400", bar: "bg-red-500" });
  });

  it("boundary: 70 is green, 69 is yellow, 40 is yellow, 39 is red", () => {
    expect(healthScoreVariant(70).text).toBe("text-green-400");
    expect(healthScoreVariant(69).text).toBe("text-yellow-400");
    expect(healthScoreVariant(40).text).toBe("text-yellow-400");
    expect(healthScoreVariant(39).text).toBe("text-red-400");
  });
});
