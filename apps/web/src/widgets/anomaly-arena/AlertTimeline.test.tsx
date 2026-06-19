import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertTimeline } from "./AlertTimeline";
import type { AlertEvent } from "./alert-events";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const WARNING_EVENT: AlertEvent = {
  id: "sat-1-signalDrop",
  satelliteId: "sat-1",
  satelliteName: "SAT-Alpha",
  type: "signalDrop",
  severity: "warning",
  detectedAt: new Date("2024-01-01T10:30:00Z"),
};

const CRITICAL_EVENT: AlertEvent = {
  id: "sat-2-communicationLoss",
  satelliteId: "sat-2",
  satelliteName: "SAT-Beta",
  type: "communicationLoss",
  severity: "critical",
  detectedAt: new Date("2024-01-01T10:25:00Z"),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AlertTimeline", () => {
  it("shows the empty state when no events are provided", () => {
    render(<AlertTimeline events={[]} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.getByTestId("alert-timeline-empty")).toBeInTheDocument();
    expect(screen.queryByTestId("alert-event")).not.toBeInTheDocument();
  });

  it("renders one list item per event", () => {
    render(
      <AlertTimeline
        events={[WARNING_EVENT, CRITICAL_EVENT]}
        selectedId={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("alert-event")).toHaveLength(2);
  });

  it("displays the satellite name for each event", () => {
    render(<AlertTimeline events={[WARNING_EVENT]} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.getByText("SAT-Alpha")).toBeInTheDocument();
  });

  it("calls onSelect with the correct satelliteId when a row is clicked", async () => {
    const onSelect = vi.fn();
    render(
      <AlertTimeline events={[WARNING_EVENT]} selectedId={null} onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByTestId("alert-event"));
    expect(onSelect).toHaveBeenCalledWith("sat-1");
  });

  it("sets aria-pressed=true on the selected satellite's event row", () => {
    render(
      <AlertTimeline
        events={[WARNING_EVENT, CRITICAL_EVENT]}
        selectedId="sat-1"
        onSelect={vi.fn()}
      />,
    );
    const buttons = screen.getAllByTestId("alert-event");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    expect(buttons[1]).toHaveAttribute("aria-pressed", "false");
  });

  it("renders a <time> element with a dateTime attribute for each event", () => {
    render(<AlertTimeline events={[WARNING_EVENT]} selectedId={null} onSelect={vi.fn()} />);
    const time = screen.getByRole("time");
    expect(time).toHaveAttribute("dateTime", WARNING_EVENT.detectedAt.toISOString());
  });

  it("shows the event count in the header when events are present", () => {
    render(
      <AlertTimeline
        events={[WARNING_EVENT, CRITICAL_EVENT]}
        selectedId={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not show the count in the header when there are no events", () => {
    render(<AlertTimeline events={[]} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
