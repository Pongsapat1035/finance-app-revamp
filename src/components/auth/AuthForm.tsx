import { useState } from 'react'
import SignUpForm from '#/components/auth/SignUpForm'
import SignInForm from '#/components/auth/SignInForm'
import SegmentedTab from '#/components/ui/SegmentedTab'
import { useSignup, useSignIn } from '#/hooks/useAuth'
import { useToast } from '#/hooks/useToast'
import type { HandledError } from '#/lib/handleAxiosError'

type AuthMode = 'signup' | 'signin'

const AUTH_TABS = [
  { label: 'Create account', value: 'signup' as AuthMode },
  { label: 'Sign in', value: 'signin' as AuthMode },
]

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signup')
  const { showToast } = useToast()
  const isSignup = mode === 'signup'

  const handleSignUpError = (error: HandledError) => {
    if (error.statusCode === 400 && error.message.toLowerCase().includes('user is already exist')) {
      showToast({
        title: 'Account already exists',
        description: 'An account already uses this email. Switch to Sign in to continue.',
        tone: 'error',
      })
      return
    }

    showToast({
      title: 'Unable to create account',
      description: error.message,
      tone: 'error',
    })
  }

  const handleSignInError = (error: HandledError) => {
    if (error.statusCode === 401 && error.message.toLowerCase().includes('uses google sign-in')) {
      showToast({
        title: 'Use Google sign-in',
        description: 'This email uses Google sign-in. Continue with Google to access your account.',
        tone: 'error',
      })
      return
    }

    showToast({
      title: 'Unable to sign in',
      description: error.message,
      tone: 'error',
    })
  }

  const { mutate: signUp, isPending: isSigningUp } = useSignup(handleSignUpError)
  const { mutate: signIn, isPending: isSigningIn } = useSignIn(handleSignInError)

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
