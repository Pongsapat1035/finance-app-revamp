// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { AuthenticatedLayout } from './_authenticated'

const navigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: object) => options,
  lazyRouteComponent: () => () => null,
  Outlet: () => <div>Private content</div>,
  useNavigate: () => navigate,
}))

vi.mock('../store/authStore', () => ({
  useIsAuthenticated: () => true,
  useHasHydrated: () => true,
}))

afterEach(() => {
  cleanup()
  navigate.mockClear()
})

it('keeps the existing authenticated route behavior', () => {
  render(<AuthenticatedLayout />)
  expect(screen.getByText('Private content')).toBeTruthy()
})
