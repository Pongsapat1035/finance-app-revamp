import * as DialogPrimitive from '@radix-ui/react-dialog'
import { CircleAlert, LoaderCircle, TriangleAlert, X } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '#/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-[#161616]/35',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-5 shadow-[0_8px_30px_rgb(22_22_22/0.08)] outline-none sm:p-6',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className="ds-focus-ring ds-interactive absolute right-4 top-4 grid size-8 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X size={16} strokeWidth={1.75} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

const DialogTitle = DialogPrimitive.Title
const DialogDescription = DialogPrimitive.Description

type ConfirmTone = 'default' | 'destructive'

const toneStyles: Record<
  ConfirmTone,
  { icon: typeof CircleAlert; iconClass: string; confirmClass: string }
> = {
  default: {
    icon: CircleAlert,
    iconClass: 'bg-info-soft text-info',
    confirmClass: 'bg-primary text-primary-foreground hover:bg-[#30302f]',
  },
  destructive: {
    icon: TriangleAlert,
    iconClass: 'bg-[#f9e9e8] text-destructive',
    confirmClass: 'bg-destructive text-destructive-foreground hover:bg-[#b3352e]',
  },
}

export interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  /** Optional summary of what is being acted on, rendered in a bounded panel. */
  details?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: ConfirmTone
  /** Keeps the dialog open and disables both actions while the work is in flight. */
  loading?: boolean
  /** Persistent failure shown inside the dialog so the action can be retried. */
  error?: string
  onConfirm: () => void
}

/**
 * Blocking confirmation for actions that are hard to undo.
 * The title states the action, the description states the consequence,
 * and the confirm label repeats the verb from the trigger.
 */
const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  details,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  loading = false,
  error,
  onConfirm,
}: ConfirmModalProps) => {
  const { icon: ToneIcon, iconClass, confirmClass } = toneStyles[tone]

  return (
    <Dialog open={open} onOpenChange={(next) => !loading && onOpenChange(next)}>
      <DialogContent
        role="alertdialog"
        showCloseButton={!loading}
        onEscapeKeyDown={(event) => loading && event.preventDefault()}
        onInteractOutside={(event) => loading && event.preventDefault()}
      >
        <div className="flex gap-3.5">
          <span className={cn('grid size-9 shrink-0 place-items-center rounded-sm', iconClass)}>
            <ToneIcon size={18} strokeWidth={1.75} />
          </span>
          <div className="min-w-0 pr-8">
            <DialogTitle className="text-base font-medium tracking-[-0.02em]">{title}</DialogTitle>
            <DialogDescription className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
              {description}
            </DialogDescription>
          </div>
        </div>

        {details && (
          <div className="rounded-md border bg-muted px-3.5 py-3 text-[13px]">{details}</div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-[12px] leading-5 text-destructive"
          >
            <CircleAlert size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <button
              type="button"
              disabled={loading}
              className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm border bg-background px-4 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-45"
            >
              {cancelLabel}
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium disabled:pointer-events-none disabled:opacity-70',
              confirmClass,
            )}
          >
            {loading && (
              <LoaderCircle
                size={15}
                strokeWidth={2}
                className="animate-spin motion-reduce:animate-none"
              />
            )}
            {loading ? 'Working' : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmModal
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
}
