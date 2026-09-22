import { createFileRoute } from '@tanstack/react-router'

import OtpPage from '#/pages/auth/OtpPage'

export const Route = createFileRoute('/auth/otp')({
  component: OtpPage,
  head: () => ({
    meta: [
      { title: 'Verify your code | Finance App' },
      {
        name: 'description',
        content: 'Enter the verification code sent to your email address.',
      },
    ],
  }),
})
