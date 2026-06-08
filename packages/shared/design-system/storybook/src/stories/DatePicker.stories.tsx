import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof DatePicker> = {
  title: "Design System/DatePicker",
  component: DatePicker,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = { args: { label: "Launch Date", placeholder: "Select date" } };
export const WithValue: Story = {
  args: { label: "Launch Date", value: new Date("2025-06-15") },
};
export const WithError: Story = { args: { label: "Launch Date", error: "Date is required" } };
export const Disabled: Story = { args: { label: "Launch Date", disabled: true } };
export const WithRange: Story = {
  args: {
    label: "Mission Date",
    minDate: new Date("2025-01-01"),
    maxDate: new Date("2025-12-31"),
    helperText: "Must be within 2025",
  },
};
