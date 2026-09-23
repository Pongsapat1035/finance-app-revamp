// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import type { TransactionQueryParams } from '#/api/transaction/transaction.type'
import ToastProvider from '#/components/ui/ToastProvider'
import { TransactionType } from '#/enum/enum'
import TransactionsPage from './TransactionsPage'

const mocks = vi.hoisted(() => ({
  fetchTransactions: vi.fn(),
  fetchCategories: vi.fn(),
  refetchTransactions: vi.fn(),
  refetchCategories: vi.fn(),
  transactionState: { isPending: false, isError: false },
  categoryState: { isPending: false, isError: false },
}))

const categories = [
  {
    id: 1,
    userId: 1,
    title: 'Salary',
    type: TransactionType.INCOME,
    color: '#16a34a',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  ...Array.from({ length: 10 }, (_, index) => ({
    id: index + 2,
    userId: 1,
    title: index === 0 ? 'Groceries' : `Category ${index + 2}`,
    type: TransactionType.EXPEND,
    color: '#dc2626',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  })),
]

vi.mock('#/components/app-shell', () => ({
  AppSidebar: () => <aside />,
  AppTopBar: ({ periodControl }: { periodControl?: ReactNode }) => <header>{periodControl}</header>,
}))

vi.mock('#/hooks/useCategory', () => ({
  useFetchCategory: (params: unknown) => {
    mocks.fetchCategories(params)

    return {
      data: {
        data: categories,
        meta: { page: 1, limit: 100, total: categories.length, totalPages: 1 },
      },
      isPending: mocks.categoryState.isPending,
      isError: mocks.categoryState.isError,
      refetch: mocks.refetchCategories,
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
      isPending: mocks.transactionState.isPending,
      isError: mocks.transactionState.isError,
      refetch: mocks.refetchTransactions,
    }
  },
  useDeleteTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useCreateTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateTransaction: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

const lastTransactionQuery = () =>
  mocks.fetchTransactions.mock.calls.at(-1)?.[0] as TransactionQueryParams

const renderTransactionsPage = () =>
  render(
    <ToastProvider>
      <TransactionsPage />
    </ToastProvider>,
  )

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
})

const chooseRadixOption = async (label: RegExp, option: RegExp) => {
  fireEvent.keyDown(screen.getByRole('combobox', { name: label }), { key: 'ArrowDown' })
  fireEvent.click(await screen.findByRole('option', { name: option }))
}

afterEach(() => {
  cleanup()
  mocks.fetchTransactions.mockClear()
  mocks.fetchCategories.mockClear()
  mocks.refetchTransactions.mockClear()
  mocks.refetchCategories.mockClear()
  Object.assign(mocks.transactionState, { isPending: false, isError: false })
  Object.assign(mocks.categoryState, { isPending: false, isError: false })
  vi.useRealTimers()
})

describe('TransactionsPage filters', () => {
  it('debounces keyword search before sending the complete query to the API', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-21T12:00:00.000Z'))
    renderTransactionsPage()

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
    renderTransactionsPage()

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
    renderTransactionsPage()

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(lastTransactionQuery().page).toBe(2)

    fireEvent.click(screen.getByRole('button', { name: 'Filter by month' }))
    fireEvent.click(screen.getByRole('button', { name: 'Select August 2026' }))

    expect(lastTransactionQuery()).toMatchObject({ page: 1, month: '2026-08' })
  })

  it('shows a stable loading state and retries a failed transaction request', () => {
    mocks.transactionState.isPending = true
    const { rerender } = renderTransactionsPage()

    expect(screen.getByLabelText('Loading data')).toBeTruthy()

    mocks.transactionState.isPending = false
    mocks.transactionState.isError = true
    rerender(
      <ToastProvider>
        <TransactionsPage />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(mocks.refetchTransactions).toHaveBeenCalledOnce()
  })

  it('lets people search and select categories beyond the first ten options', async () => {
    renderTransactionsPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add transaction' }))
    fireEvent.click(screen.getByRole('combobox', { name: 'Category' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search category options' }), {
      target: { value: 'Category 11' },
    })

    expect(mocks.fetchCategories.mock.calls.at(-1)?.[0]).toMatchObject({ keyword: 'Category 11' })

    fireEvent.click(await screen.findByRole('option', { name: 'Category 11' }))
    expect(screen.getByRole('combobox', { name: 'Category' }).textContent).toContain('Category 11')
  })

  it('shows category recovery in the create flow and retries the failed request', () => {
    mocks.categoryState.isError = true
    renderTransactionsPage()

    fireEvent.click(screen.getByRole('button', { name: 'Add transaction' }))
    expect(
      screen.getByText('Categories are unavailable. Open Manage categories to retry.'),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Manage categories' }))
    expect(screen.getByText('Could not load categories')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(mocks.refetchCategories).toHaveBeenCalledOnce()
  })
})
