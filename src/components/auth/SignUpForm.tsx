import { ArrowRight, Check } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import InputField from '#/components/ui/InputField'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '#/lib/validators/auth'
import Button from '#/components/ui/Button'
import SocialAuth from '#/components/auth/SocialAuth'
import type { CreateUser } from '#/api/auth/auth.type'

interface Props {
  onSubmit: (data: CreateUser) => void
  isPending?: boolean
}

const SignUpForm = ({ onSubmit, isPending }: Props) => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: ({ value }) => {
      onSubmit({ name: value.name, email: value.email, password: value.password })
    },
  })

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

      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="name" validators={{ onBlur: ({ value }) => validateName(value) ?? null }}>
          {(field) => (
            <InputField
              id="name"
              label="Full name"
              placeholder="Your name"
              autoComplete="name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
              touched={field.state.meta.isTouched}
            />
          )}
        </form.Field>

        <form.Field name="email" validators={{ onBlur: ({ value }) => validateEmail(value) ?? null }}>
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

        <form.Field name="password" validators={{ onBlur: ({ value }) => validatePassword(value) ?? null }}>
          {(field) => (
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
              touched={field.state.meta.isTouched}
            />
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              validateConfirmPassword(value, fieldApi.form.getFieldValue('password')) ?? null,
          }}
        >
          {(field) => (
            <InputField
              id="confirm-password"
              label="Confirm password"
              type="password"
              placeholder="Enter your password again"
              autoComplete="new-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
              touched={field.state.meta.isTouched}
            />
          )}
        </form.Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating account…' : 'Create account'}
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
