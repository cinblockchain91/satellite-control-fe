import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof ContextMenu> = {
  title: "Design System/ContextMenu",
  component: ContextMenu,
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  args: {
    trigger: (
      <div className="w-64 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-gray-500 cursor-context-menu select-none">
        Right-click here
      </div>
    ),
    items: [
      { type: "item", label: "View details", onClick: () => {} },
      { type: "item", label: "Edit", onClick: () => {} },
      { type: "separator" },
      { type: "item", label: "Delete", destructive: true, onClick: () => {} },
    ],
  },
};
