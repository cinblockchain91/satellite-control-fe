import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Badge> = {
  title: "Design System/Badge",
  component: Badge,
  argTypes: {
    variant: { control: "select", options: ["default", "success", "warning", "danger", "info"] },
    size: { control: "select", options: ["sm", "md"] },
    dot: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Default" } };
export const Success: Story = { args: { variant: "success", children: "Success" } };
export const Warning: Story = { args: { variant: "warning", children: "Warning" } };
export const Danger: Story = { args: { variant: "danger", children: "Danger" } };
export const Info: Story = { args: { variant: "info", children: "Info" } };
export const WithDot: Story = { args: { variant: "success", dot: true, children: "Online" } };
export const Small: Story = { args: { size: "sm", children: "Small" } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success" dot>Online</Badge>
    </div>
  ),
};
