import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import {
  deleteTransaction,
  getTransactions,
  putTransaction,
  postTransaction,
} from "#/api/transaction/transaction.api"
import type { PaginationParams, PaginatedResponse } from "#/api/types"
import type { CreateTransactionDto, NormalizedTransaction } from "#/api/transaction/transaction.type"

export const useFetchTransaction = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['transaction', params],
    queryFn: () => getTransactions(params),
    select: (data): PaginatedResponse<NormalizedTransaction> => ({
      data: data.data.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        date: dayjs(transaction.date).format('MMM D, YYYY'),
        description: transaction.description,
        categoryId: transaction.category?.id,
        categoryTitle: transaction.category?.title,
      })),
      meta: data.meta,
    }),
  })
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
    mutationFn: ({ id, payload }: { id: number; payload: CreateTransactionDto }) =>
      putTransaction(id, payload),
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
