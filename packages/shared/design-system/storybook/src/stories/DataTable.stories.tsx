import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "@satellite-control/ds-ui-web";

const columns = [
  { key: "name", header: "Name" },
  { key: "type", header: "Type" },
  { key: "altitude", header: "Altitude (km)" },
  { key: "status", header: "Status" },
];

const data = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `Satellite-${i + 1}`,
  type: ["Communication", "Navigation", "Science"][i % 3],
  altitude: 400 + i * 50,
  status: i % 4 === 0 ? "Idle" : "Active",
}));

const meta: Meta<typeof DataTable> = {
  title: "Design System/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = { args: { columns, data, keyField: "id" } };
export const Searchable: Story = {
  args: {
    columns,
    data,
    keyField: "id",
    searchable: true,
    searchPlaceholder: "Search satellites...",
  },
};
export const SmallPage: Story = { args: { columns, data, keyField: "id", pageSize: 5 } };
