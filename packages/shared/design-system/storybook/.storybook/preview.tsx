import type { Preview } from '@storybook/react'
import { TooltipProvider } from '@satellite-control/ds-ui-web'
import { Toaster } from '@satellite-control/ds-ui-web'
import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'gray', value: '#f9fafb' },
        { name: 'dark', value: '#111827' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-4">
          <Story />
        </div>
        <Toaster />
      </TooltipProvider>
    ),
  ],
}

export default preview
