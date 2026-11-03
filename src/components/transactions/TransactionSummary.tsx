import dayjs from 'dayjs'
import { ArrowDownLeft, ArrowUpRight, WalletCards } from 'lucide-react'

import type { TransactionSummaryResponse } from '#/api/summary/summary.type'
import ErrorState from '#/components/ui/ErrorState'
import MetricCard from '#/components/ui/MetricCard'
import { formatNumber } from '#/lib/format'
import { transactionPresentation } from './transactionPresentation'
import { TransactionType } from '#/enum/enum'

interface TransactionSummaryProps {
  month: string
  summary?: TransactionSummaryResponse
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

const transactionCountLabel = (count: number) =>
  `${formatNumber(count)} ${count === 1 ? 'transaction' : 'transactions'}`

const TransactionSummary = ({
  month,
  summary,
  isLoading,
  isError,
  onRetry,
}: TransactionSummaryProps) => {
  const monthLabel = dayjs(`${month}-01`).format('MMMM YYYY')
  const summaryItems = [
    {
      label: 'Net balance',
      value: summary?.net,
      note: monthLabel,
      icon: WalletCards,
    },
    {
      label: 'Income',
      value: summary?.income,
      note: summary ? transactionCountLabel(summary.incomeTransactionCount) : monthLabel,
      icon: ArrowDownLeft,
    },
    {
      label: 'Expenses',
      value: summary ? -summary.expenses : undefined,
      note: summary ? transactionCountLabel(summary.expenseTransactionCount) : monthLabel,
      icon: ArrowUpRight,
      formatValue: (value: number) => formatNumber(Math.abs(value)),
    },
    {
      label: 'Investment',
      value: summary?.investment,
      note: summary ? transactionCountLabel(summary.investmentTransactionCount) : monthLabel,
      icon: transactionPresentation[TransactionType.INVESTMENT].icon,
      tone: 'neutral' as const,
    },
  ]

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">
        {monthLabel} totals (THB). Includes all transactions for the month.
      </p>
      <section
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border xl:grid-cols-4"
        aria-label={`${monthLabel} transaction summary`}
        aria-busy={isLoading}
      >
        {isError ? (
          <ErrorState
            title="Could not load transaction summary"
            onRetry={onRetry}
            retryLabel="Retry summary"
            className="col-span-2 bg-background xl:col-span-4"
          />
        ) : (
          summaryItems.map((item) => <MetricCard key={item.label} {...item} loading={isLoading} />)
        )}
      </section>
    </div>
  )
}

export default TransactionSummary
