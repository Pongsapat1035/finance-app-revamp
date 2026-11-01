import type { TransactionType } from '#/enum/enum'
import type { PaginatedResponse, PaginationParams } from '../types'

export interface Category extends CreateCategoryDto {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  color?: string
}

export type CategoryResponse = PaginatedResponse<Category>

export interface CategoryQueryParams extends PaginationParams {
  keyword?: string
  type?: TransactionType
}

export interface CreateCategoryDto {
  title: string
  type: TransactionType
}
