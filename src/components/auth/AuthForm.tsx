import { useState } from 'react'
import SignUpForm from '#/components/auth/SignUpForm'
import SignInForm from '#/components/auth/SignInForm'
import SegmentedTab from '#/components/ui/SegmentedTab'
import Toast from '#/components/ui/Toast'
import { useSignup, useSignIn } from '#/hooks/useAuth'
import type { HandledError } from '#/lib/handleAxiosError'

type AuthMode = 'signup' | 'signin'

interface AuthToast {
  id: number
  title: string
  description: string
}

const AUTH_TABS = [
  { label: 'Create account', value: 'signup' as AuthMode },
  { label: 'Sign in', value: 'signin' as AuthMode },
]

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signup')
  const [authToast, setAuthToast] = useState<AuthToast | null>(null)
  const isSignup = mode === 'signup'

  const handleSignUpError = (error: HandledError) => {
    if (error.statusCode === 400 && error.message.toLowerCase().includes('user is already exist')) {
      setAuthToast({
        id: Date.now(),
        title: 'Account already exists',
        description: 'An account already uses this email. Switch to Sign in to continue.',
      })
      return
    }

    setAuthToast({
      id: Date.now(),
      title: 'Unable to create account',
      description: error.message,
    })
  }

  const handleSignInError = (error: HandledError) => {
    if (error.statusCode === 401 && error.message.toLowerCase().includes('uses google sign-in')) {
      setAuthToast({
        id: Date.now(),
        title: 'Use Google sign-in',
        description: 'This email uses Google sign-in. Continue with Google to access your account.',
      })
      return
    }

    setAuthToast({
      id: Date.now(),
      title: 'Unable to sign in',
      description: error.message,
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

      {authToast ? (
        <Toast
          key={authToast.id}
          title={authToast.title}
          description={authToast.description}
          tone="error"
          onClose={() => setAuthToast(null)}
        />
      ) : null}
    </>
  )
}

export default AuthForm
