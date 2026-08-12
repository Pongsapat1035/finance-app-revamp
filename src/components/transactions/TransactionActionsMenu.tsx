import { Ellipsis, Eye, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/DropdownMenu'
import IconButton from '#/components/ui/IconButton'

interface TransactionActionsMenuProps {
  merchant: string
  triggerClassName?: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const TransactionActionsMenu = ({
  merchant,
  triggerClassName,
  onView,
  onEdit,
  onDelete,
}: TransactionActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          size={triggerClassName ?? 'size-8'}
          className="data-[state=open]:bg-muted data-[state=open]:text-foreground"
          aria-label={`Actions for ${merchant}`}
        >
          <Ellipsis size={16} strokeWidth={1.75} aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" collisionPadding={12}>
        <DropdownMenuLabel className="max-w-48 truncate">{merchant}</DropdownMenuLabel>
        {onView && (
          <DropdownMenuItem onSelect={onView}>
            <Eye size={15} strokeWidth={1.75} aria-hidden="true" />
            View details
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil size={15} strokeWidth={1.75} aria-hidden="true" />
          Edit transaction
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onDelete}
          className="text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive"
        >
          <Trash2 size={15} strokeWidth={1.75} aria-hidden="true" />
          Delete transaction
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TransactionActionsMenu
