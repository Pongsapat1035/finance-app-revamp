import { createFileRoute } from '@tanstack/react-router'

import AuthPage from '#/pages/auth/AuthPage'

export const Route = createFileRoute('/auth/')({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: 'Welcome | Ledgr' },
      {
        name: 'description',
        content: 'Track personal income and expenses in one clear dashboard.',
      },
    ],
  }),
})
