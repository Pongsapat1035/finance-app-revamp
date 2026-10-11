import { useState } from 'react'
import dayjs from 'dayjs'
import {
  CalendarClock,
  CirclePause,
  CirclePlay,
  Ellipsis,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'

import type { RecurringTransaction } from '#/api/recurring-transaction/recurring-transaction.type'
import { AppPageShell } from '#/components/app-shell'
import RecurringFormModal, {
  type RecurringFormValues,
} from '#/components/recurring/RecurringFormModal'
import Button from '#/components/ui/Button'
import ConfirmModal from '#/components/ui/ConfirmModal'
import DataTable, { type DataTableColumn } from '#/components/ui/DataTable'
import MetricCard from '#/components/ui/MetricCard'
import SearchInput from '#/components/ui/SearchInput'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/DropdownMenu'
import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/Select'
import { TransactionType } from '#/enum/enum'
import { formatNumber } from '#/lib/format'
import { useFetchCategory } from '#/hooks/useCategory'
import {
  useCreateRecurringTransaction,
  useDeleteRecurringTransaction,
  useFetchRecurringTransaction,
  useFetchUpcomingRecurringTransaction,
  useUpdateRecurringTransaction,
} from '#/hooks/useRecurringTransaction'
import { handleAxiosError } from '#/lib/handleAxiosError'
import { useToast } from '#/hooks/useToast'

type StatusFilter = 'all' | 'active' | 'paused'

const PAGE_SIZE = 5

const statusLabel = (transaction: RecurringTransaction) => {
  if (!transaction.isActive) return 'Paused'
  if (transaction.endDate && dayjs(transaction.endDate).isBefore(dayjs(), 'day')) return 'Ended'
  return 'Active'
}

const formatBillingDay = (day: number) => {
  const remainder = day % 10
  const teen = day % 100
  const suffix =
    teen >= 11 && teen <= 13
      ? 'th'
      : remainder === 1
        ? 'st'
        : remainder === 2
          ? 'nd'
          : remainder === 3
            ? 'rd'
            : 'th'
  return `${day}${suffix}`
}

export default function RecurringPage() {
  const [keyword, setKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categoryKeyword, setCategoryKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<RecurringTransaction | null>(null)
  const [deleteError, setDeleteError] = useState<string>()
  const { showToast } = useToast()

  const categoryQuery = useFetchCategory({
    page: 1,
    limit: 100,
    keyword: categoryKeyword.trim() || undefined,
  })
  const categoryReady = categoryQuery.isSuccess
  const recurringQuery = useFetchRecurringTransaction(
    {
      page,
      limit: PAGE_SIZE,
      keyword: keyword.trim() || undefined,
      categoryId: categoryFilter === 'all' ? undefined : Number(categoryFilter),
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    },
    categoryReady,
  )
  const activeScheduleQuery = useFetchRecurringTransaction(
    { page: 1, limit: 1, isActive: true },
    categoryReady,
  )
  const scheduleSummaryQuery = useFetchRecurringTransaction({ page: 1, limit: 1 }, categoryReady)
  const upcomingScheduleQuery = useFetchUpcomingRecurringTransaction(categoryReady)
  const transactions = recurringQuery.data?.data ?? []
  const categories = categoryQuery.data?.data ?? []
  const totalPages = recurringQuery.data?.meta.totalPages ?? 1
  const totalSchedules = recurringQuery.data?.meta.total ?? 0
  const safePage = Math.min(page, totalPages)
  const visibleTransactions = transactions
  const activeScheduleCount = activeScheduleQuery.data?.meta.total ?? 0
  const scheduleCount = scheduleSummaryQuery.data?.meta.total ?? 0
  const expectedTotal = activeScheduleQuery.data?.meta.expectedTotal ?? 0
  const nextTransaction = upcomingScheduleQuery.data?.data[0]

  const openCreate = () => {
    setEditingTransaction(null)
    setFormOpen(true)
  }

  const openEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  const createRecurring = useCreateRecurringTransaction()
  const updateRecurring = useUpdateRecurringTransaction()
  const removeRecurring = useDeleteRecurringTransaction()
  const isSaving = createRecurring.isPending || updateRecurring.isPending
  const isLoading = categoryQuery.isPending || (categoryReady && recurringQuery.isPending)
  const fetchError = categoryQuery.isError
    ? 'Could not load categories. Check your connection and try again.'
    : recurringQuery.isError
      ? 'Could not load recurring schedules. Check your connection and try again.'
      : undefined

  const saveTransaction = async (values: RecurringFormValues) => {
    if (editingTransaction) {
      await updateRecurring.mutateAsync({ id: editingTransaction.id, payload: values })
      showToast({
        title: 'Recurring transaction updated',
        description: `${values.title} now uses the new schedule.`,
      })
    } else {
      await createRecurring.mutateAsync(values)
      showToast({
        title: 'Recurring transaction created',
        description: `${values.title} was added to your schedule.`,
      })
    }

    setFormOpen(false)
    setEditingTransaction(null)
  }

  const toggleStatus = async (transaction: RecurringTransaction) => {
    const nextActive = !transaction.isActive
    try {
      await updateRecurring.mutateAsync({
        id: transaction.id,
        payload: {
          categoryId: transaction.categoryId,
          title: transaction.title,
          description: transaction.description,
          amount: transaction.amount,
          dayOfMonth: transaction.dayOfMonth,
          startDate: transaction.startDate,
          endDate: transaction.endDate,
          isActive: nextActive,
        },
      })
      showToast({
        title: nextActive ? 'Schedule resumed' : 'Schedule paused',
        description: `${transaction.title} is now ${nextActive ? 'active' : 'paused'}.`,
      })
    } catch (error) {
      const { message, statusCode } = handleAxiosError(error)
      showToast({
        title: 'Could not update schedule',
        description: statusCode === null ? 'Try again.' : `${message}.`,
        tone: 'error',
      })
    }
  }

  const deleteTransaction = async () => {
    if (!deletingTransaction) return
    setDeleteError(undefined)

    try {
      await removeRecurring.mutateAsync(deletingTransaction.id)
      const deletedTitle = deletingTransaction.title
      setDeletingTransaction(null)
      setPage(1)
      showToast({
        title: 'Recurring transaction deleted',
        description: `${deletedTitle} was removed.`,
      })
    } catch (error) {
      const { message, statusCode } = handleAxiosError(error)
      setDeleteError(
        statusCode === null
          ? 'Could not delete the recurring transaction. Try again.'
          : `${message}. Try again.`,
      )
    }
  }

  const clearFilters = () => {
    setKeyword('')
    setCategoryFilter('all')
    setCategoryKeyword('')
    setStatusFilter('all')
    setPage(1)
  }

  const columns: DataTableColumn<RecurringTransaction>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (transaction) => (
        <>
          <p className="max-w-56 truncate font-medium">{transaction.title}</p>
          <p className="mt-0.5 max-w-56 truncate text-[11px] text-muted-foreground">
            {transaction.description || 'No description'}
          </p>
        </>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      cell: (transaction) => (
        <span className="text-muted-foreground">{transaction.category.title}</span>
      ),
    },
    {
      id: 'schedule',
      header: 'Schedule',
      cell: (transaction) => (
        <span className="text-muted-foreground">
          Monthly on the {formatBillingDay(transaction.dayOfMonth)}
        </span>
      ),
    },
    {
      id: 'next-date',
      header: 'Next date',
      className: 'font-mono text-xs tabular-nums',
      cell: (transaction) =>
        transaction.isActive ? dayjs(transaction.nextRunAt).format('MMM D, YYYY') : 'Not scheduled',
    },
    {
      id: 'amount',
      header: 'Amount',
      headerClassName: 'text-right',
      className: 'text-right font-mono font-medium tabular-nums',
      cell: (transaction) => (
        <>
          {transaction.category.type === TransactionType.INCOME ? '+' : '-'}
          {formatNumber(transaction.amount)}
        </>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (transaction) => <StatusBadge transaction={transaction} />,
    },
    {
      id: 'actions',
      header: <span className="sr-only">Actions</span>,
      headerClassName: 'w-14 px-3',
      className: 'px-3',
      cell: (transaction) => (
        <RecurringActions
          transaction={transaction}
          onEdit={openEdit}
          onToggle={toggleStatus}
          onDelete={setDeletingTransaction}
        />
      ),
    },
  ]

  return (
    <AppPageShell
      activeItem="Recurring"
      searchLabel="Search recurring transactions"
      periodLabel="Monthly schedules"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Scheduled money activity</p>
          <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
            Recurring
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage monthly income and expenses before they appear in your transaction history.
          </p>
        </div>
        <Button fullWidth={false} onClick={openCreate} prefixIcon={<Plus size={16} />}>
          Create recurring
        </Button>
      </div>

      <section
        className="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3"
        aria-label="Recurring transaction summary"
      >
        <MetricCard
          label="Expected each month"
          value={expectedTotal}
          note="Across active schedules"
          formatValue={formatNumber}
          noteClassName="truncate"
        />
        <MetricCard
          label="Active schedules"
          value={activeScheduleCount}
          note={`${formatNumber(Math.max(0, scheduleCount - activeScheduleCount))} paused`}
          tone="neutral"
          noteClassName="truncate"
        />
        <MetricCard
          label="Next scheduled"
          displayValue={nextTransaction ? dayjs(nextTransaction.dueDate).format('MMM D') : 'None'}
          note={nextTransaction?.description ?? 'No active schedules'}
          noteClassName="truncate"
        />
      </section>

      <DataTable
        rows={visibleTransactions}
        columns={columns}
        getRowKey={(transaction) => transaction.id}
        renderMobileRow={(transaction) => (
          <MobileRecurringRow
            transaction={transaction}
            onEdit={openEdit}
            onToggle={toggleStatus}
            onDelete={setDeletingTransaction}
          />
        )}
        tableClassName="min-w-[820px]"
        className="mt-6"
        header={
          <div className="flex flex-col gap-4 border-b px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-medium tracking-[-0.02em]">Recurring schedules</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Monthly schedules use a billing day between 1 and 31.
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {formatNumber(totalSchedules)} {totalSchedules === 1 ? 'schedule' : 'schedules'}
            </p>
          </div>
        }
        children={
          <div className="grid gap-3 border-b bg-muted/45 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_200px_160px]">
            <SearchInput
              value={keyword}
              onValueChange={(value) => {
                setKeyword(value)
                setPage(1)
              }}
              ariaLabel="Search recurring schedules"
              placeholder="Search name or category"
            />

            <SelectField
              label=""
              ariaLabel="Filter by category"
              size="dense"
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value)
                setPage(1)
              }}
              onSearch={setCategoryKeyword}
              options={[
                { value: 'all', label: 'All categories' },
                ...categories.map((category) => ({
                  value: String(category.id),
                  label: category.title,
                })),
              ]}
            />

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter)
                setPage(1)
              }}
            >
              <SelectTrigger size="dense" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        errorState={
          fetchError
            ? {
                description: fetchError,
                onRetry: () => {
                  if (categoryQuery.isError) void categoryQuery.refetch()
                  else void recurringQuery.refetch()
                },
              }
            : undefined
        }
        isLoading={isLoading}
        emptyState={{
          icon: <CalendarClock size={21} strokeWidth={1.75} />,
          title:
            keyword || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'No recurring schedules found'
              : 'No recurring schedules yet',
          description:
            keyword || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Change the filters or create a new recurring transaction.'
              : 'Create a schedule to plan recurring income and expenses.',
          actions: [
            {
              label: 'Clear filters',
              variant: 'outline',
              size: 'sm',
              height: 'h-9',
              onClick: clearFilters,
            },
            {
              label: 'Create recurring',
              size: 'sm',
              height: 'h-9',
              onClick: openCreate,
            },
          ],
        }}
        pagination={{
          page: safePage,
          totalPages,
          total: totalSchedules,
          pageSize: PAGE_SIZE,
          onPageChange: setPage,
        }}
      />

      <RecurringFormModal
        open={formOpen}
        transaction={editingTransaction}
        categories={categories}
        categoriesLoading={categoryQuery.isPending}
        categoriesError={
          categoryQuery.isError ? 'Categories are unavailable. Retry the page request.' : undefined
        }
        onCategorySearch={setCategoryKeyword}
        onOpenChange={(open) => {
          if (isSaving) return
          setFormOpen(open)
          if (!open) setEditingTransaction(null)
        }}
        onSubmit={saveTransaction}
        isSubmitting={isSaving}
      />

      <ConfirmModal
        open={deletingTransaction !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingTransaction(null)
        }}
        tone="destructive"
        title="Delete this recurring transaction?"
        description="The schedule is removed and will no longer appear in upcoming activity. Existing transactions are not affected."
        details={
          deletingTransaction ? (
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{deletingTransaction.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Monthly on the {formatBillingDay(deletingTransaction.dayOfMonth)}
                </p>
              </div>
              <span className="shrink-0 font-mono font-medium tabular-nums">
                {formatNumber(deletingTransaction.amount)}
              </span>
            </div>
          ) : null
        }
        confirmLabel="Delete recurring"
        cancelLabel="Keep recurring"
        loading={removeRecurring.isPending}
        error={deleteError}
        onConfirm={deleteTransaction}
      />
    </AppPageShell>
  )
}

