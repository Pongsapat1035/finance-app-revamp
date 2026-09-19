import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type IconButtonVariant = 'ghost' | 'ghost-destructive' | 'filled' | 'outline'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: string
  'aria-label': string
  children: ReactNode
}

const variants: Record<IconButtonVariant, string> = {
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  'ghost-destructive': 'text-muted-foreground hover:bg-[#fff1f0] hover:text-destructive-text',
  filled: 'bg-primary text-primary-foreground hover:bg-[#30302f]',
  outline: 'border border-input bg-background hover:bg-muted',
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'size-9', className = '', children, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={`ds-focus-ring ds-interactive grid ${size} shrink-0 place-items-center rounded-sm ${variants[variant]} disabled:pointer-events-none disabled:opacity-40 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'

export default IconButton
