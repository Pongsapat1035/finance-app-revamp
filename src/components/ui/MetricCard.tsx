import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '#/lib/utils'
import { formatNumber } from '#/lib/format'

export interface MetricCardProps {
  label: string
  note: string
  value?: number
  displayValue?: ReactNode
  /** Shows a value-shaped skeleton instead of the value. */
  loading?: boolean
  icon?: LucideIcon
  iconSize?: number
  formatValue?: (value: number) => ReactNode
  tone?: 'auto' | 'neutral'
  className?: string
  style?: CSSProperties
  valueClassName?: string
  noteClassName?: string
}

const MetricCard = ({
  label,
  value,
  note,
  displayValue,
  loading = false,
  icon: Icon,
  iconSize = 16,
  formatValue = formatNumber,
  tone = 'auto',
  className,
  style,
  valueClassName,
  noteClassName,
}: MetricCardProps) => {
  const valueTone =
    tone === 'neutral'
      ? undefined
      : value === undefined
        ? undefined
        : value > 0
          ? 'text-success-text'
          : value < 0
            ? 'text-destructive-text'
            : undefined

  return (
    <article className={cn('bg-background p-5', className)} style={style}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        {Icon && (
          <Icon
            size={iconSize}
            strokeWidth={1.75}
            className={valueTone ?? 'text-muted-foreground'}
          />
        )}
      </div>
      <p
        className={cn(
          'mt-5 font-mono text-[24px] font-medium tracking-[-0.045em] tabular-nums',
          valueTone,
          valueClassName,
        )}
      >
        {loading ? (
          <span
            className="block h-8 w-28 rounded-sm bg-muted motion-safe:animate-pulse"
            aria-label={`Loading ${label.toLowerCase()}`}
          />
        ) : (
          <span className="ds-value-in block">
            {displayValue ?? (value === undefined ? null : formatValue(value))}
          </span>
        )}
      </p>
      <p className={cn('mt-1.5 text-[11px] text-muted-foreground', noteClassName)}>{note}</p>
    </article>
  )
}

export default MetricCard
