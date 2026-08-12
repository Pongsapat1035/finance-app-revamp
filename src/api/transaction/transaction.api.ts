import { apiClient } from '../client'
import type { PaginationParams } from '../types'
import type { CreateTransactionDto, Transaction, TransactionResponse } from './transaction.type'

export const postTransaction = (payload: CreateTransactionDto) => {
  return apiClient.post<Transaction>('/transaction', payload)
}

export const getTransactions = (params?: PaginationParams) => {
  return apiClient.get<TransactionResponse>('/transaction', { params })
}

export const putTransaction = (id: number, payload: CreateTransactionDto) => {
  return apiClient.put<Transaction>(`/transaction/${id}`, payload)
}

export const deleteTransaction = (id: number) => {
  return apiClient.delete(`/transaction/${id}`)
}
