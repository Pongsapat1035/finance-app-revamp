// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import RouteErrorPage, { NotFoundPage } from './RouteFailurePage'

afterEach(cleanup)

describe('Route failure pages', () => {
  it('offers a retry and recovery link when rendering fails', () => {
    const reset = vi.fn()

    render(
      <RouteErrorPage
        error={new Error('Failed to render')}
        reset={reset}
        info={{ componentStack: '' }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledOnce()
    expect(screen.getByRole('link', { name: 'Go to overview' }).getAttribute('href')).toBe('/')
  })

  it('renders a recoverable page for unmatched URLs', () => {
    render(<NotFoundPage isNotFound routeId="__root__" />)

    expect(screen.getByRole('heading', { name: 'This page does not exist' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Go to overview' }).getAttribute('href')).toBe('/')
  })
})
