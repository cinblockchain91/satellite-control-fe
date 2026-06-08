import type { StoryObj } from "@storybook/react";
import { CommandPalette, Button } from "@satellite-control/ds-ui-web";
import { useState } from "react";

const groups = [
  {
    label: "Satellites",
    items: [
      { value: "starlink-1", label: "Starlink-1", description: "LEO · Active", onSelect: () => {} },
      { value: "gps-iif", label: "GPS-IIF-12", description: "MEO · Active", onSelect: () => {} },
    ],
  },
  {
    label: "Actions",
    items: [
      { value: "send-command", label: "Send Command", shortcut: "⌘K", onSelect: () => {} },
      { value: "view-telemetry", label: "View Telemetry", shortcut: "⌘T", onSelect: () => {} },
      { value: "schedule", label: "Schedule Maneuver", onSelect: () => {} },
    ],
  },
];

export default { title: "Design System/CommandPalette" };

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          groups={groups}
          placeholder="Search satellites or actions..."
        />
      </>
    );
  },
};
