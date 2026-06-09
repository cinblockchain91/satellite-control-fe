import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Textarea> = {
  title: "Design System/Textarea",
  component: Textarea,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    maxLength: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { label: "Description", placeholder: "Enter description..." } };
export const WithError: Story = { args: { label: "Notes", error: "This field is required" } };
export const WithHelperText: Story = {
  args: { label: "Bio", helperText: "Max 500 characters", maxLength: 500 },
};
export const Disabled: Story = {
  args: { label: "Readonly", defaultValue: "Cannot be edited", disabled: true },
};
