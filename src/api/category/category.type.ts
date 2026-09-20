import type { TransactionType } from '#/enum/enum'
import type { PaginatedResponse, PaginationParams } from '../types'

export interface Category extends CreateCategoryDto {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
}

export type CategoryResponse = PaginatedResponse<Category>

export interface CategoryQueryParams extends PaginationParams {
  keyword?: string
}

export interface CreateCategoryDto {
  title: string
  type: TransactionType
  color: string
}
