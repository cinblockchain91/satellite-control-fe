import type { Meta, StoryObj } from "@storybook/react";
import { LoadingOverlay, Card, CardContent } from "@satellite-control/ds-ui-web";
import { useState } from "react";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Design System/LoadingOverlay",
  component: LoadingOverlay,
  argTypes: {
    loading: { control: "boolean" },
    label: { control: "text" },
    blur: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Default: Story = {
  render: () => (
    <LoadingOverlay loading label="Loading data...">
      <div className="w-80 h-40 flex items-center justify-center border rounded-lg text-gray-400">
        Content underneath
      </div>
    </LoadingOverlay>
  ),
};

export const WithBlur: Story = {
  render: () => (
    <LoadingOverlay loading blur label="Processing...">
      <div className="w-80 h-40 flex items-center justify-center border rounded-lg text-gray-700 font-medium">
        Blurred content
      </div>
    </LoadingOverlay>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    return (
      <LoadingOverlay loading={loading} label="Fetching data...">
        <Card className="w-80">
          <CardContent>
            <p className="mb-3 text-sm">Click to simulate loading.</p>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 2000);
              }}
            >
              Load
            </button>
          </CardContent>
        </Card>
      </LoadingOverlay>
    );
  },
};
