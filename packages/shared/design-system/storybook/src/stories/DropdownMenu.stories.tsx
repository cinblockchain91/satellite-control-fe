import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu, Button } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof DropdownMenu> = {
  title: "Design System/DropdownMenu",
  component: DropdownMenu,
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Open menu</Button>,
    items: [
      { type: "item", label: "Edit", shortcut: "⌘E", onClick: () => {} },
      { type: "item", label: "Duplicate", onClick: () => {} },
      { type: "separator" },
      { type: "item", label: "Archive", onClick: () => {} },
      { type: "separator" },
      { type: "item", label: "Delete", destructive: true, onClick: () => {} },
    ],
  },
};

export const WithLabel: Story = {
  args: {
    trigger: <Button variant="secondary">User menu</Button>,
    items: [
      { type: "label", label: "john@example.com" },
      { type: "separator" },
      { type: "item", label: "Profile", onClick: () => {} },
      { type: "item", label: "Settings", onClick: () => {} },
      { type: "separator" },
      { type: "item", label: "Sign out", destructive: true, onClick: () => {} },
    ],
  },
};
