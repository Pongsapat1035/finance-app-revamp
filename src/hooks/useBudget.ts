import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteBudget,
  getBudget,
  getBudgets,
  getExceededBudgets,
  patchBudget,
  postBudget,
} from '#/api/budget/budget.api'
import type { BudgetQueryParams, CreateBudgetDto, UpdateBudgetDto } from '#/api/budget/budget.type'

const budgetQueryKey = ['budget'] as const

export const useFetchBudget = (params: BudgetQueryParams) => {
  return useQuery({
    queryKey: [...budgetQueryKey, params],
    queryFn: () => getBudgets(params),
  })
}

export const useFetchExceededBudget = (params: BudgetQueryParams) => {
  return useQuery({
    queryKey: [...budgetQueryKey, 'exceeded', params],
    queryFn: () => getExceededBudgets(params),
  })
}

export const useFetchBudgetById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: [...budgetQueryKey, id],
    queryFn: () => getBudget(id),
    enabled,
  })
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBudgetDto) => postBudget(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetQueryKey }),
  })
}

export const useUpdateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBudgetDto }) =>
      patchBudget(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetQueryKey }),
  })
}

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteBudget(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetQueryKey }),
  })
}
