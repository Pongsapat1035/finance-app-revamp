// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import dayjs from 'dayjs'
import TransactionForm from './TransactionForm'

describe('TransactionForm', () => {
  it('labels required fields without rendering an empty marker row', () => {
    const today = dayjs().format('YYYY-MM-DD')
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <TransactionForm
          type="expense"
          setType={vi.fn()}
          categories={[]}
          onManageCategories={vi.fn()}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />
      </QueryClientProvider>,
    )

    const dateInput = screen.getByLabelText('Transaction date') as HTMLInputElement

    expect(screen.getByRole('combobox', { name: 'Category' })).toBeTruthy()
    expect(screen.queryByText('*')).toBeNull()
    expect(dateInput.type).toBe('date')
    expect(dateInput.required).toBe(true)
    expect(dateInput.max).toBe(today)
    expect(dateInput.value).toBe(today)
  })
})
