import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardContent, CardFooter, Button } from "@satellite-control/ds-ui-web";

const meta: Meta<typeof Card> = {
  title: "Design System/Card",
  component: Card,
  argTypes: {
    hoverable: { control: "boolean" },
    clickable: { control: "boolean" },
    selected: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader title="Card title" description="Card description" />
      <CardContent>Card body content goes here.</CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card hoverable className="w-80">
      <CardHeader title="Hoverable card" />
      <CardContent>Hover to see the effect.</CardContent>
    </Card>
  ),
};

export const Selected: Story = {
  render: () => (
    <Card selected clickable className="w-80">
      <CardHeader title="Selected card" />
      <CardContent>This card is selected.</CardContent>
    </Card>
  ),
};
