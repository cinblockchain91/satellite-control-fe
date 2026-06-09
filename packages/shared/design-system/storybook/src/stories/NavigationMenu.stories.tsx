import type { StoryObj } from "@storybook/react";
import { NavigationMenu } from "@satellite-control/ds-ui-web";

const items = [
  { value: "dashboard", label: "Dashboard", href: "/dashboard" },
  {
    value: "satellites",
    label: "Satellites",
    children: [
      { value: "all", label: "All Satellites", href: "/satellites", description: "View all satellites" },
      { value: "active", label: "Active", href: "/satellites/active", description: "Currently active" },
      { value: "schedule", label: "Schedule", href: "/schedule", description: "Upcoming windows" },
    ],
  },
  { value: "telemetry", label: "Telemetry", href: "/telemetry" },
  { value: "docs", label: "Documentation", href: "/docs" },
];

export default { title: "Design System/NavigationMenu" };

export const Default: StoryObj = {
  render: () => (
    <div className="p-4 border rounded-lg">
      <NavigationMenu items={items} activeValue="dashboard" />
    </div>
  ),
};
