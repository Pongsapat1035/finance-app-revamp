import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Plus,
  ReceiptText,
  Search,
} from 'lucide-react'
import TransactionActionsMenu from '#/components/transactions/TransactionActionsMenu'
import Button from '#/components/ui/Button'
import { formatCurrency } from '#/lib/format'
import { TransactionType } from '#/enum/enum'
import type { NormalizedTransaction } from '#/api/transaction/transaction.type'
import type { PaginationMeta } from '#/api/types'
import dayjs from 'dayjs'

const Filters = () => {
  return (
    <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1 sm:max-w-xs">
        <span className="sr-only">Search transaction list</span>
        <Search
          className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground"
          size={15}
          strokeWidth={1.75}
        />
        <input
          type="search"
          placeholder="Search name or category"
          className="ds-focus-ring h-9 w-full rounded-sm border border-input bg-background pl-9 pr-3 text-xs placeholder:text-muted-foreground"
        />
      </label>
      {['All types', 'All categories', 'This month'].map((label, index) => (
        <button
          key={label}
          type="button"
          className="ds-focus-ring ds-interactive flex h-9 items-center justify-between gap-3 rounded-sm border bg-background px-3 text-xs font-medium hover:bg-muted sm:justify-start"
        >
          {index === 2 && <CalendarDays size={14} strokeWidth={1.75} />}
          {label}
          <ChevronDown size={14} strokeWidth={1.75} className="text-muted-foreground" />
        </button>
      ))}
    </div>
  )
}

interface TransactionRowProps {
  transaction: NormalizedTransaction
  onEdit: (transaction: NormalizedTransaction) => void
  onDelete: (transaction: NormalizedTransaction) => void
}

const MobileTransactionRow = ({ transaction, onEdit, onDelete }: TransactionRowProps) => {
  const isIncome = transaction.type === TransactionType.INCOME
  const formattedDate = dayjs(transaction.date).format('MMM D, YYYY')
  return (
    <article className="flex items-center gap-3 p-4">
      <div
        className={`grid size-9 shrink-0 place-items-center rounded-sm ${isIncome ? 'bg-success-soft text-success' : 'bg-muted text-foreground'}`}
      >
        {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{transaction.description}</p>
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          {transaction.categoryTitle} · {formattedDate}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <p className={`font-mono text-xs tabular-nums ${isIncome ? 'text-success' : ''}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
        <TransactionActionsMenu
          merchant={transaction.description}
          triggerClassName="size-11"
          onEdit={() => onEdit(transaction)}
          onDelete={() => onDelete(transaction)}
        />
      </div>
    </article>
  )
}

const DesktopTransactionRow = ({ transaction, onEdit, onDelete }: TransactionRowProps) => {
  const isIncome = transaction.type === TransactionType.INCOME
  const formattedDate = dayjs(transaction.date).format('MMM D, YYYY')
  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/65">
      <td className="px-4 py-3.5 font-medium">{transaction.description}</td>
      <td className="px-4 py-3.5 text-muted-foreground">{transaction.categoryTitle}</td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs ${isIncome ? 'text-success' : 'text-foreground'}`}
        >
          {isIncome ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </td>
      <td className="px-4 py-3.5 text-muted-foreground">{formattedDate}</td>
      <td
        className={`px-4 py-3.5 text-right font-mono tabular-nums ${isIncome ? 'text-success' : ''}`}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </td>
      <td className="px-3 py-3.5">
        <TransactionActionsMenu
          merchant={transaction.description}
          onEdit={() => onEdit(transaction)}
          onDelete={() => onDelete(transaction)}
        />
      </td>
    </tr>
  )
}

interface TransactionTableProps {
  transactions: NormalizedTransaction[]
  meta?: PaginationMeta
  page: number
  onPageChange: (page: number) => void
  onEdit: (transaction: NormalizedTransaction) => void
  onDelete: (transaction: NormalizedTransaction) => void
  onAdd: () => void
  isLoading?: boolean
}

const TransactionTable = ({
  transactions,
  meta,
  page,
  onPageChange,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: TransactionTableProps) => {
  if (!isLoading && transactions.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border bg-background">
        <section
          className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center"
          aria-labelledby="transactions-empty-title"
        >
          <span className="grid size-10 place-items-center rounded-sm bg-muted text-muted-foreground">
            <ReceiptText size={19} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h3 id="transactions-empty-title" className="mt-5 text-base font-medium">
            No transactions yet
          </h3>
          <p className="mt-2 max-w-sm text-[13px] leading-5 text-muted-foreground">
            Add your first income or expense to start tracking money activity.
          </p>
          <Button
            type="button"
            variant="dark"
            height="h-10"
            fullWidth={false}
            prefixIcon={<Plus size={15} strokeWidth={1.75} aria-hidden="true" />}
            className="mt-5"
            onClick={onAdd}
          >
            Add transaction
          </Button>
        </section>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Filters />
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-muted text-[11px] font-medium text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="w-12 px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {transactions.map((transaction) => (
              <DesktopTransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y md:hidden">
        {transactions.map((transaction) => (
          <MobileTransactionRow
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <footer className="flex items-center justify-between border-t px-4 py-3 text-[11px] text-muted-foreground">
        <p>
          Showing {transactions.length} of {meta?.total ?? 0} transactions
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            height="h-8"
            padding="px-2.5"
            fullWidth={false}
            disabled={page <= 1}
            className={page <= 1 ? 'opacity-45' : undefined}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            height="h-8"
            padding="px-2.5"
            fullWidth={false}
            disabled={meta ? page >= meta.totalPages : true}
            className={meta && page >= meta.totalPages ? 'opacity-45' : undefined}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default TransactionTable
