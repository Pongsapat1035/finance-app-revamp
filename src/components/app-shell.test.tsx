// @vitest-environment jsdom

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import useAuthStore from '#/store/authStore'
import { AppSidebar } from './app-shell'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
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
  navigate.mockClear()
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
  })

  it('marks the active route for assistive technology', () => {
    const view = render(<AppSidebar activeItem="Recurring" />)

    expect(screen.getByRole('link', { name: 'Recurring' }).getAttribute('aria-current')).toBe(
      'page',
    )
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBeNull()
    view.rerender(<AppSidebar activeItem="Profile" />)
    expect(screen.getByRole('link', { name: 'Settings' }).getAttribute('aria-current')).toBe('page')
  })

  it('confirms before clearing the token and logging out', () => {
    useAuthStore.setState({ token: 'session-token' })
    render(<AppSidebar activeItem="Overview" />)

    expect(screen.getByRole('link', { name: 'Settings' }).getAttribute('href')).toBe('/profile')

    fireEvent.click(screen.getByRole('button', { name: 'Log out' }))
    expect(useAuthStore.getState().token).toBe('session-token')
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Cancel' }))
    expect(useAuthStore.getState().token).toBe('session-token')

    fireEvent.click(screen.getByRole('button', { name: 'Log out' }))
    fireEvent.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Log out' }),
    )
    expect(useAuthStore.getState().token).toBe('')
    expect(navigate).toHaveBeenCalledWith({ to: '/auth' })
  })
})
