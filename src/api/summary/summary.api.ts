import { apiClient } from '../client'
import type {
  ExpensesByCategoryQueryParams,
  ExpensesByCategoryResponse,
  NetCashFlowQueryParams,
  NetCashFlowResponse,
  TransactionSummaryQueryParams,
  TransactionSummaryResponse,
} from './summary.type'

export const getTransactionSummary = (params: TransactionSummaryQueryParams) => {
  return apiClient.get<TransactionSummaryResponse>('/summary/transaction', { params })
}

export const getExpensesByCategory = (params: ExpensesByCategoryQueryParams) => {
  return apiClient.get<ExpensesByCategoryResponse>('/summary/expenses-by-category', { params })
}

export const getNetCashFlow = (params: NetCashFlowQueryParams) => {
  return apiClient.get<NetCashFlowResponse>('/summary/net-cash-flow', { params })
}
