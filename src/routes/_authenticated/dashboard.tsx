import { createFileRoute } from '@tanstack/react-router'

import DashboardPage from '#/pages/DashboardPage'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: 'Dashboard | Ledgr' },
      {
        name: 'description',
        content: 'A monthly and yearly overview of personal income and expenses.',
      },
    ],
  }),
})
