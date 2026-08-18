import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import LedgrIcon from '../icons/LedgrIcon'

interface AuthPanelProps {
  children: ReactNode
}

const AuthPanel = ({ children }: AuthPanelProps) => {
  return (
    <section className="flex min-h-dvh justify-center bg-background px-4 py-12 sm:px-8 lg:h-dvh lg:overflow-y-auto lg:px-12">
      <div className="w-full max-w-110">
        <div className="mb-9 lg:hidden">
          <Link
            to="/"
            className="ds-focus-ring inline-flex items-center gap-3 text-foreground no-underline"
          >
            <LedgrIcon />
            <span className="text-sm font-medium">My finance</span>
          </Link>
        </div>
        {children}
      </div>
    </section>
  )
}

export default AuthPanel
