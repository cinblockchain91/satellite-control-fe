import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "@satellite-control/ds-ui-web";
import { useState } from "react";

const steps = [
  { label: "Mission details", description: "Name and objectives" },
  { label: "Satellite config", description: "Select satellite" },
  { label: "Schedule", description: "Set launch window" },
  { label: "Review", description: "Confirm and submit" },
];

const meta: Meta<typeof Stepper> = {
  title: "Design System/Stepper",
  component: Stepper,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = { args: { steps, currentStep: 1 } };
export const Step3: Story = { args: { steps, currentStep: 2 } };
export const Vertical: Story = { args: { steps, currentStep: 1, orientation: "vertical" } };

export const Interactive: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);
    return (
      <div className="flex flex-col gap-6 w-full">
        <Stepper steps={steps} currentStep={current} clickable onStepClick={setCurrent} />
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded text-sm"
            onClick={() => setCurrent(Math.max(0, current - 1))}
          >
            Back
          </button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};
