import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SatelliteId } from "@satellite-control/entity-satellite";
import { AnomalyDetailPanel } from "./AnomalyDetailPanel";
import type { AlertEvent } from "./alert-events";
import type { Satellite } from "@/widgets/mission-control-scene";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

// SAT-Gamma: offline + signalStrength 0 → communicationLoss (critical), 1 anomaly
const SAT_GAMMA: Satellite = {
  id: SatelliteId("sat-3"),
  name: "SAT-Gamma",
  position: [0, 0, 0],
  status: "offline",
  orbit: { radius: 2.5, inclination: 0.4, raan: 1.1, speed: 0.5, initialAngle: 0.3 },
  telemetry: {
    signalStrength: 0,
    temperature: 55,
    anomalyLevel: 82,
    battery: 12,
    altitude: 538,
    healthScore: 8,
    latency: 0,
  },
};

// SAT-Delta: degraded, signalStrength 34 + temperature 48 → signalDrop + overheating, 2 anomalies
const SAT_DELTA: Satellite = {
  id: SatelliteId("sat-4"),
  name: "SAT-Delta",
  position: [0, 0, 0],
  status: "degraded",
  orbit: { radius: 2.5, inclination: 0.4, raan: 1.5, speed: 0.5, initialAngle: 1.0 },
  telemetry: {
    signalStrength: 34,
    temperature: 48,
    anomalyLevel: 10,
    battery: 65,
    altitude: 552,
    healthScore: 42,
    latency: 280,
  },
};

const GAMMA_EVENT: AlertEvent = {
  id: "sat-3-communicationLoss",
  satelliteId: "sat-3",
  satelliteName: "SAT-Gamma",
  type: "communicationLoss",
  severity: "critical",
  detectedAt: new Date("2024-01-01T09:00:00Z"),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AnomalyDetailPanel", () => {
  it("shows the no-selection placeholder when selectedId is null", () => {
    render(
      <AnomalyDetailPanel
        selectedId={null}
        events={[]}
        allSatellites={[SAT_GAMMA]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByTestId("anomaly-detail-no-selection")).toBeInTheDocument();
    expect(screen.queryByTestId("anomaly-detail-panel")).not.toBeInTheDocument();
  });

  it("shows the no-selection placeholder when selectedId matches no satellite", () => {
    render(
      <AnomalyDetailPanel
        selectedId="sat-999"
        events={[]}
        allSatellites={[SAT_GAMMA]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByTestId("anomaly-detail-no-selection")).toBeInTheDocument();
  });

  it("shows the satellite name when a satellite is selected", () => {
    render(
      <AnomalyDetailPanel
        selectedId="sat-3"
        events={[GAMMA_EVENT]}
        allSatellites={[SAT_GAMMA]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("SAT-Gamma")).toBeInTheDocument();
  });

  it("renders one anomaly card for a satellite with a single anomaly", () => {
    render(
      <AnomalyDetailPanel
        selectedId="sat-3"
        events={[GAMMA_EVENT]}
        allSatellites={[SAT_GAMMA]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("anomaly-detail-card")).toHaveLength(1);
  });

  it("renders two anomaly cards for a satellite with multiple anomalies", () => {
    render(
      <AnomalyDetailPanel
        selectedId="sat-4"
        events={[]}
        allSatellites={[SAT_DELTA]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("anomaly-detail-card")).toHaveLength(2);
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <AnomalyDetailPanel
        selectedId="sat-3"
        events={[GAMMA_EVENT]}
        allSatellites={[SAT_GAMMA]}
        onClose={onClose}
      />,
    );
    await userEvent.click(screen.getByTestId("anomaly-detail-close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders a <time> element with the event's ISO dateTime attribute", () => {
    render(
      <AnomalyDetailPanel
        selectedId="sat-3"
        events={[GAMMA_EVENT]}
        allSatellites={[SAT_GAMMA]}
        onClose={vi.fn()}
      />,
    );
    const time = screen.getByRole("time");
    expect(time).toHaveAttribute("dateTime", GAMMA_EVENT.detectedAt.toISOString());
  });

  it("shows the metric name and current value in the anomaly card", () => {
    render(
      <AnomalyDetailPanel
        selectedId="sat-3"
        events={[GAMMA_EVENT]}
        allSatellites={[SAT_GAMMA]}
        onClose={vi.fn()}
      />,
    );
    const metricEl = screen.getByTestId("anomaly-detail-metric");
    expect(metricEl).toHaveTextContent("signalStrength");
    expect(metricEl).toHaveTextContent("0");
  });

  it("shows the suggested action i18n key for the anomaly type", () => {
    render(
      <AnomalyDetailPanel
        selectedId="sat-3"
        events={[GAMMA_EVENT]}
        allSatellites={[SAT_GAMMA]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByTestId("anomaly-detail-action")).toHaveTextContent(
      "detail.action.communicationLoss",
    );
  });
});
