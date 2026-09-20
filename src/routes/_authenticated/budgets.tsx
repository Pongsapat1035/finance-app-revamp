import { createFileRoute } from '@tanstack/react-router'

import BudgetsPage from '#/pages/BudgetsPage'

export const Route = createFileRoute('/_authenticated/budgets')({
  component: BudgetsPage,
  head: () => ({
    meta: [
      { title: 'Budgets | My Finance' },
      {
        name: 'description',
        content: 'Plan monthly spending limits and review category progress.',
      },
    ],
  }),
})
