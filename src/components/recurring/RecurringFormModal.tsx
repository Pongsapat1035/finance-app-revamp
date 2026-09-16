import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { CalendarClock, CircleAlert, Plus, Save, X } from 'lucide-react'

import type { RecurringTransaction } from '#/api/recurring-transaction/recurring-transaction.type'
import BaseModal, {
  BaseModalBody,
  BaseModalContent,
  BaseModalDescription,
  BaseModalFooter,
  BaseModalHeader,
  BaseModalTitle,
} from '#/components/ui/BaseModal'
import Button from '#/components/ui/Button'
import Checkbox from '#/components/ui/Checkbox'
import DatePickerField from '#/components/ui/DatePicker'
import IconButton from '#/components/ui/IconButton'
import InputField from '#/components/ui/InputField'
import { SelectField } from '#/components/ui/Select'
import { TransactionType } from '#/enum/enum'

export interface RecurringFormValues {
  title: string
  description: string
  amount: number
  categoryId: number
  dayOfMonth: number
  startDate: string
  endDate: string | null
  isActive: boolean
}

export interface RecurringCategoryOption {
  id: number
  title: string
  type: TransactionType
}

interface RecurringFormModalProps {
  open: boolean
  transaction: RecurringTransaction | null
  categories: RecurringCategoryOption[]
  onOpenChange: (open: boolean) => void
  onSubmit: (values: RecurringFormValues) => void
}

interface FormState {
  title: string
  description: string
  amount: string
  categoryId: string
  dayOfMonth: string
  startDate: string
  endDate: string
  isActive: boolean
}

const today = dayjs().format('YYYY-MM-DD')

const getInitialState = (transaction: RecurringTransaction | null): FormState => {
  if (!transaction) {
    return {
      title: '',
      description: '',
      amount: '',
      categoryId: '',
      dayOfMonth: String(dayjs().date()),
      startDate: today,
      endDate: '',
      isActive: true,
    }
  }

  return {
    title: transaction.title,
    description: transaction.description,
    amount: String(transaction.amount),
    categoryId: String(transaction.categoryId),
    dayOfMonth: String(transaction.dayOfMonth),
    startDate: dayjs(transaction.startDate).format('YYYY-MM-DD'),
    endDate: transaction.endDate ? dayjs(transaction.endDate).format('YYYY-MM-DD') : '',
    isActive: transaction.isActive,
  }
}

const FieldLabel = ({ children, htmlFor }: { children: string; htmlFor: string }) => {
  return (
    <label htmlFor={htmlFor} className="text-[13px] font-medium text-foreground">
      {children}
    </label>
  )
}

