import { useEffect, useState, type FormEvent } from 'react'
import dayjs from 'dayjs'
import { LoaderCircle } from 'lucide-react'
import type { BudgetRow } from '#/api/budget/budget.type'
import BaseModal, {
  BaseModalBody,
  BaseModalContent,
  BaseModalDescription,
  BaseModalFooter,
  BaseModalHeader,
  BaseModalTitle,
} from '#/components/ui/BaseModal'
import Button from '#/components/ui/Button'
import InputField from '#/components/ui/InputField'
import { SelectField } from '#/components/ui/Select'
import { handleAxiosError } from '#/lib/handleAxiosError'

interface BudgetFormValues {
  categoryId: number | null
  plannedAmount: number
}

interface BudgetFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: string
  budget: BudgetRow | null
  rows: BudgetRow[]
  isSubmitting: boolean
  onSubmit: (values: BudgetFormValues) => Promise<void>
}

function parseAmount(value: string): number | null {
  const trimmed = value.trim()
  if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) return null

  const amount = Number(trimmed)
  return Number.isFinite(amount) ? amount : null
}

export default function BudgetFormModal({
  open,
  onOpenChange,
  period,
  budget,
  rows,
  isSubmitting,
  onSubmit,
}: BudgetFormModalProps) {
  const periodLabel = dayjs(`${period}-01`).format('MMMM YYYY')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryError, setCategoryError] = useState<string>()
  const [amountError, setAmountError] = useState<string>()
  const [submitError, setSubmitError] = useState<string>()

  useEffect(() => {
    if (!open) return
    setSelectedCategory('')
    setAmount(budget ? String(budget.planned) : '')
    setCategoryError(undefined)
    setAmountError(undefined)
    setSubmitError(undefined)
  }, [budget, open, period])

  const availableCategories = rows.filter((row) => !row.hasBudget)
  const hasUncategorizedPlan = rows.some((row) => row.categoryId === null && row.hasBudget)
  const options = [
    ...(!hasUncategorizedPlan ? [{ value: 'uncategorized', label: 'Uncategorized' }] : []),
    ...availableCategories
      .filter((row) => row.categoryId !== null)
      .map((row) => ({ value: String(row.categoryId), label: row.category?.title ?? 'Category' })),
  ]
  const name = budget?.category?.title ?? 'Uncategorized'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const plannedAmount = parseAmount(amount)
    const missingCategory = !budget && !selectedCategory
    setCategoryError(missingCategory ? 'Choose a category.' : undefined)
    setAmountError(
      plannedAmount === null ? 'Enter a valid amount with up to two decimal places.' : undefined,
    )
    setSubmitError(undefined)

    if (missingCategory || plannedAmount === null) return

    try {
      await onSubmit({
        categoryId: budget
          ? budget.categoryId
          : selectedCategory === 'uncategorized'
            ? null
            : Number(selectedCategory),
        plannedAmount,
      })
    } catch (error) {
      const { message, statusCode } = handleAxiosError(error)
      setSubmitError(statusCode === null ? 'Could not save the budget. Try again.' : message)
    }
  }

  return (
    <BaseModal open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <BaseModalContent
        className="sm:max-w-md"
        showCloseButton={!isSubmitting}
        onEscapeKeyDown={(event) => isSubmitting && event.preventDefault()}
        onInteractOutside={(event) => isSubmitting && event.preventDefault()}
      >
        <BaseModalHeader className="pr-14">
          <BaseModalTitle className="text-lg font-medium tracking-[-0.02em]">
            {budget ? 'Edit budget' : 'Create budget'}
          </BaseModalTitle>
          <BaseModalDescription className="mt-1 text-xs leading-5 text-muted-foreground">
            {budget
              ? `Change the ${name} plan for ${periodLabel}.`
              : `Set a category plan for ${periodLabel}.`}
          </BaseModalDescription>
        </BaseModalHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
          <BaseModalBody className="grid gap-4">
            {budget ? (
              <div className="grid gap-2 text-[13px]">
                <span className="font-medium">Category</span>
                <span className="rounded-sm border bg-muted px-3 py-2.5">{name}</span>
              </div>
            ) : (
              <SelectField
                label="Category"
                options={options}
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value)
                  setCategoryError(undefined)
                }}
                placeholder="Choose a category"
                error={categoryError}
                required
              />
            )}
            <InputField
              id="budget-amount"
              label="Monthly plan"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value)
                setAmountError(undefined)
              }}
              error={amountError}
              touched={Boolean(amountError)}
              helperText="Enter an amount with up to two decimal places."
              required
            />
            {submitError && (
              <p role="alert" className="text-xs text-destructive-text">
                {submitError}
              </p>
            )}
          </BaseModalBody>
          <BaseModalFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              fullWidth={false}
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
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
              {isSubmitting ? 'Saving' : budget ? 'Save budget' : 'Create budget'}
            </Button>
          </BaseModalFooter>
        </form>
      </BaseModalContent>
    </BaseModal>
  )
}
