import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "@satellite-control/ds-ui-web";

const items = [
  {
    value: "item-1",
    trigger: "What is satellite control?",
    content: "Satellite control is the process of managing satellite operations including telemetry, tracking, and commanding.",
  },
  {
    value: "item-2",
    trigger: "How does telemetry work?",
    content: "Telemetry collects data from the satellite and transmits it to ground stations for analysis.",
  },
  {
    value: "item-3",
    trigger: "What is an orbit?",
    content: "An orbit is the curved path of a celestial object around another due to gravity.",
  },
];

const meta: Meta<typeof Accordion> = {
  title: "Design System/Accordion",
  component: Accordion,
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    variant: { control: "select", options: ["default", "bordered", "flush"] },
    collapsible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = { args: { items, type: "single", collapsible: true } };
export const Multiple: Story = { args: { items, type: "multiple" } };
export const Bordered: Story = { args: { items, type: "single", variant: "bordered", collapsible: true } };
export const Flush: Story = { args: { items, type: "single", variant: "flush", collapsible: true } };
