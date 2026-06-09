import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@satellite-control/ds-ui-web";

const options = [
  { value: "admin", label: "Administrator" },
  { value: "engineer", label: "Engineer" },
  { value: "viewer", label: "Viewer" },
];

const meta: Meta<typeof Select> = {
  title: "Design System/Select",
  component: Select,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
    error: { control: "text" },
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = { args: { label: "Role", options, placeholder: "Select a role" } };
export const WithValue: Story = { args: { label: "Role", options, value: "engineer" } };
export const Clearable: Story = { args: { label: "Role", options, value: "admin", clearable: true } };
export const WithError: Story = { args: { label: "Role", options, error: "Please select a role" } };
export const Disabled: Story = { args: { label: "Role", options, disabled: true } };
