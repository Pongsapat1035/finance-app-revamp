import { apiClient } from '../client'
import type {
  CreateTransactionDto,
  Transaction,
  TransactionQueryParams,
  TransactionResponse,
} from './transaction.type'

export const postTransaction = (payload: CreateTransactionDto) => {
  return apiClient.post<Transaction>('/transaction', payload)
}

export const getTransactions = (params?: TransactionQueryParams) => {
  return apiClient.get<TransactionResponse>('/transaction', { params })
}

export const putTransaction = (id: number, payload: CreateTransactionDto) => {
  return apiClient.put<Transaction>(`/transaction/${id}`, payload)
}

export const deleteTransaction = (id: number) => {
  return apiClient.delete(`/transaction/${id}`)
}
