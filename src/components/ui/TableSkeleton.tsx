import { cn } from '#/lib/utils'

export interface TableSkeletonProps {
  rows?: number
  className?: string
}

const TableSkeleton = ({ rows = 5, className }: TableSkeletonProps) => {
  return (
    <div className={cn('divide-y', className)} aria-label="Loading data" aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-4">
          <span className="size-9 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
          <span className="h-4 w-40 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
          <span className="ml-auto h-4 w-20 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton
