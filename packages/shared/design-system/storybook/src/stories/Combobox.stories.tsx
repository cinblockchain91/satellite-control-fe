import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "@satellite-control/ds-ui-web";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
];

const meta: Meta<typeof Combobox> = {
  title: "Design System/Combobox",
  component: Combobox,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: { label: "Framework", options, placeholder: "Search framework..." },
};
export const WithValue: Story = { args: { label: "Framework", options, value: "react" } };
export const Clearable: Story = {
  args: { label: "Framework", options, value: "vue", clearable: true },
};
export const WithError: Story = {
  args: { label: "Framework", options, error: "Please select a framework" },
};
export const Disabled: Story = { args: { label: "Framework", options, disabled: true } };
