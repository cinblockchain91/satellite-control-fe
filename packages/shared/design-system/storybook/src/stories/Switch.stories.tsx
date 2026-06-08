import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Switch> = {
  title: "Design System/Switch",
  component: Switch,
  argTypes: {
    label: { control: "text" },
    labelPosition: { control: "select", options: ["left", "right"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = { args: { label: "Enable notifications" } };
export const Checked: Story = { args: { label: "Active", checked: true } };
export const LabelLeft: Story = { args: { label: "Dark mode", labelPosition: "left" } };
export const WithHelper: Story = {
  args: { label: "Auto-update", helperText: "Updates run at midnight" },
};
export const Disabled: Story = { args: { label: "Unavailable", disabled: true } };
