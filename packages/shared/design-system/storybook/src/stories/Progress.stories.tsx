import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Progress> = {
  title: "Design System/Progress",
  component: Progress,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    variant: { control: "select", options: ["default", "success", "warning", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    showValue: { control: "boolean" },
    animated: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = { args: { value: 60, label: "Loading..." } };
export const WithValue: Story = { args: { value: 75, showValue: true } };
export const Success: Story = { args: { value: 100, variant: "success", label: "Complete" } };
export const Warning: Story = { args: { value: 45, variant: "warning" } };
export const Danger: Story = { args: { value: 20, variant: "danger" } };
export const Indeterminate: Story = { args: { indeterminate: true, label: "Processing..." } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <Progress value={80} label="Default" />
      <Progress value={80} variant="success" label="Success" />
      <Progress value={80} variant="warning" label="Warning" />
      <Progress value={80} variant="danger" label="Danger" />
      <Progress indeterminate label="Indeterminate" />
    </div>
  ),
};
