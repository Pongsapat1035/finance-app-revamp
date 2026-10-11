// @vitest-environment jsdom

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CurrentUser } from '#/api/user/current-user.type'
import useAuthStore from '#/store/authStore'
import { AppSidebar } from './app-shell'

const currentUserMock = vi.hoisted(() => ({
  data: {
    id: 7,
    email: 'actual@example.com',
    name: 'Actual User',
    status: 'VERIFIED' as const,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
  } as CurrentUser | undefined,
  isError: false,
}))

vi.mock('#/hooks/useCurrentUser', () => ({
  useCurrentUser: () => currentUserMock,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

afterEach(() => {
  cleanup()
  currentUserMock.data = {
    id: 7,
    email: 'actual@example.com',
    name: 'Actual User',
    status: 'VERIFIED',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
  }
  currentUserMock.isError = false
})

describe('AppSidebar', () => {
  it('links every navigation item to its registered route', () => {
    render(<AppSidebar activeItem="Budgets" />)

    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('href')).toBe('/dashboard')
    expect(screen.getByRole('link', { name: 'Transactions' }).getAttribute('href')).toBe(
      '/transactions',
    )
    expect(screen.getByRole('link', { name: 'Budgets' }).getAttribute('href')).toBe('/budgets')
    expect(screen.getByRole('link', { name: 'Recurring' }).getAttribute('href')).toBe('/recurring')
    expect(screen.getByText('Actual User')).toBeTruthy()
    expect(screen.getByText('actual@example.com')).toBeTruthy()
  })

  it('uses a neutral name fallback when the backend name is null', () => {
    if (currentUserMock.data) currentUserMock.data.name = null
    render(<AppSidebar activeItem="Profile" />)

    expect(screen.getByText('Name not provided')).toBeTruthy()
    expect(screen.getByText('actual@example.com')).toBeTruthy()
  })

  it('does not show sample identity while loading or after an account error', () => {
    currentUserMock.data = undefined
    const view = render(<AppSidebar activeItem="Profile" />)
    expect(screen.getByText('Loading account')).toBeTruthy()
    expect(screen.queryByText('mina@example.com')).toBeNull()

    currentUserMock.isError = true
    view.rerender(<AppSidebar activeItem="Profile" />)
    expect(screen.getByText('Account unavailable')).toBeTruthy()
    expect(screen.queryByText('mina@example.com')).toBeNull()
  })

  it('marks the active route for assistive technology', () => {
    render(<AppSidebar activeItem="Recurring" />)

    expect(screen.getByRole('link', { name: 'Recurring' }).getAttribute('aria-current')).toBe(
      'page',
    )
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBeNull()
  })

  it('opens account actions and clears the token when logging out', async () => {
    useAuthStore.setState({ token: 'session-token' })
    render(<AppSidebar activeItem="Overview" />)

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Open profile menu' }), {
      button: 0,
      ctrlKey: false,
    })

    expect(
      (await screen.findByRole('menuitem', { name: 'View profile' })).getAttribute('href'),
    ).toBe('/profile')

    const logOut = screen.getByRole('menuitem', { name: 'Log out' })
    logOut.addEventListener('click', (event) => event.preventDefault())
    fireEvent.click(logOut)
    expect(useAuthStore.getState().token).toBe('')
  })
})
