// @vitest-environment jsdom

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AppSidebar } from './app-shell'

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

afterEach(cleanup)

describe('AppSidebar', () => {
  it('links every navigation item to its registered route', () => {
    render(<AppSidebar activeItem="Budgets" />)

    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('href')).toBe('/dashboard')
    expect(screen.getByRole('link', { name: 'Transactions' }).getAttribute('href')).toBe(
      '/transactions',
    )
    expect(screen.getByRole('link', { name: 'Budgets' }).getAttribute('href')).toBe('/budgets')
    expect(screen.getByRole('link', { name: 'Reports' }).getAttribute('href')).toBe('/reports')
    expect(screen.getByRole('link', { name: 'Settings' }).getAttribute('href')).toBe('/settings')
    expect(screen.getByRole('link', { name: /Mina Park/ }).getAttribute('href')).toBe('/profile')
  })

  it('marks the active route for assistive technology', () => {
    render(<AppSidebar activeItem="Reports" />)

    expect(screen.getByRole('link', { name: 'Reports' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBeNull()
  })
})
