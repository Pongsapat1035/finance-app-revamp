import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <span className="grid size-11 place-items-center rounded-sm bg-muted text-muted-foreground">
          {icon}
        </span>
      )}
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState
