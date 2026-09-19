import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import Button from '#/components/ui/Button'
import { cn } from '#/lib/utils'

export interface ErrorStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  action?: ReactNode
  className?: string
}

const ErrorState = ({
  icon,
  title = 'Could not load data',
  description = 'Check your connection and try again.',
  onRetry,
  retryLabel = 'Retry',
  action,
  className,
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        'flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-sm bg-destructive/10 text-destructive-text">
        {icon || <CircleAlert size={21} strokeWidth={1.75} />}
      </span>
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}
      {action ? (
        <div className="mt-5">{action}</div>
      ) : onRetry ? (
        <Button
          variant="outline"
          size="sm"
          height="h-9"
          fullWidth={false}
          className="mt-5"
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

export default ErrorState
