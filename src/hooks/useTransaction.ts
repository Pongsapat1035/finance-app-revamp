import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { isAxiosError } from 'axios'
import {
  getExpensesByCategory,
  getNetCashFlow,
  getTransactionSummary,
} from '#/api/summary/summary.api'
import type {
  ExpensesByCategoryQueryParams,
  NetCashFlowQueryParams,
  TransactionSummaryQueryParams,
} from '#/api/summary/summary.type'
import {
  deleteTransaction,
  getTransactions,
  putTransaction,
  postTransaction,
} from '#/api/transaction/transaction.api'
import type { PaginatedResponse } from '#/api/types'
import type {
  CreateTransactionDto,
  NormalizedTransaction,
  TransactionQueryParams,
} from '#/api/transaction/transaction.type'

export const useFetchTransaction = (params?: TransactionQueryParams) => {
  return useQuery({
    queryKey: ['transaction', params],
    queryFn: () => getTransactions(params),
    select: (data): PaginatedResponse<NormalizedTransaction> => ({
      data: data.data.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        date: dayjs(transaction.date).format('YYYY-MM-DD'),
        description: transaction.description,
        categoryId: transaction.category?.id,
        categoryTitle: transaction.category?.title,
      })),
      meta: data.meta,
    }),
  })
}

const retrySummaryRequest = (failureCount: number, error: Error) => {
  if (isAxiosError(error) && [400, 401, 403, 429].includes(error.response?.status ?? 0)) {
    return false
  }
  return failureCount < 3
}

export const useFetchTransactionSummary = (params: TransactionSummaryQueryParams) => {
  return useQuery({
    // Keep both periods under the transaction prefix so mutations refresh every summary.
    queryKey: ['transaction', 'summary', params],
    queryFn: () => getTransactionSummary(params),
    staleTime: 60_000,
    retry: retrySummaryRequest,
  })
}

export const useFetchExpensesByCategory = (params: ExpensesByCategoryQueryParams) => {
  return useQuery({
    queryKey: ['transaction', 'summary', 'expenses-by-category', params],
    queryFn: () => getExpensesByCategory(params),
    staleTime: 60_000,
    retry: retrySummaryRequest,
  })
}

export const useFetchNetCashFlow = (params: NetCashFlowQueryParams) => {
  return useQuery({
    queryKey: ['transaction', 'summary', 'net-cash-flow', params],
    queryFn: () => getNetCashFlow(params),
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTransactionDto) => postTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
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
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
    },
  })
}
