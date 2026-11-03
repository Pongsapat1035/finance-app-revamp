import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '#/lib/utils'

export type ButtonVariant = 'primary' | 'outline' | 'dark' | 'destructive' | 'ghost'
// default (40px) is the standard control height in design.md. md and sm are for dense rows.
export type ButtonSize = 'default' | 'md' | 'sm'

const sizeStyles: Record<ButtonSize, string> = {
  default: 'h-10 gap-2 px-4 text-sm',
  md: 'h-9 gap-2 px-3 text-xs',
  sm: 'h-8 gap-1.5 px-2.5 text-xs',
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent font-semibold text-accent-foreground hover:bg-accent-hover',
  outline: 'border border-input bg-background font-medium hover:bg-muted',
  dark: 'bg-primary font-medium text-primary-foreground hover:bg-primary-hover',
  // White text on dark red for contrast, as in the confirm dialog rules
  destructive:
    'bg-destructive-text font-medium text-primary-foreground hover:bg-destructive-text-hover',
  ghost: 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
}

/** Shared button styling, also used by links that look like buttons. */
export const buttonClasses = ({
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
} = {}) =>
  cn(
    'ds-focus-ring ds-interactive inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm no-underline disabled:pointer-events-none disabled:opacity-50',
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && 'w-full',
    className,
  )

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  prefixIcon?: ReactNode
  suffixIcon?: ReactNode
  children: ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'default',
  fullWidth = true,
  prefixIcon,
  suffixIcon,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      {prefixIcon}
      {children}
      {suffixIcon}
    </button>
  )
}

export default Button
