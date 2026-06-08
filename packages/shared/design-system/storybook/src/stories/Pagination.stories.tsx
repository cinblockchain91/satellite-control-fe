import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "@satellite-control/ds-ui-web";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Design System/Pagination",
  component: Pagination,
  argTypes: {
    totalPages: { control: "number" },
    showFirstLast: { control: "boolean" },
    siblings: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: { page: 3, totalPages: 10, onPageChange: () => {} },
};
export const WithFirstLast: Story = {
  args: { page: 5, totalPages: 20, showFirstLast: true, onPageChange: () => {} },
};
export const FewPages: Story = { args: { page: 1, totalPages: 3, onPageChange: () => {} } };

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500">Current page: {page}</p>
        <Pagination page={page} totalPages={15} onPageChange={setPage} showFirstLast />
      </div>
    );
  },
};
