import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from 'lucide-react'

const summaryItems = [
  {
    label: 'Net balance',
    value: '$2,791.01',
    note: 'July 1-31',
    icon: CircleDollarSign,
    positive: false,
  },
  {
    label: 'Income',
    value: '$4,150.00',
    note: '2 transactions',
    icon: ArrowDownLeft,
    positive: true,
  },
  {
    label: 'Expenses',
    value: '$1,358.99',
    note: '4 transactions',
    icon: ArrowUpRight,
    positive: false,
  },
]

const TransactionSummary = () => {
  return (
    <section
      className="grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3"
      aria-label="July summary"
    >
      {summaryItems.map(({ label, value, note, icon: Icon, positive }) => (
        <article key={label} className="bg-background p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <Icon
              size={16}
              strokeWidth={1.75}
              className={positive ? 'text-success' : 'text-muted-foreground'}
            />
          </div>
          <p className="mt-5 font-mono text-[25px] font-medium tracking-[-0.045em]">{value}</p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">{note}</p>
        </article>
      ))}
    </section>
  )
}

export default TransactionSummary
