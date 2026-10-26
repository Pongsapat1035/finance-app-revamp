// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  ExpensesByCategoryResponse,
  ExpensesByCategoryQueryParams,
  NetCashFlowQueryParams,
  NetCashFlowResponse,
  TransactionSummaryQueryParams,
  TransactionSummaryResponse,
} from '#/api/summary/summary.type'
import DashboardPage from './DashboardPage'

const emptyQueryState = () => ({ isPending: false, isError: false })

const mocks = vi.hoisted(() => ({
  fetchSummary: vi.fn(),
  fetchCategories: vi.fn(),
  fetchCashFlow: vi.fn(),
  refetchSummary: vi.fn(),
  refetchCategories: vi.fn(),
  refetchCashFlow: vi.fn(),
  summaryState: { isPending: false, isError: false },
  categoriesState: { isPending: false, isError: false },
  cashFlowState: { isPending: false, isError: false },
  categories: undefined as ExpensesByCategoryResponse | undefined,
  monthlyCashFlow: undefined as NetCashFlowResponse | undefined,
}))

const summary: TransactionSummaryResponse = {
  month: '2026-10',
  income: 4000,
  expenses: 1500,
  investment: 200,
  net: 2500,
  incomeTransactionCount: 5,
  expenseTransactionCount: 6,
  investmentTransactionCount: 1,
  transactionCount: 12,
}

const yearlySummary: TransactionSummaryResponse = {
  year: 2026,
  income: 30000,
  expenses: 12500,
  investment: 1200,
  net: 17500,
  incomeTransactionCount: 10,
  expenseTransactionCount: 24,
  investmentTransactionCount: 3,
  transactionCount: 37,
}

const categories: ExpensesByCategoryResponse = {
  month: '2026-10',
  totalExpenses: 1500,
  data: [
    { categoryId: 2, title: 'Food', amount: 1000, percentage: 66.7 },
    { categoryId: null, title: 'Uncategorized', amount: 500, percentage: 33.3 },
    { categoryId: 3, title: 'Travel', amount: 0, percentage: 0 },
  ],
}

const yearlyCategories: ExpensesByCategoryResponse = {
  year: 2026,
  totalExpenses: 12500,
  data: [
    { categoryId: 3, title: 'Travel', amount: 12500, percentage: 100 },
    { categoryId: 2, title: 'Food', amount: 0, percentage: 0 },
  ],
}

const cashFlowResponse = (
  type: NetCashFlowResponse['type'],
  totals: NetCashFlowResponse['totals'],
): NetCashFlowResponse => ({
  type,
  period: type === 'monthly' ? '2026-10' : '2026',
  timezone: 'Asia/Bangkok',
  totals,
  data: Array.from({ length: type === 'monthly' ? 31 : 12 }, (_, index) => ({
    period:
      type === 'monthly'
        ? `2026-10-${String(index + 1).padStart(2, '0')}`
        : `2026-${String(index + 1).padStart(2, '0')}`,
    income: index === 0 ? totals.income : 0,
    expenses: index === 1 ? totals.expenses : 0,
    netCashFlow: 0,
  })),
})

const monthlyCashFlow = cashFlowResponse('monthly', {
  income: 4000,
  expenses: 1500,
  netCashFlow: 2500,
})
const yearlyCashFlow = cashFlowResponse('yearly', {
  income: 30000,
  expenses: 12000,
  netCashFlow: 18000,
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('#/components/app-shell', () => ({
  AppSidebar: () => <aside />,
  AppTopBar: () => <header />,
}))

vi.mock('#/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ data: { name: 'Test user' } }),
}))

