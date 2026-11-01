import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteCategory,
  getCategories,
  patchCategory,
  postCategory,
} from '#/api/category/category.api'
import type { CategoryQueryParams, CreateCategoryDto } from '#/api/category/category.type'

export const useFetchCategory = (params?: CategoryQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ['category', params] as const,
    queryFn: () => getCategories(params),
    enabled,
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1]?.type === params?.type ? previousData : undefined,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryDto) => postCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
      queryClient.invalidateQueries({
        queryKey: ['transaction', 'summary', 'expenses-by-category'],
      })
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
      queryClient.invalidateQueries({ queryKey: ['transaction'] })
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
      queryClient.invalidateQueries({
        queryKey: ['transaction', 'summary', 'expenses-by-category'],
      })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  })
}
