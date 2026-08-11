import { ArrowRight, X } from 'lucide-react'
import TypeSelector from '#/components/ui/TypeSelector'
import Button from '#/components/ui/Button'
import IconButton from '#/components/ui/IconButton'
import type { Category as ApiCategory } from '#/api/category/category.type'
import { TransactionType as ApiTransactionType } from '#/enum/enum'
import { SelectField } from '#/components/ui/Select'
import InputField from '#/components/ui/InputField'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'

type TransactionType = 'expense' | 'income'

const TYPE_TO_API_TYPE: Record<TransactionType, ApiTransactionType> = {
  expense: ApiTransactionType.EXPEND,
  income: ApiTransactionType.INCOME,
}

interface TransactionFormValues {
  amount: string
  categoryId: string
  date: string
  description: string
}

interface TransactionFormProps {
  type: TransactionType
  setType: (value: TransactionType) => void
  categories: ApiCategory[]
  onManageCategories: () => void
  onClose: () => void
  onSubmit: (value: TransactionFormValues) => Promise<void> | void
}

const TransactionForm = ({
  type,
  setType,
  categories,
  onManageCategories,
  onClose,
  onSubmit,
}: TransactionFormProps) => {
  const availableCategories = categories
    .filter((category) => category.type === TYPE_TO_API_TYPE[type])
    .map((el) => ({ label: el.title, value: String(el.id) }))

  const today = dayjs().format('YYYY-MM-DD')

  const form = useForm({
    defaultValues: {
      amount: '',
      categoryId: 'default',
      date: today,
      description: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

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

      <form
        className="grid gap-6 p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <TypeSelector value={type} onChange={setType} />

        <form.Field
          name="amount"
          validators={{
            onChange: ({ value }) => (!value ? 'Amount is required' : undefined),
          }}
        >
          {(field) => (
            <label className="grid gap-2 text-[13px] font-medium" htmlFor="transaction-amount">
              Amount
              <span className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-muted-foreground">
                  $
                </span>
                <input
                  id="transaction-amount"
                  name={field.name}
                  inputMode="decimal"
                  placeholder="0.00"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const normalizedValue = event.target.value.replace(/\D/g, '')
                    field.handleChange(normalizedValue)
                  }}
                  className="ds-focus-ring h-14 w-full rounded-sm border border-input bg-background pl-10 pr-4 font-mono text-2xl font-medium tracking-[-0.04em] placeholder:text-[#aaa9a5]"
                />
              </span>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                <span className="text-[11px] font-normal text-destructive">
                  {field.state.meta.errors.join(', ')}
                </span>
              ) : (
                <span className="text-[11px] font-normal text-muted-foreground">
                  Amount is recorded in USD.
                </span>
              )}
            </label>
          )}
        </form.Field>

        <form.Field
          name="categoryId"
          validators={{
            onChange: ({ value }) =>
              !value || value === 'default' ? 'Category is required' : undefined,
          }}
        >
          {(field) => (
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
                id="transaction-category"
                label=""
                options={[{ label: 'Select a category', value: 'default' }, ...availableCategories]}
                onValueChange={field.handleChange}
                value={field.state.value}
                required
                error={field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined}
              />

              <span className="text-[11px] text-muted-foreground">
                Categories change based on transaction type.
              </span>
            </div>
          )}
        </form.Field>

        <form.Field
          name="date"
          validators={{
            onChange: ({ value }) => (!value ? 'Date is required' : undefined),
          }}
        >
          {(field) => (
            <div className="grid gap-2">
              <InputField
                id="transaction-date"
                label="Transaction date"
                type="date"
                max={today}
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                error={field.state.meta.errors.join(', ')}
                touched={field.state.meta.isTouched}
              />
              <span className="text-[11px] text-muted-foreground">
                Select the date the transaction occurred.
              </span>
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="grid gap-2">
              <InputField
                id="transaction-description"
                label="Description (optional)"
                placeholder="Add a note"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>

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

export { type TransactionType, type TransactionFormValues, TYPE_TO_API_TYPE }
export default TransactionForm
