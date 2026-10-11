import { createFileRoute } from '@tanstack/react-router'

import RecurringPage from '#/pages/RecurringPage'

export const Route = createFileRoute('/_authenticated/recurring')({
  component: RecurringPage,
  head: () => ({
    meta: [
      { title: 'Recurring | My Finance' },
      {
        name: 'description',
        content: 'Create and manage recurring income and expense schedules.',
      },
    ],
  }),
})
