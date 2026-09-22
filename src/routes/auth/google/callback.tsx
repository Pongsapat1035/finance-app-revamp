import { createFileRoute } from '@tanstack/react-router'
import GoogleCallbackPage from '#/pages/auth/GoogleCallbackPage'

export const Route = createFileRoute('/auth/google/callback')({
  component: GoogleCallbackPage,
  head: () => ({
    meta: [
      { title: 'Signing in with Google | Ledgr' },
      {
        name: 'description',
        content: 'Securely complete Google sign in for your Ledgr account.',
      },
    ],
  }),
})
