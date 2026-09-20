// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TransactionType } from '#/enum/enum'
import CategoryManager from './CategoryManager'

vi.mock('#/hooks/useCategory', () => ({
  useCreateCategory: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateCategory: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteCategory: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

const props = {
  categories: [],
  transactionType: TransactionType.EXPEND,
  onBack: vi.fn(),
  onClose: vi.fn(),
}

describe('CategoryManager', () => {
  it('renders skeleton rows while categories load', () => {
    render(<CategoryManager {...props} isLoading />)

    expect(screen.getByLabelText('Loading categories')).toBeTruthy()
    expect(
      (screen.getByRole('textbox', { name: 'New category name' }) as HTMLInputElement).disabled,
    ).toBe(true)
  })

  it('renders the empty state after an empty category response', () => {
    render(<CategoryManager {...props} />)

    expect(screen.getByText('No categories yet')).toBeTruthy()
  })

  it('renders a retryable fetch error', () => {
    const onRetry = vi.fn()

    render(
      <CategoryManager {...props} error="Check your connection and try again." onRetry={onRetry} />,
    )

    expect(screen.getByText('Could not load categories')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy()
  })
})
