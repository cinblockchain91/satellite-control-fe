import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Checkbox> = {
  title: "Design System/Checkbox",
  component: Checkbox,
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { label: "Accept terms and conditions" } };
export const Checked: Story = { args: { label: "Checked by default", checked: true } };
export const Indeterminate: Story = { args: { label: "Indeterminate state", checked: "indeterminate" } };
export const WithError: Story = { args: { label: "Required checkbox", error: "You must accept" } };
export const Disabled: Story = { args: { label: "Disabled", disabled: true } };

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Option one" />
      <Checkbox label="Option two" checked />
      <Checkbox label="Option three (disabled)" disabled />
    </div>
  ),
};
