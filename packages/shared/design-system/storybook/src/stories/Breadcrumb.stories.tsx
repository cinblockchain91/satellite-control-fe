import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Breadcrumb> = {
  title: "Design System/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings" },
    ],
  },
};

export const Long: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Satellites", href: "/satellites" },
      { label: "Starlink", href: "/satellites/starlink" },
      { label: "Configuration", href: "/satellites/starlink/config" },
      { label: "Telemetry" },
    ],
    maxItems: 3,
  },
};
