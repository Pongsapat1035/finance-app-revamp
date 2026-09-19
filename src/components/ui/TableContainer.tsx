import type { ReactNode } from 'react'
import ErrorState from '#/components/ui/ErrorState'
import TableSkeleton from '#/components/ui/TableSkeleton'
import { cn } from '#/lib/utils'

export interface TableContainerProps {
  header?: ReactNode
  children: ReactNode
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  isEmpty?: boolean
  emptyState?: ReactNode
  pagination?: ReactNode
  skeletonRows?: number
  className?: string
}

const TableContainer = ({
  header,
  children,
  isLoading = false,
  error,
  onRetry,
  isEmpty = false,
  emptyState,
  pagination,
  skeletonRows = 5,
  className,
}: TableContainerProps) => {
  return (
    <div
      className={cn('overflow-hidden rounded-lg border bg-background', className)}
    >
      {header}

      {error ? (
        <ErrorState description={error} onRetry={onRetry} />
      ) : isLoading ? (
        <TableSkeleton rows={skeletonRows} />
      ) : isEmpty ? (
        emptyState
      ) : (
        children
      )}

      {!error && !isLoading && !isEmpty && pagination}
    </div>
  )
}

export default TableContainer