vi.mock('#/hooks/useRecurringTransaction', () => ({
  useFetchUpcomingRecurringTransaction: () => ({
    data: { data: [], meta: { expectedTotal: 0 } },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
}))

vi.mock('#/hooks/useTransaction', () => ({
  useFetchTransaction: () => ({
    data: { data: [], meta: { page: 1, limit: 5, total: 0, totalPages: 0 } },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useFetchTransactionSummary: (params: TransactionSummaryQueryParams) => {
    mocks.fetchSummary(params)
    return {
      data: mocks.summaryState.isPending
        ? undefined
        : params.year === undefined
          ? summary
          : yearlySummary,
      ...mocks.summaryState,
      refetch: mocks.refetchSummary,
    }
  },
  useFetchExpensesByCategory: (params: ExpensesByCategoryQueryParams) => {
    mocks.fetchCategories(params)
    return {
      data: mocks.categoriesState.isPending
        ? undefined
        : params.year === undefined
          ? mocks.categories
          : yearlyCategories,
      ...mocks.categoriesState,
      refetch: mocks.refetchCategories,
    }
  },
  useFetchNetCashFlow: (params: NetCashFlowQueryParams) => {
    mocks.fetchCashFlow(params)
    return {
      data: mocks.cashFlowState.isPending
        ? undefined
        : params.type === 'monthly'
          ? mocks.monthlyCashFlow
          : yearlyCashFlow,
      ...mocks.cashFlowState,
      refetch: mocks.refetchCashFlow,
    }
  },
}))

const region = (name: string | RegExp) => screen.getByRole('region', { name })

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-10-15T12:00:00+07:00'))
  mocks.categories = categories
  mocks.monthlyCashFlow = monthlyCashFlow
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.clearAllMocks()
  Object.assign(mocks.summaryState, emptyQueryState())
  Object.assign(mocks.categoriesState, emptyQueryState())
  Object.assign(mocks.cashFlowState, emptyQueryState())
})

describe('DashboardPage', () => {
  it('requests the current month and shows the monthly summary from the API', () => {
    render(<DashboardPage />)

    expect(mocks.fetchSummary).toHaveBeenCalledWith({ month: '2026-10' })
    expect(mocks.fetchCategories).toHaveBeenCalledWith({ month: '2026-10' })
    expect(mocks.fetchCashFlow).toHaveBeenCalledWith({ type: 'monthly', month: '2026-10' })

    const metrics = region('October 2026 financial summary')
    expect(within(metrics).getByText('4,000')).toBeTruthy()
    expect(within(metrics).getByText('1,500')).toBeTruthy()
    expect(within(metrics).getByText('2,500')).toBeTruthy()
    expect(within(metrics).getByText('12 total transactions')).toBeTruthy()
    expect(within(metrics).getByText('62.5% savings rate')).toBeTruthy()
    expect(within(metrics).getByText('Investment')).toBeTruthy()
    expect(within(metrics).getByText('200')).toBeTruthy()
    expect(within(metrics).queryByText('Current balance')).toBeNull()
    expect(within(metrics).getByText('Oct 1-31, 2026')).toBeTruthy()
  })

  it('draws one bar group per day and summarises the monthly cash flow', () => {
    render(<DashboardPage />)

    const cashFlow = region('Cash flow')
    expect(
      within(cashFlow).getByRole('img', {
        name: 'Cash flow chart for October 2026. Income 4,000, expenses 1,500, net 2,500.',
      }).children,
    ).toHaveLength(31)
    expect(within(cashFlow).getByText('+2,500')).toBeTruthy()
    // 1,500 spent over the 15 elapsed days of October.
    expect(within(cashFlow).getByText('100')).toBeTruthy()
  })

  it('shows a negative net cash flow with a minus sign and without success styling', () => {
    mocks.monthlyCashFlow = cashFlowResponse('monthly', {
      income: 1000,
      expenses: 1500,
      netCashFlow: -500,
    })
    render(<DashboardPage />)

    const net = within(region('Cash flow')).getByText('-500')
    expect(net.className).toContain('text-destructive-text')
    expect(net.className).not.toContain('text-success-text')
  })

  it('lists every expense category from the API in API order', () => {
    render(<DashboardPage />)

    const breakdown = region('Spending by category')
    const names = within(breakdown)
      .getAllByText(/^(Food|Uncategorized|Travel)$/)
      .map((element) => element.textContent)
    expect(names).toEqual(['Food', 'Uncategorized', 'Travel'])
    expect(within(breakdown).getByText('66.7% of expenses')).toBeTruthy()
  })

  it('shows an empty state when the month has no expenses', () => {
    mocks.categories = {
      ...categories,
      totalExpenses: 0,
      data: [{ categoryId: 2, title: 'Food', amount: 0, percentage: 0 }],
    }
    render(<DashboardPage />)

    expect(within(region('Spending by category')).getByText('No expenses yet')).toBeTruthy()
  })

  it('shows loading placeholders while summary data is pending', () => {
    Object.assign(mocks.summaryState, { isPending: true })
    Object.assign(mocks.categoriesState, { isPending: true })
    Object.assign(mocks.cashFlowState, { isPending: true })
    render(<DashboardPage />)

    expect(screen.getByLabelText('Loading income')).toBeTruthy()
    expect(screen.getByLabelText('Loading cash flow')).toBeTruthy()
    expect(screen.getByLabelText('Loading spending by category')).toBeTruthy()
  })

  it('offers a retry for each failed summary request', () => {
    Object.assign(mocks.summaryState, { isError: true })
    Object.assign(mocks.categoriesState, { isError: true })
    Object.assign(mocks.cashFlowState, { isError: true })
    render(<DashboardPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Retry summary' }))
    fireEvent.click(screen.getByRole('button', { name: 'Retry cash flow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Retry categories' }))

    expect(mocks.refetchSummary).toHaveBeenCalledOnce()
    expect(mocks.refetchCashFlow).toHaveBeenCalledOnce()
    expect(mocks.refetchCategories).toHaveBeenCalledOnce()
  })

  it('uses yearly summary totals, counts, and categories independently of cash flow', () => {
    render(<DashboardPage />)
    fireEvent.click(screen.getByRole('tab', { name: 'yearly' }))

    expect(mocks.fetchCashFlow).toHaveBeenLastCalledWith({ type: 'yearly', year: 2026 })
    expect(mocks.fetchSummary).toHaveBeenLastCalledWith({ year: 2026 })
    expect(mocks.fetchCategories).toHaveBeenLastCalledWith({ year: 2026 })

    const metrics = region('2026 overview financial summary')
    expect(within(metrics).getByText('30,000')).toBeTruthy()
    expect(within(metrics).getByText('12,500')).toBeTruthy()
    expect(within(metrics).getByText('17,500')).toBeTruthy()
    expect(within(metrics).getByText('37 total transactions')).toBeTruthy()
    expect(within(metrics).getByText('1,200')).toBeTruthy()

    expect(
      within(region('Cash flow')).getByRole('img', { name: /Cash flow chart for 2026/ }).children,
    ).toHaveLength(12)
    const breakdown = within(region('Spending by category'))
    expect(breakdown.getByText('12,500')).toBeTruthy()
    expect(breakdown.getByText('100% of expenses')).toBeTruthy()
    expect(breakdown.getByText('Food')).toBeTruthy()

    Object.assign(mocks.cashFlowState, { isError: true })
    fireEvent.click(screen.getByRole('tab', { name: 'monthly' }))
    fireEvent.click(screen.getByRole('tab', { name: 'yearly' }))
    expect(within(metrics).getByText('17,500')).toBeTruthy()
    expect(screen.getByText('Could not load cash flow')).toBeTruthy()
  })
})
