import type { Meta, StoryObj } from "@storybook/react";
import { Popover, Button } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Popover> = {
  title: "Design System/Popover",
  component: Popover,
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    showArrow: { control: "boolean" },
    title: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Open popover</Button>,
    title: "Popover title",
    children: <p className="text-sm">Popover content goes here.</p>,
  },
};
export const WithArrow: Story = {
  args: {
    trigger: <Button variant="secondary">With arrow</Button>,
    title: "With arrow",
    showArrow: true,
    children: <p className="text-sm">Popover with arrow.</p>,
  },
};
