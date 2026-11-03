import { CircleAlert, LoaderCircle, X } from 'lucide-react'
import TypeSelector from '#/components/ui/TypeSelector'
import Button from '#/components/ui/Button'
import IconButton from '#/components/ui/IconButton'
import { BaseModalBody, BaseModalFooter, BaseModalHeader } from '#/components/ui/BaseModal'
import type { Category as ApiCategory } from '#/api/category/category.type'
import { TransactionType } from '#/enum/enum'
import { SelectField } from '#/components/ui/Select'
import InputField from '#/components/ui/InputField'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { useState } from 'react'

type SelectedCategory = Pick<ApiCategory, 'id' | 'title' | 'type'>

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
  initialCategory?: SelectedCategory
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
  initialCategory,
  isSubmitting = false,
  submitError,
}: TransactionFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const matchingCategories: SelectedCategory[] = categories.filter(
    (category) => category.type === type,
  )
  // Search and pagination can omit the selected category; retain its display label.
  if (
    selectedCategory?.type === type &&
    !matchingCategories.some((category) => category.id === selectedCategory.id)
  ) {
    matchingCategories.push(selectedCategory)
  }
  const availableCategories = matchingCategories.map((category) => ({
    label: category.title,
    value: String(category.id),
  }))

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
            <h2 id="transaction-dialog-title" className="text-lg font-medium tracking-[-0.02em]">
              {mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {mode === 'edit'
                ? 'Update the amount, category, date, or description.'
                : 'Record money coming in or going out.'}
            </p>
          </div>
          <IconButton
            size="size-8"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            <X size={16} strokeWidth={1.75} />
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
          <TypeSelector
            value={type}
            onChange={(nextType) => {
              if (nextType === type) return
              form.setFieldValue('categoryId', 'default')
              setSelectedCategory(undefined)
              onCategorySearch?.('')
              setType(nextType)
            }}
          />

          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                !value || Number(value) <= 0
                  ? 'Enter an amount greater than 0'
                  : Number(value) > 21_474_836.47
                    ? 'Enter an amount no greater than 21,474,836.47'
                    : undefined,
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
                      placeholder="0"
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
                  onValueChange={(value) => {
                    field.handleChange(value)
                    setSelectedCategory(
                      matchingCategories.find((category) => String(category.id) === value),
                    )
                  }}
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
                      : availableCategories.length === 0
                        ? 'No matching categories. Open Manage categories to create one.'
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

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => (!value.trim() ? 'Description is required' : undefined),
            }}
          >
            {(field) => (
              <div className="grid gap-2">
                <InputField
                  id="transaction-description"
                  label="Description"
                  placeholder="Add a note"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  error={field.state.meta.errors.join(', ')}
                  touched={field.state.meta.isTouched}
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
            fullWidth={false}
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth={false}
            disabled={isSubmitting}
            prefixIcon={
              isSubmitting ? (
                <LoaderCircle
                  size={16}
                  strokeWidth={1.75}
                  className="animate-spin motion-reduce:animate-none"
                />
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

export { type TransactionFormValues, type TransactionFormMode }
export default TransactionForm
