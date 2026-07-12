import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import SignUpForm from '#/components/auth/SignUpForm'
import SignInForm from '#/components/auth/SignInForm'
import SegmentedTab from '#/components/ui/SegmentedTab'

type AuthMode = 'signup' | 'signin'

const AUTH_TABS = [
  { label: 'Create account', value: 'signup' as AuthMode },
  { label: 'Sign in', value: 'signin' as AuthMode },
]

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signup')
  const isSignup = mode === 'signup'

  return (
    <section className="flex min-h-dvh  justify-center bg-background px-4 py-12 sm:px-8 lg:h-dvh lg:overflow-y-auto lg:px-12">
      <div className="w-full max-w-110">
        <div className="mb-9 lg:hidden">
          <Link to="/" className="ds-focus-ring inline-flex items-center gap-3 text-foreground no-underline">
            <span className="grid size-9 place-items-center rounded-sm bg-foreground text-sm font-bold tracking-[-0.08em] text-background">
              F/
            </span>
            <span className="text-sm font-medium">My finance</span>
          </Link>
        </div>

        <SegmentedTab
          tabs={AUTH_TABS}
          active={mode}
          onChange={setMode}
          ariaLabel="Authentication mode"
        />

        <div className="pt-9">
          {isSignup ? <SignUpForm /> : <SignInForm />}
        </div>
      </div>
    </section>
  )
}

export default AuthForm
