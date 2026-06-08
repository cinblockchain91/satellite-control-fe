import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Alert> = {
  title: "Design System/Alert",
  component: Alert,
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "danger"] },
    title: { control: "text" },
    dismissible: { control: "boolean" },
    showIcon: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { variant: "info", title: "Information", children: "This is an informational message." },
};
export const Success: Story = {
  args: { variant: "success", title: "Success", children: "Your changes have been saved." },
};
export const Warning: Story = {
  args: { variant: "warning", title: "Warning", children: "Please review before proceeding." },
};
export const Danger: Story = {
  args: { variant: "danger", title: "Error", children: "Something went wrong. Please try again." },
};
export const Dismissible: Story = {
  args: {
    variant: "info",
    title: "Dismissible",
    children: "Click X to close.",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-full max-w-lg">
      <Alert variant="info" title="Info">Informational message</Alert>
      <Alert variant="success" title="Success">Operation completed</Alert>
      <Alert variant="warning" title="Warning">Proceed with caution</Alert>
      <Alert variant="danger" title="Error">An error occurred</Alert>
    </div>
  ),
};
