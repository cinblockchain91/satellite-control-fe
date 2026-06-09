import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, Button } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Tooltip> = {
  title: "Design System/Tooltip",
  component: Tooltip,
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    showArrow: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    children: <Button variant="secondary">Hover me</Button>,
  },
};
export const WithArrow: Story = {
  args: {
    content: "Tooltip with arrow",
    showArrow: true,
    children: <Button variant="secondary">Hover me</Button>,
  },
};
export const AllSides: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip content="Top" side="top"><Button variant="secondary">Top</Button></Tooltip>
      <Tooltip content="Right" side="right"><Button variant="secondary">Right</Button></Tooltip>
      <Tooltip content="Bottom" side="bottom"><Button variant="secondary">Bottom</Button></Tooltip>
      <Tooltip content="Left" side="left"><Button variant="secondary">Left</Button></Tooltip>
    </div>
  ),
};
