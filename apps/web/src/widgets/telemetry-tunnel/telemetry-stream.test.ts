import { describe, it, expect } from "vitest";
import { classifyMetric, classifyStream } from "./telemetry-stream";
import type { SatelliteTelemetry } from "@satellite-control/entity-satellite";

const nominalTelemetry: SatelliteTelemetry = {
  signalStrength: 85,
  battery: 80,
  temperature: 22,
  altitude: 550,
  healthScore: 88,
  latency: 45,
  anomalyLevel: 5,
};

describe("classifyMetric", () => {
  describe("signalStrength — lower is worse", () => {
    it("≥ 60 → nominal", () => expect(classifyMetric("signalStrength", 60)).toBe("nominal"));
    it("30–59 → warning", () => expect(classifyMetric("signalStrength", 45)).toBe("warning"));
    it("< 30 → critical", () => expect(classifyMetric("signalStrength", 15)).toBe("critical"));
    it("boundary 30 → warning", () => expect(classifyMetric("signalStrength", 30)).toBe("warning"));
  });

  describe("battery — lower is worse", () => {
    it("≥ 50 → nominal", () => expect(classifyMetric("battery", 50)).toBe("nominal"));
    it("20–49 → warning", () => expect(classifyMetric("battery", 35)).toBe("warning"));
    it("< 20 → critical", () => expect(classifyMetric("battery", 10)).toBe("critical"));
    it("boundary 20 → warning", () => expect(classifyMetric("battery", 20)).toBe("warning"));
  });

  describe("temperature — higher is worse", () => {
    it("≤ 45 → nominal", () => expect(classifyMetric("temperature", 45)).toBe("nominal"));
    it("46–60 → warning", () => expect(classifyMetric("temperature", 50)).toBe("warning"));
    it("> 60 → critical", () => expect(classifyMetric("temperature", 65)).toBe("critical"));
    it("boundary 60 → warning", () => expect(classifyMetric("temperature", 60)).toBe("warning"));
  });

  describe("latency — higher is worse", () => {
    it("≤ 200 → nominal", () => expect(classifyMetric("latency", 200)).toBe("nominal"));
    it("201–500 → warning", () => expect(classifyMetric("latency", 320)).toBe("warning"));
    it("> 500 → critical", () => expect(classifyMetric("latency", 600)).toBe("critical"));
    it("boundary 500 → warning", () => expect(classifyMetric("latency", 500)).toBe("warning"));
  });

  describe("anomalyLevel — higher is worse", () => {
    it("≤ 20 → nominal", () => expect(classifyMetric("anomalyLevel", 20)).toBe("nominal"));
    it("21–50 → warning", () => expect(classifyMetric("anomalyLevel", 35)).toBe("warning"));
    it("> 50 → critical", () => expect(classifyMetric("anomalyLevel", 75)).toBe("critical"));
    it("boundary 50 → warning", () => expect(classifyMetric("anomalyLevel", 50)).toBe("warning"));
  });
});

describe("classifyStream", () => {
  it("all nominal → nominal", () => {
    expect(classifyStream(nominalTelemetry)).toBe("nominal");
  });

  it("one warning field → warning", () => {
    expect(classifyStream({ ...nominalTelemetry, battery: 35 })).toBe("warning");
  });

  it("one critical field → critical", () => {
    expect(classifyStream({ ...nominalTelemetry, signalStrength: 10 })).toBe("critical");
  });

  it("critical wins over warning", () => {
    expect(classifyStream({ ...nominalTelemetry, battery: 35, anomalyLevel: 75 })).toBe("critical");
  });

  it("latency critical → critical", () => {
    expect(classifyStream({ ...nominalTelemetry, latency: 600 })).toBe("critical");
  });

  it("anomalyLevel warning only → warning", () => {
    expect(classifyStream({ ...nominalTelemetry, anomalyLevel: 35 })).toBe("warning");
  });
});
