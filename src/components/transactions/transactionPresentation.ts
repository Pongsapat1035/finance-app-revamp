import { ArrowDownLeft, ArrowUpRight, ChartNoAxesCombined, type LucideIcon } from 'lucide-react'
import { TransactionType } from '#/enum/enum'

export const transactionPresentation: Record<TransactionType, { label: string; icon: LucideIcon }> =
  {
    [TransactionType.EXPEND]: { label: 'Expense', icon: ArrowUpRight },
    [TransactionType.INCOME]: { label: 'Income', icon: ArrowDownLeft },
    [TransactionType.INVESTMENT]: { label: 'Investment', icon: ChartNoAxesCombined },
  }
