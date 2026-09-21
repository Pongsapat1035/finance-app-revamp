import { ArrowRight, CircleAlert, LoaderCircle, X } from 'lucide-react'
import TypeSelector from '#/components/ui/TypeSelector'
import Button from '#/components/ui/Button'
import IconButton from '#/components/ui/IconButton'
import { BaseModalBody, BaseModalFooter, BaseModalHeader } from '#/components/ui/BaseModal'
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

type TransactionFormMode = 'create' | 'edit'

interface TransactionFormProps {
  type: TransactionType
  setType: (value: TransactionType) => void
  categories: ApiCategory[]
  categoriesLoading?: boolean
  categoriesError?: string
  onCategorySearch?: (keyword: string) => void
  onManageCategories: () => void
  onClose: () => void
  onSubmit: (value: TransactionFormValues) => Promise<void> | void
  mode?: TransactionFormMode
  initialValues?: TransactionFormValues
  isSubmitting?: boolean
  submitError?: string
}

const TransactionForm = ({
  type,
  setType,
  categories,
  categoriesLoading = false,
  categoriesError,
  onCategorySearch,
  onManageCategories,
  onClose,
  onSubmit,
  mode = 'create',
  initialValues,
  isSubmitting = false,
  submitError,
}: TransactionFormProps) => {
  const availableCategories = categories
    .filter((category) => category.type === TYPE_TO_API_TYPE[type])
    .map((el) => ({ label: el.title, value: String(el.id) }))

  const today = dayjs().format('YYYY-MM-DD')

  const form = useForm({
    defaultValues: {
      amount: initialValues?.amount ?? '',
      categoryId: initialValues?.categoryId ?? 'default',
      date: initialValues?.date ?? today,
      description: initialValues?.description ?? '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <>
      <BaseModalHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="transaction-dialog-title" className="text-xl font-medium tracking-tight">
              {mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === 'edit'
                ? 'Update the amount, category, date, or description.'
                : 'Record money coming in or going out.'}
            </p>
          </div>
          <IconButton onClick={onClose} disabled={isSubmitting} aria-label="Close dialog">
            <X size={17} />
          </IconButton>
        </div>
      </BaseModalHeader>

      <form
        className="flex min-h-0 flex-1 flex-col"
        aria-busy={isSubmitting}
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <BaseModalBody className="grid gap-6">
          <TypeSelector value={type} onChange={setType} />

          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                !value || Number(value) <= 0 ? 'Enter an amount greater than 0' : undefined,
            }}
          >
            {(field) => {
              const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
              const descriptionId = hasError
                ? 'transaction-amount-error'
                : 'transaction-amount-helper'

              return (
                <div className="grid gap-2">
                  <label className="text-[13px] font-medium" htmlFor="transaction-amount">
                    Amount
                  </label>
                  <span className="relative">
                    <input
                      id="transaction-amount"
                      name={field.name}
                      inputMode="decimal"
                      placeholder="0.00"
                      required
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      aria-invalid={hasError || undefined}
                      aria-describedby={descriptionId}
                      onChange={(event) => {
                        const nextValue = event.target.value
                        if (/^\d*(\.\d{0,2})?$/.test(nextValue)) field.handleChange(nextValue)
                      }}
                      className="h-14 w-full rounded-sm border border-input bg-background px-4 font-mono text-2xl font-medium tracking-[-0.04em] transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-[#aaa9a5] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none motion-reduce:transition-none"
                    />
                  </span>
                  {hasError ? (
                    <span
                      id="transaction-amount-error"
                      className="text-[11px] font-normal text-destructive-text"
                    >
                      {field.state.meta.errors.join(', ')}
                    </span>
                  ) : (
                    <span
                      id="transaction-amount-helper"
                      className="text-[11px] font-normal text-muted-foreground"
                    >
                      Enter the transaction amount.
                    </span>
                  )}
                </div>
              )
            }}
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
                  ariaLabel="Category"
                  options={[
                    { label: 'Select a category', value: 'default' },
                    ...availableCategories,
                  ]}
                  onSearch={onCategorySearch}
                  onValueChange={field.handleChange}
                  value={field.state.value}
                  required
                  disabled={categoriesLoading || Boolean(categoriesError)}
                  error={
                    field.state.meta.isTouched ? field.state.meta.errors.join(', ') : undefined
                  }
                />

                {categoriesError ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-destructive-text">
                    <CircleAlert size={13} strokeWidth={1.75} />
                    Categories are unavailable. Open Manage categories to retry.
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {categoriesLoading
                      ? 'Loading available categories.'
                      : 'Categories change based on transaction type.'}
                  </span>
                )}
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

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-[12px] leading-5 text-destructive-text"
            >
              <CircleAlert size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
        </BaseModalBody>

        <BaseModalFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            height="h-10"
            fullWidth={false}
            disabled={isSubmitting}
            onClick={onClose}
            className="disabled:pointer-events-none disabled:opacity-45"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            height="h-10"
            fullWidth={false}
            disabled={isSubmitting}
            className="disabled:pointer-events-none disabled:opacity-70"
            prefixIcon={
              isSubmitting ? (
                <LoaderCircle
                  size={15}
                  strokeWidth={2}
                  className="animate-spin motion-reduce:animate-none"
                />
              ) : undefined
            }
            suffixIcon={
              !isSubmitting && mode === 'create' ? (
                <ArrowRight size={15} strokeWidth={2} />
              ) : undefined
            }
          >
            {isSubmitting ? 'Saving' : mode === 'edit' ? 'Save changes' : 'Add transaction'}
          </Button>
        </BaseModalFooter>
      </form>
    </>
  )
}

export {
  type TransactionType,
  type TransactionFormValues,
  type TransactionFormMode,
  TYPE_TO_API_TYPE,
}
export default TransactionForm
