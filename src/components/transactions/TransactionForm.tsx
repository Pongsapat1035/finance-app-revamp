import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import TypeSelector from '#/components/ui/TypeSelector'
import Button from '#/components/ui/Button'
import IconButton from '#/components/ui/IconButton'
import type { Category as ApiCategory } from '#/api/category/category.type'
import { TransactionType as ApiTransactionType } from '#/enum/enum'
import { SelectField } from '#/components/ui/Select'

type TransactionType = 'expense' | 'income'

const TYPE_TO_API_TYPE: Record<TransactionType, ApiTransactionType> = {
  expense: ApiTransactionType.EXPEND,
  income: ApiTransactionType.INCOME,
}

interface TransactionFormProps {
  type: TransactionType
  setType: (value: TransactionType) => void
  categories: ApiCategory[]
  onManageCategories: () => void
  onClose: () => void
}

const TransactionForm = ({
  type,
  setType,
  categories,
  onManageCategories,
  onClose,
}: TransactionFormProps) => {
  const [categoryId, setCategoryId] = useState<string>('default')
  const availableCategories = categories
    .filter((category) => category.type === TYPE_TO_API_TYPE[type])
    .map((el) => ({ label: el.title, value: String(el.id) }))

  return (
    <>
      <div className="border-b px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="transaction-dialog-title" className="text-xl font-medium tracking-tight">
              Add transaction
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Record money coming in or going out.
            </p>
          </div>
          <IconButton onClick={onClose} aria-label="Close dialog">
            <X size={17} />
          </IconButton>
        </div>
      </div>

      <form className="grid gap-6 p-5 sm:p-6" onSubmit={(event) => event.preventDefault()}>
        <TypeSelector value={type} onChange={setType} />

        <label className="grid gap-2 text-[13px] font-medium" htmlFor="transaction-amount">
          Amount
          <span className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-muted-foreground">
              $
            </span>
            <input
              id="transaction-amount"
              name="amount"
              inputMode="decimal"
              placeholder="0.00"
              className="ds-focus-ring h-14 w-full rounded-sm border border-input bg-background pl-10 pr-4 font-mono text-2xl font-medium tracking-[-0.04em] placeholder:text-[#aaa9a5]"
            />
          </span>
          <span className="text-[11px] font-normal text-muted-foreground">
            Amount is recorded in USD.
          </span>
        </label>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="transaction-category" className="text-[13px] font-medium">
              Category
            </label>
            <button
              type="button"
              onClick={onManageCategories}
              className="ds-focus-ring text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Manage categories
            </button>
          </div>

          <SelectField
            label=""
            options={[{ label: 'Select a category', value: 'default' }, ...availableCategories]}
            onValueChange={setCategoryId}
            value={categoryId}
          />

          <span className="text-[11px] text-muted-foreground">
            Categories change based on transaction type.
          </span>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" height="h-10" fullWidth={false} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            height="h-10"
            fullWidth={false}
            suffixIcon={<ArrowRight size={15} strokeWidth={2} />}
          >
            Add transaction
          </Button>
        </div>
      </form>
    </>
  )
}

export { type TransactionType, TYPE_TO_API_TYPE }
export default TransactionForm
