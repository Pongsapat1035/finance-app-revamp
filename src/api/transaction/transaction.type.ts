import type { TransactionType } from '#/enum/enum'
import type { PaginatedResponse } from '../types'
import type { Category } from '../category/category.type'

export interface Transaction extends CreateTransactionDto {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  category: Category
}

export type TransactionResponse = PaginatedResponse<Transaction>

export interface CreateTransactionDto {
  categoryId: number
  type: TransactionType
  amount: number
  description: string
  date: string
}

export interface NormalizedTransaction {
  id: number
  type: TransactionType
  amount: number
  date: string
  description: string
  categoryId: number
  categoryTitle: string
}
