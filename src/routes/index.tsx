import { createFileRoute } from '@tanstack/react-router'

import HomePage from '#/pages/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Ledgr | Personal finance, clearly organized' },
      {
        name: 'description',
        content: 'Ledgr brings your income, expenses, and savings into one clear picture.',
      },
    ],
  }),
})
