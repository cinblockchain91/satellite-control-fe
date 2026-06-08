import type { Meta, StoryObj } from "@storybook/react";
import { AlertDialog, Button } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof AlertDialog> = {
  title: "Design System/AlertDialog",
  component: AlertDialog,
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Show dialog</Button>,
    title: "Confirm action",
    description: "Are you sure? This action cannot be undone.",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    onConfirm: () => {},
  },
};
export const Destructive: Story = {
  args: {
    trigger: <Button variant="destructive">Delete satellite</Button>,
    title: "Delete satellite",
    description: "This will permanently delete the satellite and all its data.",
    variant: "destructive",
    confirmLabel: "Delete",
    cancelLabel: "Keep",
    onConfirm: () => {},
  },
};
