import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole } from 'lucide-react'
import AuthPageLayout from '#/components/auth/AuthPageLayout'
import AuthPanel from '#/components/auth/AuthPanel'
import Button from '#/components/ui/Button'
import InputField from '#/components/ui/InputField'
import { validateEmail } from '#/lib/validators/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const emailError = validateEmail(email)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailTouched(true)
  }

  return (
    <AuthPageLayout>
      <AuthPanel>
        <Link
          to="/auth"
          className="ds-focus-ring ds-interactive inline-flex h-9 items-center gap-2 rounded-sm text-xs font-medium text-muted-foreground no-underline hover:text-foreground"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Back to sign in
        </Link>

        <div className="mt-14">
          <div className="grid size-10 place-items-center rounded-sm bg-muted text-foreground">
            <KeyRound size={19} strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 text-[32px] font-medium leading-tight tracking-[-0.045em] sm:text-[36px]">
            Reset your password.
          </h1>
          <p className="mt-3 max-w-sm text-[14px] leading-6 text-muted-foreground">
            Enter the email connected to your account. We will send you a six-digit verification
            code.
          </p>
        </div>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <InputField
            id="recovery-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            touched={emailTouched}
            error={emailError}
            onBlur={() => setEmailTouched(true)}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Button type="submit">
            Send verification code
            <ArrowRight size={15} strokeWidth={2} />
          </Button>
        </form>

        <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <LockKeyhole className="mt-0.5 shrink-0" size={14} strokeWidth={1.75} />
          <p>For your security, the code will expire after 10 minutes.</p>
        </div>

        <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">
          Already have a code?{' '}
          <Link
            to="/auth/otp"
            className="ds-focus-ring font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Enter verification code
          </Link>
        </div>
      </AuthPanel>
    </AuthPageLayout>
  )
}
