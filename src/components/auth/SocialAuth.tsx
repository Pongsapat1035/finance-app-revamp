import { useState } from 'react'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { getGoogleAuthorizationLink } from '#/api/auth/auth.api'
import Button from '#/components/ui/Button'
import GoogleIcon from '#/components/icons/GoogleIcon'
import { handleAxiosError } from '#/lib/handleAxiosError'

const SocialAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const { authorizationUrl } = await getGoogleAuthorizationLink()

      if (!authorizationUrl) {
        setError('Unable to start Google sign in. Please try again.')
        setIsConnecting(false)
        return
      }

      window.location.assign(authorizationUrl)
    } catch (requestError) {
      const { message, statusCode } = handleAxiosError(requestError)
      setError(
        statusCode === 429
          ? 'Too many sign-in attempts. Please wait a moment before trying again.'
          : message || 'Unable to start Google sign in. Please try again.',
      )
      setIsConnecting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        type="button"
        className="mt-7"
        onClick={handleGoogleLogin}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" />
        ) : (
          <GoogleIcon size={20} />
        )}
        {isConnecting ? 'Connecting to Google…' : 'Continue with Google'}
      </Button>

      {error ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs leading-5 text-destructive-text"
        >
          <CircleAlert
            className="mt-0.5 shrink-0"
            size={15}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </>
  )
}

export default SocialAuth
