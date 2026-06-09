import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof StatCard> = {
  title: "Design System/StatCard",
  component: StatCard,
  argTypes: {
    trend: { control: "select", options: ["up", "down", "neutral"] },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: { label: "Total Revenue", value: "$12,345", description: "Last 30 days" },
};
export const TrendUp: Story = {
  args: { label: "Active Users", value: "1,234", trend: "up", trendValue: "+12%", description: "vs last month" },
};
export const TrendDown: Story = {
  args: { label: "Churn Rate", value: "2.4%", trend: "down", trendValue: "-0.3%", description: "vs last month" },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Revenue" value="$12,345" trend="up" trendValue="+8%" />
      <StatCard label="Users" value="1,234" trend="up" trendValue="+12%" />
      <StatCard label="Churn" value="2.4%" trend="down" trendValue="-0.3%" />
    </div>
  ),
};
