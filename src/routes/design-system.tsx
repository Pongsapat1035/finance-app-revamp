import { createFileRoute } from '@tanstack/react-router'

import DesignSystemPage from '#/pages/DesignSystemPage'

export const Route = createFileRoute('/design-system')({
  component: DesignSystemPage,
  head: () => ({
    meta: [
      { title: 'Design system | Ledgr' },
      {
        name: 'description',
        content: 'The visual language and interface tokens for the finance product.',
      },
    ],
  }),
})
