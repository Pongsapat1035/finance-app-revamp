import { createFileRoute } from '@tanstack/react-router'

import ProfilePage from '#/pages/ProfilePage'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: 'Profile settings | My Finance' },
      { name: 'description', content: 'Manage personal details and account security.' },
    ],
  }),
})
