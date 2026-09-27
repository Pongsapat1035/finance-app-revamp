import { apiClient } from '../client'
import type {
  CreateRecurringTransactionDto,
  RecurringTransaction,
  RecurringTransactionQuery,
  RecurringTransactionResponse,
  UpcomingRecurringTransactionResponse,
  UpdateRecurringTransactionDto,
} from './recurring-transaction.type'

const recurringTransactionEndpoint = '/recurring-transaction'

export const postRecurringTransaction = (payload: CreateRecurringTransactionDto) => {
  return apiClient.post<RecurringTransaction>(recurringTransactionEndpoint, payload)
}

export const getRecurringTransactions = (params?: RecurringTransactionQuery) => {
  return apiClient.get<RecurringTransactionResponse>(recurringTransactionEndpoint, { params })
}

export const getUpcomingRecurringTransactions = () => {
  return apiClient.get<UpcomingRecurringTransactionResponse>(
    `${recurringTransactionEndpoint}/upcoming`,
  )
}

export const getRecurringTransaction = (id: number) => {
  return apiClient.get<RecurringTransaction>(`${recurringTransactionEndpoint}/${id}`)
}

export const putRecurringTransaction = (id: number, payload: UpdateRecurringTransactionDto) => {
  return apiClient.put<RecurringTransaction>(`${recurringTransactionEndpoint}/${id}`, payload)
}

export const deleteRecurringTransaction = (id: number) => {
  return apiClient.delete<RecurringTransaction>(`${recurringTransactionEndpoint}/${id}`)
}
