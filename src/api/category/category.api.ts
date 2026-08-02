import { apiClient } from '../client'
import type { PaginationParams } from '../types'
import type { Category, CategoryResponse, CreateCategoryDto } from './category.type'

export const postCategory = (payload: CreateCategoryDto) => {
  return apiClient.post<Category>('/category', payload)
}

export const getCategories = (params?: PaginationParams) => {
  return apiClient.get<CategoryResponse>('/category', { params })
}

export const patchCategory = (id: number, payload: CreateCategoryDto) => {
  return apiClient.patch<Category>(`/category/${id}`, payload)
}

export const deleteCategory = (id: number) => {
  return apiClient.delete(`/category/${id}`)
}
