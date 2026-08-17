import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { AppSidebar, AppTopBar } from '#/components/app-shell'
import TransactionSummary from '#/components/transactions/TransactionSummary'
import TransactionTable from '#/components/transactions/TransactionTable'
import TransactionModal from '#/components/transactions/TransactionModal'
import { useFetchCategory } from '#/hooks/useCategory'
import Button from '#/components/ui/Button'
import { useDeleteTransaction, useFetchTransaction } from '#/hooks/useTransaction'
import ConfirmModal from '#/components/ui/ConfirmModal'
import Toast, { type ToastTone } from '#/components/ui/Toast'
import type { NormalizedTransaction } from '#/api/transaction/transaction.type'
import { TransactionType } from '#/enum/enum'
import { formatCurrency } from '#/lib/format'
import { handleAxiosError } from '#/lib/handleAxiosError'

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
  const [editingTransaction, setEditingTransaction] = useState<NormalizedTransaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<NormalizedTransaction | null>(null)
  const [deleteError, setDeleteError] = useState<string>()
  const [toast, setToast] = useState<{
    id: number
    title: string
    description: string
    tone: ToastTone
  } | null>(null)
  const [page, setPage] = useState(1)
  const { data: categories } = useFetchCategory({ page: 1, limit: 10 })
  const { data: transactions, isPending: transactionsLoading } = useFetchTransaction({
    page,
    limit: 10,
  })
  const deleteTransaction = useDeleteTransaction()

  const showSuccessToast = (title: string, description: string) => {
    setToast({ id: Date.now(), title, description, tone: 'success' })
  }

  const openCreateModal = () => {
    setEditingTransaction(null)
    setModalOpen(true)
  }

  const openEditModal = (transaction: NormalizedTransaction) => {
    setEditingTransaction(transaction)
    setModalOpen(true)
  }

  const closeTransactionModal = () => {
    setModalOpen(false)
    setEditingTransaction(null)
  }

  const closeDeleteDialog = () => {
    if (deleteTransaction.isPending) return
    setTransactionToDelete(null)
    setDeleteError(undefined)
  }

  const handleDelete = async () => {
    if (!transactionToDelete) return

    setDeleteError(undefined)

    try {
      await deleteTransaction.mutateAsync(transactionToDelete.id)
      const deletedDescription = transactionToDelete.description || 'Transaction'
      const shouldGoToPreviousPage = (transactions?.data.length ?? 0) === 1 && page > 1

      setTransactionToDelete(null)
      if (shouldGoToPreviousPage) setPage((currentPage) => currentPage - 1)
      showSuccessToast('Transaction deleted', `${deletedDescription} was removed.`)
    } catch (error) {
      const { message, statusCode } = handleAxiosError(error)
      setDeleteError(
        statusCode === null
          ? 'Could not delete the transaction. Try again.'
          : `${message}. Try again.`,
      )
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppSidebar activeItem="Transactions" />
      <AppTopBar
        activeItem="Transactions"
        searchLabel="Search transactions"
        periodLabel="July 2026"
      />

      <main className="lg:ml-56">
        <div className="mx-auto w-full max-w-330 px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Money activity</p>
              <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
                Transactions
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Track income and expenses across your personal accounts.
              </p>
            </div>
            <Button fullWidth={false} onClick={openCreateModal} prefixIcon={<Plus size={16} />}>
              Add transaction
            </Button>
          </div>

          <div className="mt-8">
            <TransactionSummary />
          </div>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium tracking-[-0.02em]">Recent activity</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Example transactions for the current month.
                </p>
              </div>
            </div>
            <TransactionTable
              transactions={transactions?.data ?? []}
              meta={transactions?.meta}
              page={page}
              onPageChange={setPage}
              onEdit={openEditModal}
              onAdd={openCreateModal}
              isLoading={transactionsLoading}
              onDelete={(transaction) => {
                setDeleteError(undefined)
                setTransactionToDelete(transaction)
              }}
            />
          </section>
        </div>
      </main>

      <TransactionModal
        open={modalOpen}
        categories={categories?.data}
        transaction={editingTransaction}
        onClose={closeTransactionModal}
        onSuccess={(mode) =>
          showSuccessToast(
            mode === 'edit' ? 'Transaction updated' : 'Transaction added',
            mode === 'edit'
              ? 'Your changes are now reflected in the transaction list.'
              : 'The transaction is now included in your activity.',
          )
        }
      />

      <ConfirmModal
        open={!!transactionToDelete}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog()
        }}
        tone="destructive"
        title="Delete this transaction?"
        description="The transaction is removed from your activity and cannot be restored."
        details={
          transactionToDelete ? (
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {transactionToDelete.description || 'Transaction'}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {transactionToDelete.categoryTitle} ·{' '}
                  {transactionToDelete.type === TransactionType.INCOME ? 'Income' : 'Expense'}
                </p>
              </div>
              <span className="shrink-0 font-mono font-medium tabular-nums">
                {formatCurrency(transactionToDelete.amount)}
              </span>
            </div>
          ) : null
        }
        confirmLabel="Delete transaction"
        cancelLabel="Keep transaction"
        loading={deleteTransaction.isPending}
        error={deleteError}
        onConfirm={handleDelete}
      />

      {toast && (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
