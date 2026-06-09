import type { StoryObj } from "@storybook/react";
import { Heading, Text, Caption, Code } from "@satellite-control/ds-ui-web";

export default { title: "Design System/Typography" };

export const Headings: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading as="h1">Heading 1</Heading>
      <Heading as="h2">Heading 2</Heading>
      <Heading as="h3">Heading 3</Heading>
      <Heading as="h4">Heading 4</Heading>
    </div>
  ),
};

export const TextVariants: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text size="lg">Large text</Text>
      <Text size="base">Base text</Text>
      <Text size="sm">Small text</Text>
      <Text muted>Muted text</Text>
    </div>
  ),
};

export const CaptionVariant: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Caption>Regular caption</Caption>
      <Caption muted>Muted caption</Caption>
    </div>
  ),
};

export const CodeVariant: StoryObj = {
  render: () => <Code>const greeting = "Hello World";</Code>,
};
