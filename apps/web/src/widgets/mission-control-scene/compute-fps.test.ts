import { describe, it, expect } from "vitest";
import { computeFps } from "./compute-fps";

describe("computeFps", () => {
  it("returns 60 for 60 frames in 1 second", () => {
    expect(computeFps(1, 60)).toBe(60);
  });

  it("returns 30 for 60 frames in 2 seconds", () => {
    expect(computeFps(2, 60)).toBe(30);
  });

  it("returns 0 when elapsed is 0 (guard division by zero)", () => {
    expect(computeFps(0, 60)).toBe(0);
  });

  it("returns 0 when elapsed is negative", () => {
    expect(computeFps(-1, 60)).toBe(0);
  });
});
