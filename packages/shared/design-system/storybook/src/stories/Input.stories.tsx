import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Input> = {
  title: "Design System/Input",
  component: Input,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Username", placeholder: "Enter username" },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "Enter email",
    error: "Email không hợp lệ",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    helperText: "Tối thiểu 8 ký tự",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Default" placeholder="Enter value" />
      <Input
        label="With error"
        placeholder="Enter value"
        error="Required field"
      />
      <Input
        label="With helper"
        placeholder="Enter value"
        helperText="Helper text here"
      />
      <Input label="Disabled" placeholder="Enter value" disabled />
    </div>
  ),
};
