import { apiClient } from '../client'
import type { Category, CategoryQueryParams, CategoryResponse, CreateCategoryDto } from './category.type'

export const postCategory = (payload: CreateCategoryDto) => {
  return apiClient.post<Category>('/category', payload)
}

export const getCategories = (params?: CategoryQueryParams) => {
  return apiClient.get<CategoryResponse>('/category', { params })
}

export const patchCategory = (id: number, payload: CreateCategoryDto) => {
  return apiClient.patch<Category>(`/category/${id}`, payload)
}

export const deleteCategory = (id: number) => {
  return apiClient.delete(`/category/${id}`)
}
