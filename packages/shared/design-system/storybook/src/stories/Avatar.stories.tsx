import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Avatar> = {
  title: "Design System/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    src: { control: "text" },
    alt: { control: "text" },
    fallback: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithFallback: Story = { args: { fallback: "JD", size: "md" } };
export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/150?img=1", alt: "User avatar", size: "md" },
};
export const ExtraSmall: Story = { args: { fallback: "AB", size: "xs" } };
export const Large: Story = { args: { fallback: "AB", size: "lg" } };
export const ExtraLarge: Story = { args: { fallback: "AB", size: "xl" } };

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar fallback="AB" size="xs" />
      <Avatar fallback="AB" size="sm" />
      <Avatar fallback="AB" size="md" />
      <Avatar fallback="AB" size="lg" />
      <Avatar fallback="AB" size="xl" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      <Avatar fallback="AB" src="https://i.pravatar.cc/150?img=1" />
      <Avatar fallback="CD" src="https://i.pravatar.cc/150?img=2" />
      <Avatar fallback="EF" src="https://i.pravatar.cc/150?img=3" />
      <Avatar fallback="GH" src="https://i.pravatar.cc/150?img=4" />
      <Avatar fallback="IJ" src="https://i.pravatar.cc/150?img=5" />
    </AvatarGroup>
  ),
};
