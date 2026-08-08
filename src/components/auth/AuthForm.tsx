import { useState } from 'react'
import SignUpForm from '#/components/auth/SignUpForm'
import SignInForm from '#/components/auth/SignInForm'
import SegmentedTab from '#/components/ui/SegmentedTab'
import { useSignup, useSignIn } from '#/hooks/useAuth'

type AuthMode = 'signup' | 'signin'

const AUTH_TABS = [
  { label: 'Create account', value: 'signup' as AuthMode },
  { label: 'Sign in', value: 'signin' as AuthMode },
]

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signup')
  const isSignup = mode === 'signup'

  const { mutate: signUp, isPending: isSigningUp } = useSignup()
  const { mutate: signIn, isPending: isSigningIn } = useSignIn()

  return (
    <>
      <SegmentedTab
        tabs={AUTH_TABS}
        active={mode}
        onChange={setMode}
        ariaLabel="Authentication mode"
      />

      <div className="pt-9">
        {isSignup ? (
          <SignUpForm onSubmit={signUp} isPending={isSigningUp} />
        ) : (
          <SignInForm onSubmit={signIn} isPending={isSigningIn} />
        )}
      </div>
    </>
  )
}

export default AuthForm
