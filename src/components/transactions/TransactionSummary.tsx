import { ArrowDownLeft, ArrowUpRight, WalletCards } from 'lucide-react'

import MetricCard from '#/components/ui/MetricCard'
import { formatCurrency } from '#/lib/format'

const summaryItems = [
  {
    label: 'Net balance',
    value: 2791.01,
    note: 'July 1-31',
    icon: WalletCards,
  },
  {
    label: 'Income',
    value: 4150,
    note: '2 transactions',
    icon: ArrowDownLeft,
  },
  {
    label: 'Expenses',
    value: -1358.99,
    note: '4 transactions',
    icon: ArrowUpRight,
  },
]

const TransactionSummary = () => {
  return (
    <section
      className="grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3"
      aria-label="July summary"
    >
      {summaryItems.map((item) => (
        <MetricCard
          key={item.label}
          {...item}
          className="p-5 sm:p-6"
          valueClassName="text-[25px]"
          formatValue={(value) => formatCurrency(Math.abs(value))}
        />
      ))}
    </section>
  )
}

export default TransactionSummary
