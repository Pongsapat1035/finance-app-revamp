import { createFileRoute } from '@tanstack/react-router'
import AuthForm from '#/components/auth/AuthForm'
import ProductStory from '#/components/ProductStory'

export const Route = createFileRoute('/')({
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

const AuthPage = () => {
  return (
    <main className="grid min-h-dvh bg-background lg:h-dvh lg:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)] lg:overflow-hidden">
      <div className="hidden lg:block lg:h-dvh">
        <ProductStory />
      </div>
      <AuthForm />
    </main>
  )
}
