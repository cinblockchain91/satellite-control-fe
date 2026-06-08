import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Slider> = {
  title: "Design System/Slider",
  component: Slider,
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    showValue: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = { args: { label: "Volume", value: [50], min: 0, max: 100 } };
export const WithValue: Story = {
  args: { label: "Threshold", value: [70], showValue: true, min: 0, max: 100 },
};
export const WithStep: Story = {
  args: { label: "Step (10)", value: [40], step: 10, min: 0, max: 100 },
};
export const Disabled: Story = { args: { label: "Disabled", value: [30], disabled: true } };
export const WithFormatter: Story = {
  args: {
    label: "Budget",
    value: [500],
    min: 0,
    max: 1000,
    showValue: true,
    formatValue: (v: number) => `$${v}`,
  },
};
