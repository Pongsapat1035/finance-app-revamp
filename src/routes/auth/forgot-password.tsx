import { createFileRoute } from '@tanstack/react-router'

import ForgotPasswordPage from '#/pages/auth/ForgotPasswordPage'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: 'Forgot password | Finance App' },
      {
        name: 'description',
        content: 'Request a verification code to reset your finance account password.',
      },
    ],
  }),
})
