export type SummaryPeriod = { month: string; year?: never } | { year: number; month?: never }

export type TransactionSummaryQueryParams = SummaryPeriod

export type TransactionSummaryResponse = SummaryPeriod & {
  income: number
  expenses: number
  investment: number
  net: number
  incomeTransactionCount: number
  expenseTransactionCount: number
  investmentTransactionCount: number
  transactionCount: number
}

export type ExpensesByCategoryQueryParams = SummaryPeriod | { month?: never; year?: never }

export interface ExpenseCategorySummary {
  categoryId: number | null
  title: string
  amount: number
  percentage: number
}

export type ExpensesByCategoryResponse = SummaryPeriod & {
  totalExpenses: number
  data: ExpenseCategorySummary[]
}

export type NetCashFlowQueryParams =
  { type: 'monthly'; month: string } | { type: 'yearly'; year: number }

export interface NetCashFlowAmounts {
  income: number
  expenses: number
  netCashFlow: number
}

export interface NetCashFlowResponse {
  type: NetCashFlowQueryParams['type']
  period: string
  timezone: 'Asia/Bangkok'
  totals: NetCashFlowAmounts
  data: Array<NetCashFlowAmounts & { period: string }>
}
