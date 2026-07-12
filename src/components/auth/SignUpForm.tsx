import { ArrowRight, Check } from 'lucide-react'
import InputField from '#/components/ui/InputField'
import {
  validateName,
  validateEmail,
  validatePassword,
} from '#/lib/validators/auth'
import Button from '#/components/ui/Button'
import SocialAuth from '#/components/auth/SocialAuth'

const SignUpForm = () => {
  return (
    <>
      <div>
        <h2 className="text-[32px] font-medium leading-tight tracking-[-0.045em] sm:text-[36px]">
          Start tracking clearly.
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-muted-foreground">
          Create a private space for your expenses, income, and monthly progress.
        </p>
      </div>

      <SocialAuth />

      <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <InputField
          id="name"
          label="Full name"
          placeholder="Your name"
          autoComplete="name"
          validate={validateName}
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          validate={validatePassword}
        />
        <InputField
          id="confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Enter your password again"
          autoComplete="new-password"
        />

        <Button type="submit">
          Create account
          <ArrowRight size={15} strokeWidth={2} />
        </Button>
      </form>

      <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <Check className="mt-0.5 shrink-0 text-success" size={14} strokeWidth={2} />
        <p>
          By creating an account, you agree to the Terms and acknowledge the Privacy Policy.
        </p>
      </div>
    </>
  )
}

export default SignUpForm
