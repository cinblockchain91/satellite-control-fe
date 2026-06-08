import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof EmptyState> = {
  title: "Design System/EmptyState",
  component: EmptyState,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { title: "No results found", description: "Try adjusting your search or filters." },
};
export const WithAction: Story = {
  args: {
    title: "No satellites yet",
    description: "Add your first satellite to get started.",
    action: { label: "Add Satellite", onClick: () => {} },
  },
};
export const Small: Story = {
  args: { size: "sm", title: "No items", description: "Nothing to show here." },
};
