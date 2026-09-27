// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CurrentUser } from '#/api/user/current-user.type'
import ProfilePage from './ProfilePage'

const profileMock = vi.hoisted(() => ({
  user: {
    id: 7,
    email: 'real@example.com',
    name: 'Real Person',
    status: 'VERIFIED',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
  } as CurrentUser | undefined,
}))

vi.mock('#/components/app-shell', () => ({
  AppPageShell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}))

vi.mock('#/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ data: profileMock.user }),
}))

afterEach(() => {
  cleanup()
  profileMock.user = {
    id: 7,
    email: 'real@example.com',
    name: 'Real Person',
    status: 'VERIFIED',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
  }
})

describe('ProfilePage', () => {
  it('fills the existing settings UI with the current account', () => {
    render(<ProfilePage />)

    expect((screen.getByLabelText('Full name') as HTMLInputElement).value).toBe('Real Person')
    expect((screen.getByLabelText('Email address') as HTMLInputElement).value).toBe(
      'real@example.com',
    )
    expect(screen.getByText('Profile settings')).toBeTruthy()
    expect(screen.getByText('Security')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Save profile' })).toBeTruthy()
  })

  it('keeps the name blank when the API returns null', () => {
    if (profileMock.user) profileMock.user.name = null
    render(<ProfilePage />)

    expect((screen.getByLabelText('Full name') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('Email address') as HTMLInputElement).value).toBe(
      'real@example.com',
    )
  })

  it('does not show sample identity before user data is available', () => {
    profileMock.user = undefined
    render(<ProfilePage />)

    expect((screen.getByLabelText('Full name') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('Email address') as HTMLInputElement).value).toBe('')
  })
})
