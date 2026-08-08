import { createFileRoute } from '@tanstack/react-router'
import AuthForm from '#/components/auth/AuthForm'
import AuthPageLayout from '#/components/auth/AuthPageLayout'
import AuthPanel from '#/components/auth/AuthPanel'

export const Route = createFileRoute('/auth/')({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: 'Welcome | Finance App' },
      {
        name: 'description',
        content: 'Track personal income and expenses in one clear dashboard.',
      },
    ],
  }),
})

function AuthPage() {
  return (
    <AuthPageLayout>
      <AuthPanel>
        <AuthForm />
      </AuthPanel>
    </AuthPageLayout>
  )
}
