import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
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
  const { dateFilter, ...requestParams } = params ?? {}

  if (dateFilter === 'this_month') {
    requestParams.from = dayjs().startOf('month').format('YYYY-MM-DD')
    requestParams.to = dayjs().endOf('month').format('YYYY-MM-DD')
  } else if (dateFilter === 'last_month') {
    requestParams.from = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
    requestParams.to = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
  } else if (dateFilter === 'this_year') {
    requestParams.from = dayjs().startOf('year').format('YYYY-MM-DD')
    requestParams.to = dayjs().endOf('year').format('YYYY-MM-DD')
  }

  return useQuery({
    queryKey: ['transaction', requestParams],
    queryFn: () => getTransactions(requestParams),
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
