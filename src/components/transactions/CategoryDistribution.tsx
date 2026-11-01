import { formatNumber } from '#/lib/format'

export type CategoryDistributionItem = {
  id: string
  name: string
  amount: number
  percent: number
  color: string
}

export default function CategoryDistribution({
  categories,
}: {
  categories: CategoryDistributionItem[]
}) {
  return (
    <div className="p-5">
      <div
        className="flex h-3 overflow-hidden rounded-[2px]"
        aria-label="Stacked spending distribution"
      >
        {categories.map((category) => (
          <span
            key={category.id}
            style={{ width: `${category.percent}%`, backgroundColor: category.color }}
            title={`${category.name} ${formatNumber(category.percent)}%`}
          />
        ))}
      </div>
      <div className="mt-6 divide-y">
        {categories.map((category) => (
          <div
            key={category.id}
            className="grid grid-cols-[4px_1fr_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              className="h-8 rounded-[1px]"
              style={{ backgroundColor: category.color }}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{category.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {formatNumber(category.percent)}% of expenses
              </p>
            </div>
            <p className="font-mono text-xs font-medium tabular-nums">
              {formatNumber(category.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
