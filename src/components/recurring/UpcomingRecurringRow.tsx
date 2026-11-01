import dayjs from 'dayjs'

import { formatNumber } from '#/lib/format'

interface UpcomingRecurringRowProps {
  dueDate: string
  description: string
  category: string
  amount: number
}

export default function UpcomingRecurringRow({
  dueDate,
  description,
  category,
  amount,
}: UpcomingRecurringRowProps) {
  const date = dayjs(dueDate)

  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <time dateTime={dueDate} className="w-14 shrink-0 text-xs tabular-nums">
        <span className="block font-medium">{date.format('MMM D')}</span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">
          {date.format('YYYY')}
        </span>
      </time>
      <span className="h-9 w-1 shrink-0 rounded-sm bg-info" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-muted-foreground">{category}</p>
        <p className="mt-0.5 truncate text-sm font-medium">{description}</p>
      </div>
      <p className="shrink-0 font-mono text-xs font-medium tabular-nums">{formatNumber(amount)}</p>
    </div>
  )
}
