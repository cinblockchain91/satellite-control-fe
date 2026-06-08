import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "@satellite-control/ds-ui-web";

const items = [
  { value: "overview", label: "Overview", content: <div className="p-4">Overview content</div> },
  { value: "telemetry", label: "Telemetry", content: <div className="p-4">Telemetry data</div> },
  { value: "settings", label: "Settings", content: <div className="p-4">Settings panel</div> },
  { value: "disabled", label: "Disabled", disabled: true, content: <div className="p-4">Disabled</div> },
];

const meta: Meta<typeof Tabs> = {
  title: "Design System/Tabs",
  component: Tabs,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = { args: { items, defaultValue: "overview" } };
export const Vertical: Story = {
  args: { items, defaultValue: "overview", orientation: "vertical" },
};
export const WithBadge: Story = {
  args: {
    defaultValue: "overview",
    items: [
      { value: "overview", label: "Overview", badge: "3", content: <div className="p-4">Overview</div> },
      { value: "alerts", label: "Alerts", badge: "12", content: <div className="p-4">Alerts</div> },
    ],
  },
};
