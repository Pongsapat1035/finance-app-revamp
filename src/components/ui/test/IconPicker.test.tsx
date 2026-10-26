// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import IconPicker from '../IconPicker'

afterEach(cleanup)

describe('IconPicker', () => {
  it('returns the Lucide export name and keeps it in a form field', () => {
    const onValueChange = vi.fn()

    render(<IconPicker label="Category icon" name="icon" onValueChange={onValueChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Category icon' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search icons' }), {
      target: { value: 'shopping cart' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Shopping Cart' }))

    expect(onValueChange).toHaveBeenCalledWith('ShoppingCart')
    expect(screen.getByRole('button', { name: 'Category icon' }).textContent).toContain(
      'Shopping Cart',
    )
    expect((document.querySelector('input[name="icon"]') as HTMLInputElement).value).toBe(
      'ShoppingCart',
    )
  })

  it('shows an empty result for a search with no matching icon', () => {
    render(<IconPicker label="Category icon" defaultValue="Wallet" />)

    fireEvent.click(screen.getByRole('button', { name: 'Category icon' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search icons' }), {
      target: { value: 'no matching icon' },
    })

    expect(screen.getByText('No icons found.')).toBeTruthy()
  })
})
