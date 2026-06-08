import type { Meta, StoryObj } from "@storybook/react";
import { Drawer, Button } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Drawer> = {
  title: "Design System/Drawer",
  component: Drawer,
  argTypes: {
    side: { control: "select", options: ["left", "right", "bottom"] },
    title: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Right: Story = {
  args: {
    trigger: <Button>Open right drawer</Button>,
    title: "Settings",
    side: "right",
    children: <p className="text-sm text-gray-600">Drawer content goes here.</p>,
  },
};
export const Left: Story = {
  args: {
    trigger: <Button>Open left drawer</Button>,
    title: "Navigation",
    side: "left",
    children: <p className="text-sm text-gray-600">Left drawer content.</p>,
  },
};
export const Bottom: Story = {
  args: {
    trigger: <Button>Open bottom drawer</Button>,
    title: "Options",
    side: "bottom",
    children: <p className="text-sm text-gray-600">Bottom sheet content.</p>,
  },
};
