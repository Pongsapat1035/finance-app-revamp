import { createFileRoute } from '@tanstack/react-router'

import TransactionsPage from '#/pages/TransactionsPage'

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPage,
  head: () => ({
    meta: [
      { title: 'Transactions | My Finance' },
      {
        name: 'description',
        content: 'Review personal income and expenses and add new transactions.',
      },
    ],
  }),
})
