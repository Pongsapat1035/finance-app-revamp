import { describe, expect, it, vi } from 'vitest'

import { apiClient } from '#/api/client'
import { getExpensesByCategory, getNetCashFlow, getTransactionSummary } from './summary.api'

vi.mock('#/api/client', () => ({
  apiClient: { get: vi.fn() },
}))

describe('summary API', () => {
  it('requests the monthly transaction summary', () => {
    getTransactionSummary({ month: '2026-10' })

    expect(apiClient.get).toHaveBeenCalledWith('/summary/transaction', {
      params: { month: '2026-10' },
    })
  })

  it('requests expenses by category for a month', () => {
    getExpensesByCategory({ month: '2026-10' })

    expect(apiClient.get).toHaveBeenCalledWith('/summary/expenses-by-category', {
      params: { month: '2026-10' },
    })
  })

  it('requests monthly and yearly net cash flow', () => {
    getNetCashFlow({ type: 'monthly', month: '2026-10' })
    getNetCashFlow({ type: 'yearly', year: 2026 })

    expect(apiClient.get).toHaveBeenCalledWith('/summary/net-cash-flow', {
      params: { type: 'monthly', month: '2026-10' },
    })
    expect(apiClient.get).toHaveBeenCalledWith('/summary/net-cash-flow', {
      params: { type: 'yearly', year: 2026 },
    })
  })
})
