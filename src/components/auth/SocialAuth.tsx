import Button from '#/components/ui/Button'
import GoogleIcon from '#/components/icons/GoogleIcon'

const SocialAuth = () => {
  const handleGoogleLogin = () => {
    // TODO: implement Google OAuth
  }

  return (
    <>
      <Button variant="outline" type="button" className="mt-7" onClick={handleGoogleLogin}>
        <GoogleIcon size={20} />
        Continue with Google
      </Button>

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
