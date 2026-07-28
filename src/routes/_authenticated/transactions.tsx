import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { AppSidebar, AppTopBar } from '#/components/app-shell'
import TransactionSummary from '#/components/transactions/TransactionSummary'
import TransactionTable from '#/components/transactions/TransactionTable'
import TransactionModal from '#/components/transactions/TransactionModal'

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

function TransactionsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppSidebar activeItem="Transactions" />
      <AppTopBar searchLabel="Search transactions" periodLabel="July 2026" />

      <main className="lg:ml-56">
        <div className="mx-auto w-full max-w-330 px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Money activity</p>
              <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">Transactions</h1>
              <p className="mt-2 text-sm text-muted-foreground">Track income and expenses across your personal accounts.</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]"
            >
              <Plus size={16} strokeWidth={2} /> Add transaction
            </button>
          </div>

          <div className="mt-8">
            <TransactionSummary />
          </div>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium tracking-[-0.02em]">Recent activity</h2>
                <p className="mt-1 text-xs text-muted-foreground">Example transactions for the current month.</p>
              </div>
              <Link to="/" className="ds-focus-ring hidden text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground sm:block">
                Back to auth
              </Link>
            </div>
            <TransactionTable />
          </section>
        </div>
      </main>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
