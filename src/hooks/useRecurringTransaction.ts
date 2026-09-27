import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteRecurringTransaction,
  getUpcomingRecurringTransactions,
  getRecurringTransactions,
  postRecurringTransaction,
  putRecurringTransaction,
} from '#/api/recurring-transaction/recurring-transaction.api'
import type {
  CreateRecurringTransactionDto,
  RecurringTransactionQuery,
  UpdateRecurringTransactionDto,
} from '#/api/recurring-transaction/recurring-transaction.type'

const recurringTransactionQueryKey = ['recurring-transaction'] as const

export const useFetchRecurringTransaction = (
  params?: RecurringTransactionQuery,
  enabled = true,
) => {
  return useQuery({
    queryKey: [...recurringTransactionQueryKey, params],
    queryFn: () => getRecurringTransactions(params),
    enabled,
  })
}

export const useFetchUpcomingRecurringTransaction = (enabled = true) => {
  return useQuery({
    queryKey: [...recurringTransactionQueryKey, 'upcoming'],
    queryFn: getUpcomingRecurringTransactions,
    enabled,
  })
}

export const useCreateRecurringTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRecurringTransactionDto) => postRecurringTransaction(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recurringTransactionQueryKey }),
  })
}

export const useUpdateRecurringTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRecurringTransactionDto }) =>
      putRecurringTransaction(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recurringTransactionQueryKey }),
  })
}

export const useDeleteRecurringTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteRecurringTransaction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recurringTransactionQueryKey }),
  })
}