interface RecurringRowProps {
  transaction: RecurringTransaction
  onEdit: (transaction: RecurringTransaction) => void
  onToggle: (transaction: RecurringTransaction) => void
  onDelete: (transaction: RecurringTransaction) => void
}

const StatusBadge = ({ transaction }: { transaction: RecurringTransaction }) => {
  const label = statusLabel(transaction)
  return (
    <span
      className={`inline-flex rounded-sm px-2 py-1 text-[11px] font-medium ${
        label === 'Active'
          ? 'bg-success-soft text-success-text'
          : label === 'Ended'
            ? 'bg-muted text-muted-foreground'
            : 'bg-warning-soft text-warning-text'
      }`}
    >
      {label}
    </span>
  )
}

const RecurringActions = ({
  transaction,
  onEdit,
  onToggle,
  onDelete,
  triggerClassName = 'size-9',
}: RecurringRowProps & { triggerClassName?: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Actions for ${transaction.title}`}
          className={`ds-focus-ring grid place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground ${triggerClassName}`}
        >
          <Ellipsis size={16} strokeWidth={1.75} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{transaction.title}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onEdit(transaction)}>
          <Pencil size={15} strokeWidth={1.75} /> Edit schedule
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onToggle(transaction)}>
          {transaction.isActive ? (
            <CirclePause size={15} strokeWidth={1.75} />
          ) : (
            <CirclePlay size={15} strokeWidth={1.75} />
          )}
          {transaction.isActive ? 'Pause schedule' : 'Resume schedule'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onDelete(transaction)}
          className="text-destructive-text data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive-text"
        >
          <Trash2 size={15} strokeWidth={1.75} /> Delete recurring
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const MobileRecurringRow = (props: RecurringRowProps) => {
  const { transaction } = props
  return (
    <article className="p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-muted text-foreground">
          <CalendarClock size={16} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{transaction.title}</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {transaction.category.title}
              </p>
            </div>
            <RecurringActions {...props} triggerClassName="size-11" />
          </div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground">
                Monthly on the {formatBillingDay(transaction.dayOfMonth)}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {transaction.isActive
                  ? `Next ${dayjs(transaction.nextRunAt).format('MMM D, YYYY')}`
                  : 'No upcoming date'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-medium tabular-nums">
                {transaction.category.type === TransactionType.INCOME ? '+' : '-'}
                {formatNumber(transaction.amount)}
              </p>
              <div className="mt-1.5">
                <StatusBadge transaction={transaction} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
