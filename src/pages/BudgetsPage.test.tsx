// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import type { BudgetRow } from '#/api/budget/budget.type'
import { TransactionType } from '#/enum/enum'
import BudgetsPage from './BudgetsPage'

const mocks = vi.hoisted(() => ({
  fetchBudget: vi.fn(),
  fetchExceeded: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  showToast: vi.fn(),
}))

const rows: BudgetRow[] = [
  {
    id: 1,
    categoryId: 10,
    category: { id: 10, title: 'Groceries', type: TransactionType.EXPEND },
    hasBudget: true,
    planned: 100,
    spent: 40,
    remaining: 60,
    isOverBudget: false,
    percentUsed: 40,
  },
  {
    id: null,
    categoryId: 11,
    category: { id: 11, title: 'Travel', type: TransactionType.EXPEND },
    hasBudget: false,
    planned: 0,
    spent: 25,
    remaining: -25,
    isOverBudget: false,
    percentUsed: 0,
  },
  {
    id: 2,
    categoryId: null,
    category: null,
    label: 'Uncategorized',
    hasBudget: true,
    planned: 50,
    spent: 75,
    remaining: -25,
    isOverBudget: true,
    percentUsed: 150,
  },
]

vi.mock('#/components/app-shell', () => ({
  AppPageShell: ({
    children,
    periodControl,
  }: {
    children: ReactNode
    periodControl?: ReactNode
  }) => (
    <main>
      {periodControl}
      {children}
    </main>
  ),
}))

vi.mock('#/hooks/useBudget', () => ({
  useFetchBudget: (params: { period: string }) => {
    mocks.fetchBudget(params)
    return {
      data: {
        data: rows,
        summary: {
          totalPlanned: 150,
          totalSpent: 140,
          totalRemaining: 10,
          plannedBudgetCount: 2,
          percentOfPlanned: 93.33,
        },
      },
      isSuccess: true,
      isPending: false,
      isError: false,
    }
  },
  useFetchExceededBudget: (params: { period: string }) => {
    mocks.fetchExceeded(params)
    return {
      data: { data: [{ ...rows[2], exceededBy: 25 }], summary: { categoryCount: 1 } },
      isSuccess: true,
      isPending: false,
      isError: false,
    }
  },
  useCreateBudget: () => ({ mutateAsync: mocks.create, isPending: false }),
  useUpdateBudget: () => ({ mutateAsync: mocks.update, isPending: false }),
  useDeleteBudget: () => ({ mutateAsync: mocks.remove, isPending: false }),
}))

vi.mock('#/hooks/useRecurringTransaction', () => ({
  useFetchUpcomingRecurringTransaction: () => ({
    data: { data: [] },
    isPending: false,
    isError: false,
  }),
}))

vi.mock('#/hooks/useToast', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}))

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  rows[2].id = 2
  rows[2].hasBudget = true
})

describe('BudgetsPage', () => {
  it('shows planned categories and uncategorized spending, including usage above 100%', () => {
    render(<BudgetsPage />)

    expect(screen.getByText('Groceries')).toBeTruthy()
    expect(screen.getByText('Uncategorized')).toBeTruthy()
    expect(screen.getByText('150% used')).toBeTruthy()
    expect(screen.queryByText('Travel')).toBeNull()
  })

  it('loads budget totals for the selected month', () => {
    render(<BudgetsPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Budget month' }))
    fireEvent.click(screen.getByRole('button', { name: 'Select October 2026' }))

    expect(mocks.fetchBudget.mock.calls.at(-1)?.[0]).toEqual({ period: '2026-10' })
    expect(mocks.fetchExceeded.mock.calls.at(-1)?.[0]).toEqual({ period: '2026-10' })
  })

  it('creates a budget for a category without an existing plan', async () => {
    mocks.create.mockResolvedValueOnce(undefined)
    render(<BudgetsPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Create budget' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('combobox', { name: 'Category' }))
    fireEvent.click(await screen.findByRole('option', { name: 'Travel' }))
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Monthly plan/ }), {
      target: { value: '200' },
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create budget' }))

    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledWith({
        period: expect.stringMatching(/^\d{4}-\d{2}$/),
        categoryId: 11,
        plannedAmount: 200,
      })
    })
  })

  it('creates an uncategorized monthly budget with a null category ID', async () => {
    rows[2].id = null
    rows[2].hasBudget = false
    mocks.create.mockResolvedValueOnce(undefined)
    render(<BudgetsPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Create budget' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('combobox', { name: 'Category' }))
    fireEvent.click(await screen.findByRole('option', { name: 'Uncategorized' }))
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Monthly plan/ }), {
      target: { value: '50' },
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create budget' }))

    await waitFor(() => {
      expect(mocks.create).toHaveBeenCalledWith({
        period: expect.stringMatching(/^\d{4}-\d{2}$/),
        categoryId: null,
        plannedAmount: 50,
      })
    })
  })

  it('edits and deletes a persisted budget', async () => {
    mocks.update.mockResolvedValueOnce(undefined)
    mocks.remove.mockResolvedValueOnce(undefined)
    render(<BudgetsPage />)

    fireEvent.pointerDown(screen.getByRole('button', { name: 'More options for Groceries' }), {
      button: 0,
      ctrlKey: false,
    })
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Edit budget' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Monthly plan/ }), {
      target: { value: '125' },
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Save budget' }))
    await waitFor(() => {
      expect(mocks.update).toHaveBeenCalledWith({ id: 1, payload: { plannedAmount: 125 } })
    })

    fireEvent.pointerDown(screen.getByRole('button', { name: 'More options for Groceries' }), {
      button: 0,
      ctrlKey: false,
    })
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Delete budget' }))
    fireEvent.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete budget' }),
    )
    await waitFor(() => expect(mocks.remove).toHaveBeenCalledWith(1))
  })
})
