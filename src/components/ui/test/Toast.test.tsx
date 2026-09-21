// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Toast from '../Toast'

describe('Toast', () => {
  it('announces success feedback and supports manual dismissal', () => {
    const onClose = vi.fn()

    render(
      <Toast
        title="Transaction updated"
        description="Your changes are reflected in the activity list."
        duration={0}
        onClose={onClose}
      />,
    )

    expect(screen.getByRole('status').textContent).toContain('Transaction updated')

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
