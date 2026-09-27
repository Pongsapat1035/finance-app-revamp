import { useState } from 'react'
import dayjs from 'dayjs'
import { CalendarDays, CircleAlert, Ellipsis, Pencil, Plus, Trash2 } from 'lucide-react'

import type { BudgetRow } from '#/api/budget/budget.type'
import BudgetFormModal from '#/components/budgets/BudgetFormModal'
import { AppPageShell } from '#/components/app-shell'
import Button from '#/components/ui/Button'
import ConfirmModal from '#/components/ui/ConfirmModal'
import DatePickerField from '#/components/ui/DatePicker'
import EmptyState from '#/components/ui/EmptyState'
import ErrorState from '#/components/ui/ErrorState'
import IconButton from '#/components/ui/IconButton'
import MetricCard from '#/components/ui/MetricCard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/DropdownMenu'
import {
  useCreateBudget,
  useDeleteBudget,
  useFetchBudget,
  useFetchExceededBudget,
  useUpdateBudget,
} from '#/hooks/useBudget'
import { useFetchUpcomingRecurringTransaction } from '#/hooks/useRecurringTransaction'
import { useToast } from '#/hooks/useToast'
import { handleAxiosError } from '#/lib/handleAxiosError'
import { formatNumber } from '#/lib/format'

const chartColors = [
  'var(--chart-blue)',
  'var(--chart-green)',
  'var(--chart-plum)',
  'var(--chart-amber)',
  'var(--chart-neutral)',
]

const categoryName = (row: BudgetRow) => row.category?.title ?? 'Uncategorized'

