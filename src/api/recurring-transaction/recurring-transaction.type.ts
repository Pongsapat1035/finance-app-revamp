import type { TransactionType } from '#/enum/enum'
import type { PaginationMeta, PaginationParams } from '../types'

export interface RecurringTransactionCategory {
  id: number
  title: string
  type: TransactionType
}

export interface CreateRecurringTransactionDto {
  categoryId: number
  title: string
  description: string
  amount: number
  dayOfMonth: number
  startDate: string
  endDate: string | null
  isActive: boolean
}

export type UpdateRecurringTransactionDto = CreateRecurringTransactionDto

export interface RecurringTransaction extends CreateRecurringTransactionDto {
  id: number
  userId: number
  category: RecurringTransactionCategory
  nextRunAt: string
  createdAt: string
  updatedAt: string
}

export interface RecurringTransactionQuery extends PaginationParams {
  keyword?: string
  categoryId?: number
  isActive?: boolean
}

export interface RecurringTransactionMeta extends PaginationMeta {
  expectedTotal: number
}

export interface RecurringTransactionResponse {
  data: RecurringTransaction[]
  meta: RecurringTransactionMeta
}

export interface UpcomingRecurringTransaction {
  id: number
  description: string
  category: RecurringTransactionCategory
  type: TransactionType
  amount: number
  dueDate: string
}

export interface UpcomingRecurringTransactionMeta {
  from: string
  to: string
  timezone: string
  total: number
  expectedTotal: number
}

export interface UpcomingRecurringTransactionResponse {
  data: UpcomingRecurringTransaction[]
  meta: UpcomingRecurringTransactionMeta
}
