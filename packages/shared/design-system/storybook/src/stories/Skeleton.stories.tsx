import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Skeleton> = {
  title: "Design System/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { width: "200px", height: "16px" } };
export const Circle: Story = { args: { width: "48px", height: "48px", rounded: "full" } };

export const TextBlock: Story = {
  render: () => <SkeletonText lines={3} />,
};

export const AvatarVariant: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SkeletonAvatar size="md" />
      <SkeletonText lines={2} />
    </div>
  ),
};

export const CardVariant: Story = {
  render: () => <SkeletonCard />,
};

export const TableVariant: Story = {
  render: () => <SkeletonTable rows={4} columns={4} />,
};
