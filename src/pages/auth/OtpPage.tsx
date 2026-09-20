import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import AuthPageLayout from '#/components/auth/AuthPageLayout'
import AuthPanel from '#/components/auth/AuthPanel'
import Button from '#/components/ui/Button'

const verificationDigits = Array.from({ length: 6 }, (_, index) => index + 1)

export default function OtpPage() {
  return (
    <AuthPageLayout>
      <AuthPanel>
        <Link
          to="/auth/forgot-password"
          className="ds-focus-ring ds-interactive inline-flex h-9 items-center gap-2 rounded-sm text-xs font-medium text-muted-foreground no-underline hover:text-foreground"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Change email
        </Link>

        <div className="mt-14">
          <div className="grid size-10 place-items-center rounded-sm bg-muted text-foreground">
            <ShieldCheck size={19} strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 text-[32px] font-medium leading-tight tracking-[-0.045em] sm:text-[36px]">
            Enter verification code.
          </h1>
          <p className="mt-3 max-w-sm text-[14px] leading-6 text-muted-foreground">
            We sent a six-digit code to{' '}
            <span className="font-medium text-foreground">mi••@example.com</span>.
          </p>
        </div>

        <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
          <fieldset>
            <legend className="text-[13px] font-medium text-foreground">Verification code</legend>
            <div className="mt-2 grid grid-cols-6 gap-2 sm:gap-3">
              {verificationDigits.map((digit) => (
                <input
                  key={digit}
                  aria-label={`Verification code digit ${digit}`}
                  name={`verification-code-${digit}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete={digit === 1 ? 'one-time-code' : 'off'}
                  className="h-12 min-w-0 rounded-sm border border-input bg-background text-center font-mono text-xl font-medium tabular-nums text-foreground transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground hover:border-[#a9a9a5] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none motion-reduce:transition-none"
                />
              ))}
            </div>
          </fieldset>

          <Button type="submit" className="mt-6">
            Verify code
            <ArrowRight size={15} strokeWidth={2} />
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>Did not receive the email?</span>
          <button
            type="button"
            className="ds-focus-ring font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Resend code
          </button>
        </div>

        <div className="mt-8 border-t pt-6 text-xs leading-5 text-muted-foreground">
          Keep this code private. My finance will never ask you to share it by message or phone.
        </div>
      </AuthPanel>
    </AuthPageLayout>
  )
}