const RecurringFormModal = ({
  open,
  transaction,
  categories,
  onOpenChange,
  onSubmit,
}: RecurringFormModalProps) => {
  const [form, setForm] = useState<FormState>(() => getInitialState(transaction))
  const [error, setError] = useState<string>()
  const editing = transaction !== null

  useEffect(() => {
    if (!open) return
    setForm(getInitialState(transaction))
    setError(undefined)
  }, [open, transaction])

  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.startDate) {
      setError('Select a start date.')
      return
    }
    if (form.endDate && dayjs(form.endDate).isBefore(dayjs(form.startDate), 'day')) {
      setError('End date must be on or after the start date.')
      return
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      categoryId: Number(form.categoryId),
      dayOfMonth: Number(form.dayOfMonth),
      startDate: dayjs(form.startDate).startOf('day').toISOString(),
      endDate: form.endDate ? dayjs(form.endDate).endOf('day').toISOString() : null,
      isActive: form.isActive,
    })
  }

  return (
    <BaseModal open={open} onOpenChange={onOpenChange}>
      <BaseModalContent
        showCloseButton={false}
        scrollable={false}
        className="sm:max-w-2xl"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <BaseModalHeader className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-info-soft text-info">
                <CalendarClock size={18} strokeWidth={1.75} />
              </span>
              <div>
                <BaseModalTitle className="text-lg font-medium tracking-[-0.02em]">
                  {editing ? 'Edit recurring transaction' : 'Create recurring transaction'}
                </BaseModalTitle>
                <BaseModalDescription className="mt-1 text-xs leading-5 text-muted-foreground">
                  Set the amount and monthly billing day. No transaction is created from this demo.
                </BaseModalDescription>
              </div>
            </div>
            <IconButton aria-label="Close dialog" onClick={() => onOpenChange(false)}>
              <X size={17} strokeWidth={1.75} />
            </IconButton>
          </BaseModalHeader>

          <BaseModalBody className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputField
                  id="recurring-title"
                  label="Name"
                  value={form.title}
                  onChange={(event) => update('title', event.target.value)}
                  placeholder="Monthly rent"
                  required
                  validate={(value) =>
                    value.trim() ? undefined : 'Enter a name for this recurring transaction.'
                  }
                />
              </div>

              <div>
                <InputField
                  id="recurring-amount"
                  label="Amount (USD)"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  value={form.amount}
                  onChange={(event) => update('amount', event.target.value)}
                  placeholder="0.00"
                  helperText="Shown in USD."
                  inputClassName="font-mono"
                  required
                  validate={(value) =>
                    Number.isFinite(Number(value)) && Number(value) > 0
                      ? undefined
                      : 'Enter an amount greater than 0.'
                  }
                />
              </div>

              <SelectField
                id="recurring-category"
                label="Category"
                options={categories.map((category) => ({
                  value: String(category.id),
                  label: category.title,
                }))}
                value={form.categoryId || undefined}
                onValueChange={(value) => update('categoryId', value)}
                placeholder="Select a category"
                helperText="Used for reporting and budgets."
                required
                validate={(value) => (value ? undefined : 'Select a category.')}
              />

              <div>
                <InputField
                  id="recurring-day"
                  label="Billing day"
                  type="number"
                  min="1"
                  max="31"
                  value={form.dayOfMonth}
                  onChange={(event) => update('dayOfMonth', event.target.value)}
                  helperText="Short months use their final calendar day."
                  inputClassName="font-mono"
                  required
                  validate={(value) =>
                    Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 31
                      ? undefined
                      : 'Billing day must be between 1 and 31.'
                  }
                />
              </div>

              <DatePickerField
                id="recurring-start"
                label="Start date"
                value={form.startDate}
                onValueChange={(value) => update('startDate', value)}
                helperText="This schedule begins on the selected date."
                required
              />

              <DatePickerField
                id="recurring-end"
                label="End date (optional)"
                min={form.startDate}
                value={form.endDate}
                onValueChange={(value) => update('endDate', value)}
                helperText="Leave blank to continue until you pause or delete it."
                className="sm:col-span-2"
              />

              <div className="grid gap-2 sm:col-span-2">
                <FieldLabel htmlFor="recurring-description">Description (optional)</FieldLabel>
                <textarea
                  id="recurring-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  placeholder="Add a note for this schedule"
                  className="resize-none rounded-sm border border-input bg-background px-3 py-2.5 text-sm transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none motion-reduce:transition-none"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-md border bg-muted px-4 py-3.5">
              <Checkbox
                id="recurring-active"
                checked={form.isActive}
                onCheckedChange={(checked) => update('isActive', checked === true)}
                className="mt-0.5"
              />
              <div className="min-w-0">
                <label htmlFor="recurring-active" className="text-sm font-medium">
                  Active schedule
                </label>
                <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                  Paused schedules stay saved but do not create upcoming occurrences.
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs leading-5 text-destructive"
              >
                <CircleAlert size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </BaseModalBody>

          <BaseModalFooter>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                height="h-10"
                fullWidth={false}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                height="h-10"
                fullWidth={false}
                prefixIcon={editing ? <Save size={15} /> : <Plus size={15} />}
              >
                {editing ? 'Save changes' : 'Create recurring'}
              </Button>
            </div>
          </BaseModalFooter>
        </form>
      </BaseModalContent>
    </BaseModal>
  )
}

export default RecurringFormModal
