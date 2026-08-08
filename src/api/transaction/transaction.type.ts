import type { TransactionType } from '#/enum/enum'
import type { PaginatedResponse } from '../types'
import type { Category } from '../category/category.type'

export interface Transaction extends CreateTransactionDto {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  categories: Category[]
}

export type TransactionResponse = PaginatedResponse<Transaction>

export interface CreateTransactionDto {
  categoryId: number
  type: TransactionType
  amount: number
  description: string
  date: string
}
