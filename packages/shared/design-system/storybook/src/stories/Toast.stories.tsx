import type { StoryObj } from "@storybook/react";
import { toast, Button } from "@satellite-control/ds-ui-web";

export default { title: "Design System/Toast" };

export const ToastVariants: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => toast("Default notification")}>
        Default
      </Button>
      <Button variant="secondary" onClick={() => toast.success("Operation successful!")}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast.error("Something went wrong.")}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast.warning("Proceed with caution.")}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast.info("Just letting you know.")}>
        Info
      </Button>
      <Button variant="secondary" onClick={() => toast.loading("Processing...")}>
        Loading
      </Button>
    </div>
  ),
};
