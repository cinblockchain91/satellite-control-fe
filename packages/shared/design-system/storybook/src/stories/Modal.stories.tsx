import type { Meta, StoryObj } from "@storybook/react";
import { Modal, Button } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Modal> = {
  title: "Design System/Modal",
  component: Modal,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    trigger: <Button>Open modal</Button>,
    title: "Confirm action",
    description: "Are you sure you want to proceed?",
    children: <p className="text-sm text-gray-600">This action cannot be undone.</p>,
    footer: (
      <div className="flex gap-2 justify-end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    trigger: <Button>Open large modal</Button>,
    title: "Satellite Configuration",
    size: "lg",
    children: (
      <div className="h-40 flex items-center justify-center text-gray-400">
        Large modal content
      </div>
    ),
  },
};
