import type { StoryObj } from "@storybook/react";
import { ErrorBoundary, DefaultErrorFallback } from "@satellite-control/ds-ui-web";

const ThrowingComponent = () => {
  throw new Error("Simulated render error");
};

export default { title: "Design System/ErrorBoundary" };

export const WithError: StoryObj = {
  render: () => (
    <ErrorBoundary>
      <ThrowingComponent />
    </ErrorBoundary>
  ),
};

export const WithDetails: StoryObj = {
  render: () => (
    <ErrorBoundary showDetails>
      <ThrowingComponent />
    </ErrorBoundary>
  ),
};

export const CustomFallback: StoryObj = {
  render: () => (
    <ErrorBoundary
      fallback={
        <div className="p-4 border border-red-200 rounded bg-red-50 text-red-700 text-sm">
          Custom error UI
        </div>
      }
    >
      <ThrowingComponent />
    </ErrorBoundary>
  ),
};

export const DefaultFallbackPreview: StoryObj = {
  render: () => <DefaultErrorFallback error={new Error("Something broke")} />,
};
