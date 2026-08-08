import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteTransaction,
  getTransactions,
  patchTransaction,
  postTransaction,
} from "#/api/transaction/transaction.api"
import type { PaginationParams } from "#/api/types"
import type { CreateTransactionDto } from "#/api/transaction/transaction.type"

export const useFetchTransaction = (params?: PaginationParams) => {
  return useQuery({ queryKey: ['transaction', params], queryFn: () => getTransactions(params) })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTransactionDto) => postTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] })
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateTransactionDto> }) =>
      patchTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] })
    },
  })
}
