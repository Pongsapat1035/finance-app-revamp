import { ChevronLeft, ChevronRight } from 'lucide-react'
import IconButton from '#/components/ui/IconButton'
import { cn } from '#/lib/utils'

export interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize?: number
  itemName?: string
  onPageChange: (page: number) => void
  className?: string
}

const Pagination = ({
  page,
  totalPages,
  total,
  pageSize = 10,
  itemName,
  onPageChange,
  className,
}: PaginationProps) => {
  const safeTotalPages = Math.max(1, totalPages)
  const safePage = Math.max(1, Math.min(page, safeTotalPages))
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total)
  const rangeText = total === 0 ? '0' : from === to ? `${from}` : `${from}-${to}`

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col gap-3 border-t px-4 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p>
        Showing {rangeText} of {total}
        {itemName ? ` ${itemName}` : ''}
      </p>
      <div className="flex items-center gap-2">
        <IconButton
          variant="outline"
          size="size-8"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} strokeWidth={1.75} />
        </IconButton>
        <span className="min-w-20 text-center">
          Page {safePage} of {safeTotalPages}
        </span>
        <IconButton
          variant="outline"
          size="size-8"
          onClick={() => onPageChange(Math.min(safeTotalPages, safePage + 1))}
          disabled={safePage >= safeTotalPages}
          aria-label="Next page"
        >
          <ChevronRight size={15} strokeWidth={1.75} />
        </IconButton>
      </div>
    </nav>
  )
}

export default Pagination