export default function BudgetsPage() {
  const [period, setPeriod] = useState(() => dayjs().format('YYYY-MM'))
  const [formOpen, setFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<BudgetRow | null>(null)
  const [deletingBudget, setDeletingBudget] = useState<BudgetRow | null>(null)
  const [deleteError, setDeleteError] = useState<string>()
  const { showToast } = useToast()

  const budgetQuery = useFetchBudget({ period })
  const exceededQuery = useFetchExceededBudget({ period })
  const upcomingQuery = useFetchUpcomingRecurringTransaction()
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const removeBudget = useDeleteBudget()
  const isSaving = createBudget.isPending || updateBudget.isPending

  const rows = budgetQuery.data?.data ?? []
  const summary = budgetQuery.data?.summary
  const plannedRows = rows.filter((row) => row.hasBudget)
  const exceededSummary = exceededQuery.data?.summary
  const firstExceededBudget = exceededQuery.data?.data[0]
  const upcomingCosts = upcomingQuery.data?.data ?? []
  const selectedMonth = dayjs(`${period}-01`)
  const monthLabel = selectedMonth.format('MMMM YYYY')

  const openCreate = () => {
    setEditingBudget(null)
    setFormOpen(true)
  }

  const openEdit = (row: BudgetRow) => {
    if (typeof row.id !== 'number') return
    setEditingBudget(row)
    setFormOpen(true)
  }

  const saveBudget = async (values: { categoryId: number | null; plannedAmount: number }) => {
    if (editingBudget) {
      if (typeof editingBudget.id !== 'number') return
      await updateBudget.mutateAsync({
        id: editingBudget.id,
        payload: { plannedAmount: values.plannedAmount },
      })
      showToast({
        title: 'Budget updated',
        description: `${categoryName(editingBudget)} now uses the new monthly plan.`,
      })
    } else {
      await createBudget.mutateAsync({ period, ...values })
      showToast({ title: 'Budget created', description: `The plan for ${monthLabel} was added.` })
    }

    setFormOpen(false)
    setEditingBudget(null)
  }

  const deleteSelectedBudget = async () => {
    if (typeof deletingBudget?.id !== 'number') return
    setDeleteError(undefined)

    try {
      await removeBudget.mutateAsync(deletingBudget.id)
      const name = categoryName(deletingBudget)
      setDeletingBudget(null)
      showToast({
        title: 'Budget deleted',
        description: `The ${name} plan was removed for ${monthLabel}.`,
      })
    } catch (error) {
      const { message, statusCode } = handleAxiosError(error)
      setDeleteError(statusCode === null ? 'Could not delete the budget. Try again.' : message)
    }
  }

  return (
    <AppPageShell
      activeItem="Budgets"
      searchLabel="Search budgets"
      periodControl={
        <DatePickerField
          label="Budget month"
          mode="month"
          value={period}
          onValueChange={setPeriod}
          className="w-40 gap-0 [&>label]:sr-only [&>button]:h-9 [&>button]:text-xs"
        />
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Monthly plan</p>
          <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
            Budgets
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Set category limits and see where this month&apos;s plan needs attention.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          disabled={!budgetQuery.isSuccess}
          height="h-10"
          fullWidth={false}
          prefixIcon={<Plus size={16} strokeWidth={1.75} />}
          className="whitespace-nowrap"
        >
          Create budget
        </Button>
      </div>

      <section
        className="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3"
        aria-label={`${monthLabel} budget summary`}
      >
        <MetricCard
          label="Planned"
          value={summary?.totalPlanned}
          displayValue={summary ? undefined : '—'}
          note={
            summary
              ? `Across ${formatNumber(summary.plannedBudgetCount)} budgets`
              : budgetQuery.isError
                ? 'Unavailable'
                : 'Loading monthly plan'
          }
          tone="neutral"
        />
        <MetricCard
          label="Spent"
          value={summary?.totalSpent}
          displayValue={summary ? undefined : '—'}
          note={
            summary
              ? `${formatNumber(summary.percentOfPlanned)}% of planned`
              : budgetQuery.isError
                ? 'Unavailable'
                : 'Loading monthly spending'
          }
          tone="neutral"
        />
        <MetricCard
          label="Remaining"
          value={summary?.totalRemaining}
          displayValue={summary ? undefined : '—'}
          note={`For ${monthLabel}`}
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        <section className="overflow-hidden rounded-lg border bg-background">
          <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
            <div>
              <h2 className="text-base font-medium tracking-[-0.02em]">Category budgets</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Amounts update as transactions are categorized.
              </p>
            </div>
            {budgetQuery.isSuccess && (
              <p className="text-[11px] text-muted-foreground">
                {formatNumber(summary?.plannedBudgetCount ?? 0)}{' '}
                {summary?.plannedBudgetCount === 1 ? 'plan' : 'plans'}
              </p>
            )}
          </div>
          {budgetQuery.isPending ? (
            <div className="animate-pulse divide-y" aria-label="Loading budgets">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex items-center gap-3 px-5 py-5">
                  <div className="size-9 rounded-sm bg-muted" />
                  <div className="grid flex-1 gap-2">
                    <div className="h-3 w-1/3 rounded-sm bg-muted" />
                    <div className="h-1.5 rounded-sm bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : budgetQuery.isError ? (
            <ErrorState
              title="Could not load budgets"
              description="Check your connection and try again."
              onRetry={() => void budgetQuery.refetch()}
            />
          ) : plannedRows.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={21} strokeWidth={1.75} />}
              title="No budgets for this month"
              description="Create a monthly plan for a category to track spending."
              action={
                <Button
                  type="button"
                  variant="outline"
                  height="h-10"
                  fullWidth={false}
                  onClick={openCreate}
                >
                  Create budget
                </Button>
              }
            />
          ) : (
            <div className="divide-y">
              {plannedRows.map((row, index) => (
                <BudgetCategoryRow
                  key={row.categoryId ?? 'uncategorized'}
                  row={row}
                  index={index}
                  exceededBy={
                    exceededQuery.data?.data.find(
                      (exceededRow) => exceededRow.categoryId === row.categoryId,
                    )?.exceededBy
                  }
                  onEdit={openEdit}
                  onDelete={(selected) => {
                    setDeleteError(undefined)
                    setDeletingBudget(selected)
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border bg-muted p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium">Plan health</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Based on {monthLabel} spending
                </p>
              </div>
              {exceededSummary && exceededSummary.categoryCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-sm bg-warning-soft px-2 py-1 text-[11px] font-medium text-warning-text">
                  <CircleAlert size={13} strokeWidth={1.75} /> Review
                </span>
              )}
            </div>
            <p className="mt-6 font-mono text-[28px] font-medium tracking-[-0.045em]">
              {budgetQuery.isSuccess && exceededQuery.isSuccess && exceededSummary
                ? summary?.plannedBudgetCount === 0
                  ? 'No budgets'
                  : `${formatNumber(exceededSummary.categoryCount)} ${
                      exceededSummary.categoryCount === 1 ? 'category' : 'categories'
                    }`
                : '—'}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {budgetQuery.isPending || exceededQuery.isPending
                ? 'Loading plan health.'
                : budgetQuery.isError || exceededQuery.isError
                  ? 'Plan health is unavailable.'
                  : firstExceededBudget
                    ? `${categoryName(firstExceededBudget)} is ${formatNumber(firstExceededBudget.exceededBy)} over its plan.`
                    : summary?.plannedBudgetCount === 0
                      ? 'Create a budget to compare spending with a monthly plan.'
                      : 'All planned categories are within their limits.'}
            </p>
          </section>

          <section className="overflow-hidden rounded-lg border">
            <div className="border-b px-5 py-4">
              <h2 className="text-sm font-medium">Upcoming costs</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Expected in the next 30 days</p>
            </div>
            {upcomingQuery.isPending ? (
              <p className="px-5 py-5 text-xs text-muted-foreground">Loading upcoming costs...</p>
            ) : upcomingQuery.isError ? (
              <div className="px-5 py-5 text-xs text-destructive-text">
                <p>Could not load upcoming costs.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  height="h-8"
                  fullWidth={false}
                  onClick={() => void upcomingQuery.refetch()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : upcomingCosts.length === 0 ? (
              <p className="px-5 py-5 text-xs text-muted-foreground">
                No upcoming expense schedules.
              </p>
            ) : (
              <div className="divide-y">
                {upcomingCosts.map((cost) => (
                  <div
                    key={`${cost.id}-${cost.dueDate}`}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <div>
                      <p className="text-xs font-medium">{cost.description}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {dayjs(cost.dueDate).format('MMM D')}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-xs font-medium tabular-nums">
                      {formatNumber(cost.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>

      <BudgetFormModal
        open={formOpen}
        onOpenChange={(open) => {
          if (isSaving) return
          setFormOpen(open)
          if (!open) {
            setEditingBudget(null)
          }
        }}
        period={period}
        budget={editingBudget}
        rows={rows}
        isSubmitting={isSaving}
        onSubmit={saveBudget}
      />

      <ConfirmModal
        open={deletingBudget !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingBudget(null)
        }}
        tone="destructive"
        title="Delete this budget?"
        description="The monthly plan is removed. Spending already recorded in this category stays in the month."
        details={
          deletingBudget ? (
            <div className="flex items-center justify-between gap-4">
              <span className="truncate font-medium">{categoryName(deletingBudget)}</span>
              <span className="shrink-0 font-mono font-medium tabular-nums">
                {formatNumber(deletingBudget.planned)}
              </span>
            </div>
          ) : null
        }
        confirmLabel="Delete budget"
        cancelLabel="Keep budget"
        loading={removeBudget.isPending}
        error={deleteError}
        onConfirm={deleteSelectedBudget}
      />
    </AppPageShell>
  )
}

function BudgetCategoryRow({
  row,
  index,
  exceededBy,
  onEdit,
  onDelete,
}: {
  row: BudgetRow
  index: number
  exceededBy?: number
  onEdit: (row: BudgetRow) => void
  onDelete: (row: BudgetRow) => void
}) {
  const name = categoryName(row)
  const isOverPlan = row.isOverBudget
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <article className="px-5 py-4 hover:bg-muted/55">
      <div className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3">
        <span className="grid size-9 place-items-center rounded-sm bg-muted font-mono text-[10px] font-semibold">
          {initials}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="shrink-0 font-mono text-xs font-medium tabular-nums">
              {formatNumber(row.spent)}{' '}
              <span className="text-muted-foreground">of {formatNumber(row.planned)}</span>
            </p>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-[1px] bg-muted">
            <span
              className="block h-full"
              style={{
                width: `${row.percentUsed}%`,
                backgroundColor: isOverPlan
                  ? 'var(--warning)'
                  : chartColors[index % chartColors.length],
              }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
            <span>
              {row.planned > 0 ? `${formatNumber(row.percentUsed)}% used` : 'Zero planned'}
            </span>
            <span className={isOverPlan ? 'font-medium text-warning-text' : undefined}>
              {isOverPlan
                ? exceededBy === undefined
                  ? 'Over budget'
                  : `${formatNumber(exceededBy)} over`
                : `${formatNumber(row.remaining)} left`}
            </span>
          </div>
        </div>
        {typeof row.id === 'number' ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                size="size-8"
                className="data-[state=open]:bg-muted"
                aria-label={`More options for ${name}`}
              >
                <Ellipsis size={16} strokeWidth={1.75} />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(row)}>
                <Pencil size={15} strokeWidth={1.75} /> Edit budget
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => onDelete(row)}
                className="text-destructive-text data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive-text"
              >
                <Trash2 size={15} strokeWidth={1.75} /> Delete budget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </article>
  )
}
