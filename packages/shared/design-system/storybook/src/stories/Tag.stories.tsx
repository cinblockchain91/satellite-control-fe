import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Tag> = {
  title: "Design System/Tag",
  component: Tag,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { children: "Technology" } };
export const Removable: Story = {
  args: { children: "Removable tag", onRemove: () => alert("Removed") },
};
export const Disabled: Story = {
  args: { children: "Disabled tag", disabled: true, onRemove: () => {} },
};

export const TagList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag onRemove={() => {}}>Removable</Tag>
      <Tag disabled>Disabled</Tag>
    </div>
  ),
};
