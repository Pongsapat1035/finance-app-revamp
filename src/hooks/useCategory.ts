import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteCategory,
  getCategories,
  patchCategory,
  postCategory,
} from '#/api/category/category.api'
import type { CategoryQueryParams, CreateCategoryDto } from '#/api/category/category.type'

export const useFetchCategory = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: ['category', params],
    queryFn: () => getCategories(params),
    placeholderData: (previousData) => previousData,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryDto) => postCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateCategoryDto }) =>
      patchCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  })
}
