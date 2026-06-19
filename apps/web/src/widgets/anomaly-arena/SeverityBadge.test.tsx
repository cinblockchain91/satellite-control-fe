import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SeverityBadge } from "./SeverityBadge";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("SeverityBadge", () => {
  it("renders the warning i18n key for warning severity", () => {
    render(<SeverityBadge severity="warning" />);
    expect(screen.getByText("severity.warning")).toBeInTheDocument();
  });

  it("renders the critical i18n key for critical severity", () => {
    render(<SeverityBadge severity="critical" />);
    expect(screen.getByText("severity.critical")).toBeInTheDocument();
  });

  it("renders an aria-hidden icon for warning severity", () => {
    const { container } = render(<SeverityBadge severity="warning" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an aria-hidden icon for critical severity", () => {
    const { container } = render(<SeverityBadge severity="critical" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("uses distinct icons for warning vs critical", () => {
    const { container: warnContainer } = render(<SeverityBadge severity="warning" />);
    const { container: critContainer } = render(<SeverityBadge severity="critical" />);
    const warnPath = warnContainer.querySelector("svg path")?.getAttribute("d");
    const critPath = critContainer.querySelector("svg path")?.getAttribute("d");
    expect(warnPath).not.toBe(critPath);
  });
});
