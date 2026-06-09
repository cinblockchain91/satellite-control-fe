import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "@satellite-control/ds-ui-web";
import { ArrowRight } from "@satellite-control/ds-icons/react";

const meta: Meta<typeof Icon> = {
  title: "Design System/Icon",
  component: Icon,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = { args: { icon: ArrowRight, size: "md", label: "Arrow right" } };
export const ExtraSmall: Story = { args: { icon: ArrowRight, size: "xs" } };
export const Small: Story = { args: { icon: ArrowRight, size: "sm" } };
export const Large: Story = { args: { icon: ArrowRight, size: "lg" } };
export const ExtraLarge: Story = { args: { icon: ArrowRight, size: "xl" } };

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Icon icon={ArrowRight} size="xs" />
      <Icon icon={ArrowRight} size="sm" />
      <Icon icon={ArrowRight} size="md" />
      <Icon icon={ArrowRight} size="lg" />
      <Icon icon={ArrowRight} size="xl" />
    </div>
  ),
};
