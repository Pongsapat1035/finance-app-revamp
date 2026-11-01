import dayjs from 'dayjs'

import type { NormalizedTransaction } from '#/api/transaction/transaction.type'
import { TransactionType } from '#/enum/enum'
import { formatNumber } from '#/lib/format'
import { transactionPresentation } from './transactionPresentation'

type RecentTransaction = Pick<
  NormalizedTransaction,
  'id' | 'type' | 'amount' | 'description' | 'categoryTitle' | 'date'
>

export default function RecentTransactionList({
  transactions,
}: {
  transactions: RecentTransaction[]
}) {
  return (
    <div className="divide-y">
      {transactions.map((transaction) => {
        const income = transaction.type === TransactionType.INCOME
        const expense = transaction.type === TransactionType.EXPEND
        const { label, icon: Icon } = transactionPresentation[transaction.type]
        return (
          <div
            key={transaction.id}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/65"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-sm ${income ? 'bg-success-soft text-success-text' : expense ? 'bg-destructive/10 text-destructive-text' : 'bg-muted text-foreground'}`}
            >
              <Icon size={16} strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{transaction.description}</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {label} · {transaction.categoryTitle ?? 'Uncategorized'},{' '}
                {dayjs(transaction.date).format('MMM D, YYYY')}
              </p>
            </div>
            <p
              className={`shrink-0 font-mono text-xs font-medium tabular-nums ${income ? 'text-success-text' : expense ? 'text-destructive-text' : ''}`}
            >
              {income ? '+' : '-'}
              {formatNumber(transaction.amount)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
