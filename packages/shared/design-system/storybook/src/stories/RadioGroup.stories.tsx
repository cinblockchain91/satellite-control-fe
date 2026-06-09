import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "@satellite-control/ds-ui-web";

const options = [
  { value: "admin", label: "Administrator" },
  { value: "engineer", label: "Engineer" },
  { value: "viewer", label: "Viewer" },
];

const meta: Meta<typeof RadioGroup> = {
  title: "Design System/RadioGroup",
  component: RadioGroup,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = { args: { label: "Role", options, defaultValue: "engineer" } };
export const Horizontal: Story = { args: { label: "Role", options, orientation: "horizontal" } };
export const WithError: Story = { args: { label: "Role", options, error: "Please select a role" } };
export const Disabled: Story = {
  args: { label: "Role", options, disabled: true, defaultValue: "viewer" },
};
