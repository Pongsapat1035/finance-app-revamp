import { ArrowRight, LockKeyhole } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import InputField from '#/components/ui/InputField'
import { validateEmail, validatePassword } from '#/lib/validators/auth'
import Button from '#/components/ui/Button'
import SocialAuth from '#/components/auth/SocialAuth'
import type { LoginUser } from '#/api/auth/auth.type'

interface Props {
  onSubmit: (data: LoginUser) => void
  isPending?: boolean
}

const SignInForm = ({ onSubmit, isPending }: Props) => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      onSubmit({ email: value.email, password: value.password })
    },
  })

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

      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="email"
          validators={{ onBlur: ({ value }) => validateEmail(value) ?? null }}
        >
          {(field) => (
            <InputField
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
              touched={field.state.meta.isTouched}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onBlur: ({ value }) => validatePassword(value) ?? null }}
        >
          {(field) => (
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
              touched={field.state.meta.isTouched}
            />
          )}
        </form.Field>

        <div className="-mt-1 flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="ds-focus-ring text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Signing in…' : 'Sign in'}
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
