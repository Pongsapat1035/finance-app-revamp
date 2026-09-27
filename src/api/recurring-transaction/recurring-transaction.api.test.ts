import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from '../client'
import {
  deleteRecurringTransaction,
  getRecurringTransaction,
  getRecurringTransactions,
  getUpcomingRecurringTransactions,
  postRecurringTransaction,
  putRecurringTransaction,
} from './recurring-transaction.api'
import type { CreateRecurringTransactionDto } from './recurring-transaction.type'

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const payload: CreateRecurringTransactionDto = {
  categoryId: 1,
  title: 'Monthly rent',
  description: 'Condominium rent',
  amount: 12000.5,
  dayOfMonth: 1,
  startDate: '2026-09-01T00:00:00+07:00',
  endDate: null,
  isActive: true,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('recurring transaction API', () => {
  it('creates and updates a recurring transaction with the task payload', () => {
    postRecurringTransaction(payload)
    putRecurringTransaction(12, payload)

    expect(apiClient.post).toHaveBeenCalledWith('/recurring-transaction', payload)
    expect(apiClient.put).toHaveBeenCalledWith('/recurring-transaction/12', payload)
  })

  it('lists recurring transactions with supported filters', () => {
    const params = { page: 1, limit: 10, keyword: 'rent', categoryId: 1, isActive: true }

    getRecurringTransactions(params)

    expect(apiClient.get).toHaveBeenCalledWith('/recurring-transaction', { params })
  })

  it('loads one recurring transaction and upcoming occurrences', () => {
    getRecurringTransaction(12)
    getUpcomingRecurringTransactions()

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/recurring-transaction/12')
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/recurring-transaction/upcoming')
  })

  it('deletes a recurring transaction', () => {
    deleteRecurringTransaction(12)

    expect(apiClient.delete).toHaveBeenCalledWith('/recurring-transaction/12')
  })
})
