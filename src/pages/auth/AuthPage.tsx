import AuthForm from '#/components/auth/AuthForm'
import AuthPageLayout from '#/components/auth/AuthPageLayout'
import AuthPanel from '#/components/auth/AuthPanel'

export default function AuthPage() {
  return (
    <AuthPageLayout>
      <AuthPanel>
        <AuthForm />
      </AuthPanel>
    </AuthPageLayout>
  )
}
