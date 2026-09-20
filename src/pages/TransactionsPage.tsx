import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Plus, ReceiptText } from 'lucide-react'

import { AppSidebar, AppTopBar } from '#/components/app-shell'
import TransactionActionsMenu from '#/components/transactions/TransactionActionsMenu'
import TransactionModal from '#/components/transactions/TransactionModal'
import TransactionSummary from '#/components/transactions/TransactionSummary'
import { useFetchCategory } from '#/hooks/useCategory'
import Button from '#/components/ui/Button'
import DataTable, { type DataTableColumn } from '#/components/ui/DataTable'
import SearchInput from '#/components/ui/SearchInput'
import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/Select'
import { useDeleteTransaction, useFetchTransaction } from '#/hooks/useTransaction'
import ConfirmModal from '#/components/ui/ConfirmModal'
import Toast, { type ToastTone } from '#/components/ui/Toast'
import type { NormalizedTransaction } from '#/api/transaction/transaction.type'
import type { Category } from '#/api/category/category.type'
import { TransactionType } from '#/enum/enum'
import { formatCurrency } from '#/lib/format'
import { handleAxiosError } from '#/lib/handleAxiosError'
import dayjs from 'dayjs'

interface TransactionFiltersProps {
  keyword: string
  onKeywordChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  onCategorySearch: (keyword: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  categories: Category[]
}

const TransactionFilters = ({
  keyword,
  onKeywordChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onCategorySearch,
  dateFilter,
  onDateFilterChange,
  categories,
}: TransactionFiltersProps) => {
  const filteredCategories = useMemo(() => {
    if (typeFilter === 'all') return categories
    return categories.filter((category) => category.type === typeFilter)
  }, [categories, typeFilter])

  return (
    <div className="grid gap-3 border-b bg-muted/45 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_160px_180px_160px]">
      <SearchInput
        value={keyword}
        onValueChange={onKeywordChange}
        ariaLabel="Search transactions"
        placeholder="Search name or category"
      />

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger size="dense" aria-label="Filter by type">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
          <SelectItem value={TransactionType.EXPEND}>Expense</SelectItem>
          <SelectItem value={TransactionType.INVESTMENT}>Investment</SelectItem>
        </SelectContent>
      </Select>

      <SelectField
        label=""
        ariaLabel="Filter by category"
        size="dense"
        value={categoryFilter}
        onValueChange={onCategoryFilterChange}
        onSearch={onCategorySearch}
        options={[
          { value: 'all', label: 'All categories' },
          ...filteredCategories.map((category) => ({ value: String(category.id), label: category.title })),
        ]}
      />

      <Select value={dateFilter} onValueChange={onDateFilterChange}>
        <SelectTrigger size="dense" aria-label="Filter by date">
          <span className="flex items-center gap-1.5 truncate">
            <CalendarDays size={14} strokeWidth={1.75} className="shrink-0 text-muted-foreground" />
            <SelectValue placeholder="All time" />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="this_month">This month</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
          <SelectItem value="this_year">This year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

const TransactionMobileRow = ({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: NormalizedTransaction
  onEdit: (transaction: NormalizedTransaction) => void
  onDelete: (transaction: NormalizedTransaction) => void
}) => {
  const isIncome = transaction.type === TransactionType.INCOME

  return (
    <article className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{transaction.description}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{transaction.categoryTitle}</span>
            <span className="size-1 rounded-full bg-border" />
            <span>{dayjs(transaction.date).format('MMM D, YYYY')}</span>
          </div>
        </div>
        <TransactionActionsMenu
          merchant={transaction.description}
          onEdit={() => onEdit(transaction)}
          onDelete={() => onDelete(transaction)}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span
          className={`inline-flex items-center gap-1.5 ${isIncome ? 'text-success-text' : 'text-muted-foreground'}`}
        >
          {isIncome ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
          {isIncome ? 'Income' : 'Expense'}
        </span>
        <span className={`font-mono font-medium tabular-nums ${isIncome ? 'text-success-text' : ''}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
      </div>
    </article>
  )
}

export default function TransactionsPage() {
  const [keyword, setKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categoryKeyword, setCategoryKeyword] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
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
  const {
    data: categories,
    isPending: categoriesLoading,
    isError: categoriesFailed,
    refetch: refetchCategories,
  } = useFetchCategory({ page: 1, limit: 100, keyword: categoryKeyword.trim() || undefined })

  const categoriesList = categories?.data ?? []

  const handleTypeChange = (newType: string) => {
    setTypeFilter(newType)
    setPage(1)
    if (categoryFilter !== 'all') {
      const isStillValid = categoriesList.some(
        (cat) => String(cat.id) === categoryFilter && (newType === 'all' || cat.type === newType),
      )
      if (!isStillValid) {
        setCategoryFilter('all')
      }
    }
  }

  const handleClearFilters = () => {
    setKeyword('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setCategoryKeyword('')
    setDateFilter('all')
    setPage(1)
  }

  const {
    data: transactions,
    isPending: transactionsLoading,
    isError: transactionsFailed,
    refetch: refetchTransactions,
  } = useFetchTransaction({
    page,
    limit: 10,
    keyword: keyword.trim() || undefined,
    type: typeFilter === 'all' ? undefined : (typeFilter as TransactionType),
    categoryId: categoryFilter === 'all' ? undefined : Number(categoryFilter),
    dateFilter,
  })
  const deleteTransaction = useDeleteTransaction()
  const visibleTransactions = transactions?.data ?? []
  const hasActiveFilters = Boolean(
    keyword || typeFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all',
  )
  const showFilters = visibleTransactions.length > 0 || hasActiveFilters
  const columns: DataTableColumn<NormalizedTransaction>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (transaction) => <span className="font-medium">{transaction.description}</span>,
    },
    {
      id: 'category',
      header: 'Category',
      cell: (transaction) => <span className="text-muted-foreground">{transaction.categoryTitle}</span>,
    },
    {
      id: 'type',
      header: 'Type',
      cell: (transaction) => {
        const isIncome = transaction.type === TransactionType.INCOME
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-xs ${isIncome ? 'text-success-text' : 'text-foreground'}`}
          >
            {isIncome ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
            {isIncome ? 'Income' : 'Expense'}
          </span>
        )
      },
    },
    {
      id: 'date',
      header: 'Date',
      cell: (transaction) => (
        <span className="text-muted-foreground">{dayjs(transaction.date).format('MMM D, YYYY')}</span>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      headerClassName: 'text-right',
      className: 'text-right font-mono tabular-nums',
      cell: (transaction) => {
        const isIncome = transaction.type === TransactionType.INCOME
        return (
          <span className={isIncome ? 'text-success-text' : undefined}>
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: <span className="sr-only">Actions</span>,
      headerClassName: 'w-12 px-3',
      className: 'px-3',
      cell: (transaction) => (
        <TransactionActionsMenu
          merchant={transaction.description}
          onEdit={() => openEditModal(transaction)}
          onDelete={() => {
            setDeleteError(undefined)
            setTransactionToDelete(transaction)
          }}
        />
      ),
    },
  ]

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
    setTransactionToDelete(null)
    setDeleteError(undefined)
  }

  const handleDelete = async () => {
    if (!transactionToDelete) return

    try {
      await deleteTransaction.mutateAsync(transactionToDelete.id)
      closeDeleteDialog()
      showSuccessToast('Transaction deleted', 'The record was removed from your history.')
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
    <div className="min-h-screen bg-background text-foreground">
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
            <DataTable
              rows={visibleTransactions}
              columns={columns}
              getRowKey={(transaction) => transaction.id}
              renderMobileRow={(transaction) => (
                <TransactionMobileRow
                  transaction={transaction}
                  onEdit={openEditModal}
                  onDelete={(selectedTransaction) => {
                    setDeleteError(undefined)
                    setTransactionToDelete(selectedTransaction)
                  }}
                />
              )}
              tableClassName="min-w-180"
              children={
                showFilters ? (
                  <TransactionFilters
                    keyword={keyword}
                    onKeywordChange={(value) => {
                      setKeyword(value)
                      setPage(1)
                    }}
                    typeFilter={typeFilter}
                    onTypeFilterChange={handleTypeChange}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={(value) => {
                      setCategoryFilter(value)
                      setPage(1)
                    }}
                    onCategorySearch={setCategoryKeyword}
                    dateFilter={dateFilter}
                    onDateFilterChange={(value) => {
                      setDateFilter(value)
                      setPage(1)
                    }}
                    categories={categoriesList}
                  />
                ) : undefined
              }
              isLoading={transactionsLoading}
              errorState={
                transactionsFailed
                  ? {
                      description: 'Could not load transactions. Check your connection and try again.',
                      onRetry: () => void refetchTransactions(),
                    }
                  : undefined
              }
              emptyState={{
                icon: <ReceiptText size={19} strokeWidth={1.75} />,
                title: hasActiveFilters ? 'No transactions found' : 'No transactions yet',
                description: hasActiveFilters
                  ? 'Change the filters or add a new transaction.'
                  : 'Add your first income or expense to start tracking money activity.',
                actions: hasActiveFilters
                  ? [
                      {
                        label: 'Clear filters',
                        variant: 'outline',
                        size: 'sm',
                        height: 'h-9',
                        onClick: handleClearFilters,
                      },
                      {
                        label: 'Add transaction',
                        size: 'sm',
                        height: 'h-9',
                        onClick: openCreateModal,
                      },
                    ]
                  : [
                      {
                        label: 'Add transaction',
                        variant: 'dark',
                        height: 'h-10',
                        icon: Plus,
                        onClick: openCreateModal,
                      },
                    ],
              }}
              pagination={
                transactions?.meta
                  ? {
                      page,
                      totalPages: transactions.meta.totalPages,
                      total: transactions.meta.total,
                      pageSize: transactions.meta.limit,
                      itemName: 'transactions',
                      onPageChange: setPage,
                    }
                  : undefined
              }
            />
          </section>
        </div>
      </main>

      <TransactionModal
        open={modalOpen}
        categories={categories?.data}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesFailed ? 'Check your connection and try again.' : undefined}
        onSearchCategories={setCategoryKeyword}
        onRetryCategories={() => void refetchCategories()}
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
