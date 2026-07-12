import { ArrowRight, LockKeyhole } from 'lucide-react'
import InputField from '#/components/ui/InputField'
import { validateEmail, validatePassword } from '#/lib/validators/auth'
import Button from '#/components/ui/Button'
import SocialAuth from '#/components/auth/SocialAuth'

const SignInForm = () => {
  return (
    <>
      <div>
        <h2 className="text-[32px] font-medium leading-tight tracking-[-0.045em] sm:text-[36px]">
          Welcome back.
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-muted-foreground">
          Sign in to continue to your personal finance dashboard.
        </p>
      </div>

      <SocialAuth />

      <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <InputField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          validate={validateEmail}
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          validate={validatePassword}
        />

        <div className="-mt-1 flex justify-end">
          <button
            type="button"
            className="ds-focus-ring text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit">
          Sign in
          <ArrowRight size={15} strokeWidth={2} />
        </Button>
      </form>

      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <LockKeyhole size={14} strokeWidth={1.75} />
        <p>Your financial data stays private to your account.</p>
      </div>
    </>
  )
}

export default SignInForm
