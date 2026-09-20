import { type LucideIcon } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'

import Button from '#/components/ui/Button'
import EmptyState, { type EmptyStateProps } from '#/components/ui/EmptyState'
import ErrorState, { type ErrorStateProps } from '#/components/ui/ErrorState'
import Pagination, { type PaginationProps } from '#/components/ui/Pagination'
import TableSkeleton from '#/components/ui/TableSkeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/Table'
import { cn } from '#/lib/utils'

export interface DataTableColumn<Row> {
  id: string
  header: ReactNode
  cell: (row: Row) => ReactNode
  className?: string
  headerClassName?: string
}

export interface DataTableStateAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'outline' | 'dark' | 'destructive'
  size?: 'default' | 'sm'
  height?: string
  icon?: LucideIcon
}

export interface DataTableEmptyState extends Omit<EmptyStateProps, 'action' | 'className'> {
  actions?: DataTableStateAction[]
}

export type DataTableErrorState = Omit<ErrorStateProps, 'action' | 'className'>
export type DataTablePagination = Omit<PaginationProps, 'className'>

export interface DataTableProps<Row> {
  rows: Row[]
  columns: DataTableColumn<Row>[]
  getRowKey: (row: Row) => string | number
  children?: ReactNode
  header?: ReactNode
  renderMobileRow?: (row: Row) => ReactNode
  isLoading?: boolean
  errorState?: DataTableErrorState
  emptyState?: DataTableEmptyState
  pagination?: DataTablePagination
  skeletonRows?: number
  tableClassName?: string
  className?: string
}

const DataTable = <Row,>({
  rows,
  columns,
  getRowKey,
  children,
  header,
  renderMobileRow,
  isLoading = false,
  errorState,
  emptyState,
  pagination,
  skeletonRows = 5,
  tableClassName,
  className,
}: DataTableProps<Row>) => {
  const isEmpty = rows.length === 0
  const emptyStateActions = emptyState?.actions
  const emptyStateAction = emptyStateActions?.length ? (
    <div className="flex flex-wrap justify-center gap-2">
      {emptyStateActions.map(({ label, onClick, variant, size, height, icon: Icon }, index) => (
        <Button
          key={`${label}-${index}`}
          type="button"
          variant={variant}
          size={size}
          height={height}
          fullWidth={false}
          prefixIcon={Icon && <Icon size={15} strokeWidth={1.75} aria-hidden="true" />}
          onClick={onClick}
        >
          {label}
        </Button>
      ))}
    </div>
  ) : undefined

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-background', className)}>
      {header}
      {children}

      {errorState ? (
        <ErrorState {...errorState} />
      ) : isLoading ? (
        <TableSkeleton rows={skeletonRows} />
      ) : isEmpty ? (
        emptyState && (
          <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
            action={emptyStateAction}
          />
        )
      ) : (
        <>
          <div className={cn('overflow-x-auto', renderMobileRow && 'hidden md:block')}>
            <Table className={tableClassName}>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.id} className={column.headerClassName}>
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={getRowKey(row)}>
                    {columns.map((column) => (
                      <TableCell key={column.id} className={column.className}>
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {renderMobileRow && (
            <div className="divide-y md:hidden">
              {rows.map((row) => (
                <Fragment key={getRowKey(row)}>{renderMobileRow(row)}</Fragment>
              ))}
            </div>
          )}
        </>
      )}

      {!errorState && !isLoading && !isEmpty && pagination && <Pagination {...pagination} />}
    </div>
  )
}

export default DataTable
