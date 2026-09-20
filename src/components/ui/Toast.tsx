import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '#/lib/utils'

export type ToastTone = 'success' | 'info' | 'error'

const toneStyles = {
  success: {
    icon: CircleCheck,
    iconClass: 'bg-success-soft text-success-text',
  },
  info: {
    icon: Info,
    iconClass: 'bg-info-soft text-info',
  },
  error: {
    icon: CircleAlert,
    iconClass: 'bg-destructive/10 text-destructive-text',
  },
} satisfies Record<ToastTone, { icon: typeof CircleCheck; iconClass: string }>

export interface ToastProps {
  title: string
  description?: string
  tone?: ToastTone
  duration?: number
  onClose: () => void
}

/** Transient confirmation for completed work. Persistent problems belong inline. */
const Toast = ({ title, description, tone = 'success', duration = 4000, onClose }: ToastProps) => {
  const { icon: ToneIcon, iconClass } = toneStyles[tone]

  useEffect(() => {
    if (duration <= 0) return

    const timeoutId = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timeoutId)
  }, [duration, onClose])

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end sm:inset-x-auto sm:bottom-6 sm:right-6">
      <div
        role={tone === 'error' ? 'alert' : 'status'}
        aria-live={tone === 'error' ? 'assertive' : 'polite'}
        className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border bg-background p-3.5 shadow-[0_8px_30px_rgb(22_22_22/0.08)] sm:min-w-[200px]"
      >
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-sm', iconClass)}>
          <ToneIcon size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[13px] font-medium text-foreground">{title}</p>
          {description && (
            <p className="mt-1 text-[12px] leading-5 text-muted-foreground">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ds-focus-ring ds-interactive grid size-8 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Dismiss notification"
        >
          <X size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default Toast
