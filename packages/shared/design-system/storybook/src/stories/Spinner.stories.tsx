import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Spinner> = {
  title: "Design System/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["default", "success", "warning", "danger"] },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = { args: { size: "md" } };
export const WithLabel: Story = { args: { size: "md", label: "Loading..." } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Success: Story = { args: { size: "md", variant: "success" } };

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};
