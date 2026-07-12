import type { TransactionType } from '#/enum/enum'
import type { PaginatedResponse } from '../types'

export interface Category extends CreateCategoryDto {
  id: string
  createAt: Date
  updateAt: Date
}

export type CategoryResponse = PaginatedResponse<Category>

export interface CreateCategoryDto {
     title: string
     type: TransactionType
     color: string
}
