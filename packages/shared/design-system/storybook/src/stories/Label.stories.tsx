import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Label> = {
  title: "Design System/Label",
  component: Label,
  argTypes: {
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = { args: { children: "Field label" } };
export const Required: Story = { args: { children: "Required field", required: true } };
export const Disabled: Story = { args: { children: "Disabled field", disabled: true } };
