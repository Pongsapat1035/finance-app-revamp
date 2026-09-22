import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { CircleAlert, LoaderCircle, ShieldCheck } from 'lucide-react'
import { postGoogleAuthorizationExchange } from '#/api/auth/auth.api'
import AuthPageLayout from '#/components/auth/AuthPageLayout'
import AuthPanel from '#/components/auth/AuthPanel'
import GoogleIcon from '#/components/icons/GoogleIcon'
import { handleAxiosError } from '#/lib/handleAxiosError'
import useAuthStore from '#/store/authStore'

type CallbackState =
  { status: 'exchanging' } | { status: 'failed'; message: string; canReturnToSignIn: boolean }

const CALLBACK_PATH = '/auth/google/callback'

export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  const startedRef = useRef(false)
  const [callbackState, setCallbackState] = useState<CallbackState>({ status: 'exchanging' })

  useEffect(() => {
    if (startedRef.current) return

    startedRef.current = true
    let isActive = true
    const handoffCode = new URLSearchParams(window.location.search).get('code')

    const clearHandoffCode = () => {
      window.history.replaceState({}, '', CALLBACK_PATH)
    }

    if (!handoffCode) {
      clearHandoffCode()
      setCallbackState({
        status: 'failed',
        message:
          'This Google sign-in link is missing its confirmation code. Return to sign in and try again.',
        canReturnToSignIn: true,
      })
      return () => {
        isActive = false
      }
    }

    const exchangeHandoffCode = async () => {
      try {
        const { token } = await postGoogleAuthorizationExchange({ code: handoffCode })

        if (!isActive) return

        clearHandoffCode()

        if (!token) {
          if (isActive) {
            setCallbackState({
              status: 'failed',
              message: 'We could not complete Google sign in. Return to sign in and try again.',
              canReturnToSignIn: true,
            })
          }
          return
        }

        setToken(token)
        void navigate({ to: '/dashboard', replace: true })
      } catch (error) {
        clearHandoffCode()

        if (!isActive) return

        const { statusCode } = handleAxiosError(error)

        if (statusCode === 403) {
          setCallbackState({
            status: 'failed',
            message: 'This account cannot sign in. Contact support if you think this is a mistake.',
            canReturnToSignIn: false,
          })
          return
        }

        if (statusCode === 429) {
          setCallbackState({
            status: 'failed',
            message: 'Too many sign-in attempts. Please wait a moment before trying again.',
            canReturnToSignIn: true,
          })
          return
        }

        setCallbackState({
          status: 'failed',
          message:
            'This Google sign-in link has expired or was already used. Return to sign in and try again.',
          canReturnToSignIn: true,
        })
      }
    }

    void exchangeHandoffCode()

    return () => {
      isActive = false
    }
  }, [navigate, setToken])

  const isExchanging = callbackState.status === 'exchanging'
  const errorMessage = callbackState.status === 'failed' ? callbackState.message : ''
  const canReturnToSignIn = callbackState.status === 'failed' && callbackState.canReturnToSignIn

  return (
    <AuthPageLayout>
      <AuthPanel>
        <div
          className="flex min-h-[calc(100dvh-6rem)] flex-col justify-center py-12 lg:min-h-full"
          aria-live={isExchanging ? 'polite' : undefined}
          role={isExchanging ? undefined : 'alert'}
        >
          <div
            className={`flex size-12 items-center justify-center rounded-md border ${
              isExchanging
                ? 'bg-muted'
                : 'border-destructive/30 bg-destructive/10 text-destructive-text'
            }`}
          >
            {isExchanging ? (
              <GoogleIcon size={24} aria-hidden="true" />
            ) : (
              <CircleAlert size={22} strokeWidth={1.75} aria-hidden="true" />
            )}
          </div>

          <div className="mt-7">
            {isExchanging ? (
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <LoaderCircle
                  size={15}
                  className="animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span>Authentication in progress</span>
              </div>
            ) : null}
            <h1 className="mt-4 text-[32px] font-medium leading-tight tracking-[-0.045em] sm:text-[36px]">
              {isExchanging ? 'Signing you in with Google' : 'Google sign in failed'}
            </h1>
            <p className="mt-3 max-w-md text-[14px] leading-6 text-muted-foreground">
              {isExchanging
                ? 'We’re securely confirming your account. You’ll be taken to your dashboard shortly.'
                : errorMessage}
            </p>
          </div>

          <div className="mt-8 border-t pt-5 text-xs text-muted-foreground">
            {isExchanging ? (
              <p className="flex items-center gap-2">
                <ShieldCheck size={15} strokeWidth={1.75} aria-hidden="true" />
                Keep this window open while we complete sign in.
              </p>
            ) : null}
            {canReturnToSignIn ? (
              <Link
                to="/auth"
                className="ds-focus-ring inline-flex text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                Return to sign in
              </Link>
            ) : null}
          </div>
        </div>
      </AuthPanel>
    </AuthPageLayout>
  )
}
