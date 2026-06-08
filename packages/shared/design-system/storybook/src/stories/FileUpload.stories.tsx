import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof FileUpload> = {
  title: "Design System/FileUpload",
  component: FileUpload,
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    error: { control: "text" },
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: { label: "Upload file", onFilesChange: () => {} },
};
export const ImageOnly: Story = {
  args: {
    label: "Profile image",
    accept: "image/*",
    helperText: "PNG, JPG up to 5MB",
    onFilesChange: () => {},
  },
};
export const Multiple: Story = {
  args: { label: "Documents", multiple: true, onFilesChange: () => {} },
};
export const WithError: Story = {
  args: { label: "Required file", error: "Please upload a file", onFilesChange: () => {} },
};
export const Disabled: Story = {
  args: { label: "Disabled", disabled: true, onFilesChange: () => {} },
};
