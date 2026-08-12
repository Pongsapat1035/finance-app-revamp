import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteCategory,
  getCategories,
  patchCategory,
  postCategory,
} from "#/api/category/category.api"
import type { PaginationParams } from "#/api/types"
import type { CreateCategoryDto } from "#/api/category/category.type"

export const useFetchCategory = (params?: PaginationParams) => {
  return useQuery({ queryKey: ['category', params], queryFn: () => getCategories(params) })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryDto) => postCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
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
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
    },
  })
}
