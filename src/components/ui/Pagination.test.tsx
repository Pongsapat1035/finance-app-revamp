// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Pagination from './Pagination'

afterEach(cleanup)

describe('Pagination', () => {
  it('renders correct range and item name', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination
        page={2}
        totalPages={5}
        total={45}
        pageSize={10}
        itemName="transactions"
        onPageChange={onPageChange}
      />,
    )

    expect(screen.getByText('Showing 11-20 of 45 transactions')).toBeTruthy()
    expect(screen.getByText('Page 2 of 5')).toBeTruthy()
  })

  it('calls onPageChange when clicking previous and next buttons', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination page={2} totalPages={5} total={45} pageSize={10} onPageChange={onPageChange} />,
    )

    const prevBtn = screen.getByRole('button', { name: 'Previous page' })
    const nextBtn = screen.getByRole('button', { name: 'Next page' })

    fireEvent.click(prevBtn)
    expect(onPageChange).toHaveBeenCalledWith(1)

    fireEvent.click(nextBtn)
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('disables previous button on first page and next button on last page', () => {
    const { rerender } = render(
      <Pagination page={1} totalPages={3} total={30} pageSize={10} onPageChange={vi.fn()} />,
    )

    expect(
      (screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement).disabled,
    ).toBe(true)
    expect((screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement).disabled).toBe(
      false,
    )

    rerender(<Pagination page={3} totalPages={3} total={30} pageSize={10} onPageChange={vi.fn()} />)

    expect(
      (screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement).disabled,
    ).toBe(false)
    expect((screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement).disabled).toBe(
      true,
    )
  })

  it('handles edge case when total is 0', () => {
    render(
      <Pagination
        page={1}
        totalPages={1}
        total={0}
        pageSize={10}
        itemName="items"
        onPageChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Showing 0 of 0 items')).toBeTruthy()
    expect(screen.getByText('Page 1 of 1')).toBeTruthy()
  })
})
