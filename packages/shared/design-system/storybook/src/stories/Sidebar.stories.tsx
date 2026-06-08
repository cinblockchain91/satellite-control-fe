import type { StoryObj } from "@storybook/react";
import { Sidebar } from "@satellite-control/ds-ui-web";
import { useState } from "react";

const items = [
  { value: "dashboard", label: "Dashboard", href: "/dashboard" },
  {
    value: "satellites",
    label: "Satellites",
    href: "/satellites",
    badge: "12",
    children: [
      { value: "active", label: "Active", href: "/satellites/active" },
      { value: "idle", label: "Idle", href: "/satellites/idle" },
    ],
  },
  { value: "telemetry", label: "Telemetry", href: "/telemetry" },
  { value: "commands", label: "Commands", href: "/commands" },
  { value: "settings", label: "Settings", href: "/settings" },
];

export default { title: "Design System/Sidebar" };

export const Default: StoryObj = {
  render: () => {
    const [active, setActive] = useState("dashboard");
    return (
      <div className="h-96 w-64 border rounded-lg overflow-hidden">
        <Sidebar items={items} activeValue={active} onValueChange={setActive} />
      </div>
    );
  },
};

export const Collapsed: StoryObj = {
  render: () => {
    const [active, setActive] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(true);
    return (
      <div className="h-96 border rounded-lg overflow-hidden">
        <Sidebar
          items={items}
          activeValue={active}
          onValueChange={setActive}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
      </div>
    );
  },
};
