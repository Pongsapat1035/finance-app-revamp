import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonSize = 'default' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'dark' | 'destructive'
  size?: ButtonSize
  height?: string
  padding?: string
  fullWidth?: boolean
  prefixIcon?: ReactNode
  suffixIcon?: ReactNode
  children: ReactNode
}

const sizeStyles: Record<ButtonSize, string> = {
  default: 'text-sm',
  sm: 'text-xs',
}

const Button = ({
  variant = 'primary',
  size = 'default',
  height = 'h-11',
  padding = 'px-4',
  fullWidth = true,
  prefixIcon,
  suffixIcon,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const base =
    'ds-focus-ring ds-interactive flex items-center justify-center gap-2 rounded-sm font-medium disabled:pointer-events-none disabled:opacity-60'

  const variants = {
    primary: 'gap-2 bg-accent font-semibold text-accent-foreground hover:bg-[#c7e600]',
    outline: 'gap-2.5 border border-input bg-background hover:bg-muted',
    dark: 'gap-2 bg-primary font-medium text-primary-foreground hover:bg-[#30302f]',
    destructive: 'gap-2 bg-destructive font-medium text-destructive-foreground hover:bg-[#ad332c]',
  }

  return (
    <button
      className={`${base} ${sizeStyles[size]} ${height} ${padding} ${fullWidth ? 'w-full' : ''} ${variants[variant]} ${className}`}
      {...props}
    >
      {prefixIcon}
      {children}
      {suffixIcon}
    </button>
  )
}

export default Button
