import type { TransactionType } from '#/enum/enum'

export interface BudgetCategory {
  id: number
  title: string
  type: TransactionType.EXPEND
  color?: string
}

export interface Budget {
  id: number
  userId: number
  categoryId: number | null
  period: string
  plannedAmount: number | null
  spentAmount: number
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetDto {
  period: string
  categoryId: number | null
  plannedAmount: number
}

export type UpdateBudgetDto = Partial<CreateBudgetDto>

export interface BudgetQueryParams {
  period: string
}

export interface BudgetRow {
  id: number | null
  categoryId: number | null
  category: BudgetCategory | null
  label?: 'Uncategorized'
  hasBudget: boolean
  planned: number
  spent: number
  remaining: number
  isOverBudget: boolean
  percentUsed: number
}

export interface BudgetSummary {
  totalPlanned: number
  totalSpent: number
  totalRemaining: number
  plannedBudgetCount: number
  percentOfPlanned: number
}

export interface BudgetPeriodResponse {
  period: string
  data: BudgetRow[]
  summary: BudgetSummary
}

export interface ExceededBudgetRow extends BudgetRow {
  exceededBy: number
}

export interface ExceededBudgetSummary {
  categoryCount: number
  totalExceeded: number
}

export interface ExceededBudgetResponse {
  period: string
  data: ExceededBudgetRow[]
  summary: ExceededBudgetSummary
}
