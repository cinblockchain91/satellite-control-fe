import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "@satellite-control/ds-ui-web";

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "type", header: "Type" },
  { key: "altitude", header: "Altitude (km)", sortable: true },
  { key: "status", header: "Status" },
];

const data = [
  { id: "1", name: "Starlink-1", type: "Communication", altitude: 550, status: "Active" },
  { id: "2", name: "GPS-IIF", type: "Navigation", altitude: 20200, status: "Active" },
  { id: "3", name: "Landsat-9", type: "Earth Observation", altitude: 705, status: "Idle" },
  { id: "4", name: "Hubble", type: "Science", altitude: 547, status: "Active" },
];

const meta: Meta<typeof Table> = {
  title: "Design System/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = { args: { columns, data, keyField: "id" } };
export const Loading: Story = { args: { columns, data: [], keyField: "id", loading: true } };
export const Empty: Story = {
  args: { columns, data: [], keyField: "id", emptyMessage: "No satellites found" },
};
export const WithSort: Story = {
  args: { columns, data, keyField: "id", sortKey: "altitude", sortDirection: "asc", onSort: () => {} },
};
