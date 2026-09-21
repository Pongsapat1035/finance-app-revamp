// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { TransactionQueryParams } from '#/api/transaction/transaction.type'
import { TransactionType } from '#/enum/enum'
import TransactionsPage from './TransactionsPage'

const mocks = vi.hoisted(() => ({
  fetchTransactions: vi.fn(),
  fetchCategories: vi.fn(),
}))

vi.mock('#/components/app-shell', () => ({
  AppSidebar: () => <aside />,
  AppTopBar: ({ periodControl }: { periodControl?: ReactNode }) => <header>{periodControl}</header>,
}))

vi.mock('#/hooks/useCategory', () => ({
  useFetchCategory: (params: unknown) => {
    mocks.fetchCategories(params)

    return {
      data: {
        data: [
          {
            id: 1,
            userId: 1,
            title: 'Salary',
            type: TransactionType.INCOME,
            color: '#16a34a',
            createdAt: '2026-09-01T00:00:00.000Z',
            updatedAt: '2026-09-01T00:00:00.000Z',
          },
          {
            id: 2,
            userId: 1,
            title: 'Groceries',
            type: TransactionType.EXPEND,
            color: '#dc2626',
            createdAt: '2026-09-01T00:00:00.000Z',
            updatedAt: '2026-09-01T00:00:00.000Z',
          },
        ],
        meta: { page: 1, limit: 100, total: 2, totalPages: 1 },
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    }
  },
  useCreateCategory: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateCategory: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteCategory: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('#/hooks/useTransaction', () => ({
  useFetchTransaction: (params: TransactionQueryParams) => {
    mocks.fetchTransactions(params)

    return {
      data: {
        data: [
          {
            id: 1,
            type: TransactionType.EXPEND,
            amount: 120,
            date: '2026-09-12',
            description: 'Market run',
            categoryId: 2,
            categoryTitle: 'Groceries',
          },
        ],
        meta: { page: params.page ?? 1, limit: 20, total: 40, totalPages: 2 },
      },
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    }
  },
  useDeleteTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useCreateTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

const lastTransactionQuery = () =>
  mocks.fetchTransactions.mock.calls.at(-1)?.[0] as TransactionQueryParams

const chooseRadixOption = async (label: RegExp, option: RegExp) => {
  fireEvent.pointerDown(screen.getByRole('combobox', { name: label }), {
    button: 0,
    ctrlKey: false,
  })
  fireEvent.click(await screen.findByRole('option', { name: option }))
}

afterEach(() => {
  cleanup()
  mocks.fetchTransactions.mockClear()
  mocks.fetchCategories.mockClear()
  vi.useRealTimers()
})

describe('TransactionsPage filters', () => {
  it('debounces keyword search before sending the complete query to the API', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-21T12:00:00.000Z'))
    render(<TransactionsPage />)

    expect(lastTransactionQuery()).toEqual({
      page: 1,
      limit: 20,
      keyword: undefined,
      type: undefined,
      categoryId: undefined,
      month: '2026-09',
    })

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search transactions' }), {
      target: { value: 'market' },
    })

    expect(lastTransactionQuery().keyword).toBeUndefined()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(lastTransactionQuery()).toMatchObject({ keyword: 'market', month: '2026-09' })
  })

  it('combines selected filters and resets pagination when a filter changes', async () => {
    render(<TransactionsPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await waitFor(() => expect(lastTransactionQuery().page).toBe(2))

    await chooseRadixOption(/filter by type/i, /income/i)
    await waitFor(() => {
      expect(lastTransactionQuery()).toMatchObject({
        page: 1,
        type: TransactionType.INCOME,
      })
    })

    await chooseRadixOption(/filter by category/i, /salary/i)
    await waitFor(() => {
      expect(lastTransactionQuery()).toMatchObject({
        page: 1,
        type: TransactionType.INCOME,
        categoryId: 1,
      })
    })
  })

  it('sends the selected month as YYYY-MM and resets pagination', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-21T12:00:00.000Z'))
    render(<TransactionsPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await waitFor(() => expect(lastTransactionQuery().page).toBe(2))

    fireEvent.click(screen.getByRole('button', { name: 'Filter by month' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Select August 2026' }))

    await waitFor(() => {
      expect(lastTransactionQuery()).toMatchObject({ page: 1, month: '2026-08' })
    })
  })
})
