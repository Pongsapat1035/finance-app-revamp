import { apiClient } from '../client'
import type {
  Budget,
  BudgetPeriodResponse,
  BudgetQueryParams,
  CreateBudgetDto,
  ExceededBudgetResponse,
  UpdateBudgetDto,
} from './budget.type'

const budgetEndpoint = '/budget'

export const postBudget = (payload: CreateBudgetDto) => {
  return apiClient.post<Budget>(budgetEndpoint, payload)
}

export const getBudgets = (params: BudgetQueryParams) => {
  return apiClient.get<BudgetPeriodResponse>(budgetEndpoint, { params })
}

export const getExceededBudgets = (params: BudgetQueryParams) => {
  return apiClient.get<ExceededBudgetResponse>(`${budgetEndpoint}/exceeded`, { params })
}

export const getBudget = (id: number) => {
  return apiClient.get<Budget>(`${budgetEndpoint}/${id}`)
}

export const patchBudget = (id: number, payload: UpdateBudgetDto) => {
  return apiClient.patch<Budget>(`${budgetEndpoint}/${id}`, payload)
}

export const deleteBudget = (id: number) => {
  return apiClient.delete<Budget>(`${budgetEndpoint}/${id}`)
}
