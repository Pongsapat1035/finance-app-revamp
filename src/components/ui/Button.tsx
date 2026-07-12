import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  children: ReactNode
}

const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const base =
    'ds-focus-ring ds-interactive flex h-11 w-full items-center justify-center gap-2 rounded-sm text-sm font-medium'

  const variants = {
    primary:
      'mt-2 gap-2 bg-accent px-4 font-semibold text-accent-foreground hover:bg-[#c7e600]',
    outline:
      'mt-7 gap-2.5 border border-input bg-background hover:bg-muted',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
