import * as PopoverPrimitive from '@radix-ui/react-popover'
import dayjs from 'dayjs'
import { CalendarDays, ChevronLeft, ChevronRight, CircleAlert } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker'

import { cn } from '#/lib/utils'

export type DatePickerMode = 'date' | 'month'

export interface DatePickerFieldProps {
  label: string
  value?: string
  onValueChange: (value: string) => void
  mode?: DatePickerMode
  placeholder?: string
  helperText?: string
  error?: string
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  className?: string
}

const monthNames = Array.from({ length: 12 }, (_, index) => dayjs().month(index).format('MMM'))

function getCalendarDate(value: string | undefined, mode: DatePickerMode) {
  if (!value) return undefined

  const date = dayjs(mode === 'month' ? `${value}-01` : value)
  return date.isValid() && date.format(mode === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD') === value
    ? date.toDate()
    : undefined
}

/**
 * A single date or month field with a keyboard-accessible picker. Date values
 * use `YYYY-MM-DD`; month values use `YYYY-MM`.
 */
function DatePickerField({
  label,
  value,
  onValueChange,
  mode = 'date',
  placeholder = mode === 'month' ? 'Select a month' : 'Select a date',
  helperText,
  error,
  min,
  max,
  disabled = false,
  required = false,
  name,
  id,
  className,
}: DatePickerFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const descriptionId = error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
  const [open, setOpen] = useState(false)
  const selectedDate = useMemo(() => getCalendarDate(value, mode), [mode, value])
  const minDate = useMemo(() => getCalendarDate(min, mode), [min, mode])
  const maxDate = useMemo(() => getCalendarDate(max, mode), [max, mode])
  const [monthViewYear, setMonthViewYear] = useState(() =>
    (selectedDate ?? minDate ?? new Date()).getFullYear(),
  )

  useEffect(() => {
    if (open && mode === 'month') {
      setMonthViewYear((selectedDate ?? minDate ?? new Date()).getFullYear())
    }
  }, [minDate, mode, open, selectedDate])

  const isDateDisabled = (date: Date) =>
    Boolean(
      (minDate && dayjs(date).isBefore(minDate, 'day')) ||
      (maxDate && dayjs(date).isAfter(maxDate, 'day')),
    )

  const hasSelectableMonth = (year: number) =>
    monthNames.some((_, monthIndex) => !isDateDisabled(new Date(year, monthIndex, 1)))

  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={fieldId} className="text-[13px] font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-1 text-muted-foreground" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id={fieldId}
            type="button"
            disabled={disabled}
            aria-required={required || undefined}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={descriptionId}
            className={cn(
              'flex h-10 w-full items-center justify-between gap-2 rounded-sm border bg-background px-3 text-left text-sm transition-[border-color,box-shadow] duration-150 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none aria-[invalid=true]:focus-visible:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/20 motion-reduce:transition-none',
              'hover:border-[#a9a9a5] disabled:pointer-events-none disabled:opacity-45',
              error ? 'border-destructive' : 'border-input',
              !selectedDate && 'text-muted-foreground',
            )}
          >
            <span className="truncate">
              {selectedDate
                ? dayjs(selectedDate).format(mode === 'month' ? 'MMM YYYY' : 'DD/MM/YYYY')
                : placeholder}
            </span>
            <CalendarDays size={16} strokeWidth={1.75} className="shrink-0 text-muted-foreground" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className="z-50 w-auto rounded-md border bg-popover p-0 text-popover-foreground shadow-[0_8px_30px_rgb(22_22_22/0.08)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 motion-reduce:animate-none"
          >
            {mode === 'month' ? (
              <div className="w-72 p-3" role="group" aria-label="Choose a month">
                <div className="flex h-8 items-center justify-between">
                  <button
                    type="button"
                    aria-label={`Previous year, ${monthViewYear - 1}`}
                    disabled={!hasSelectableMonth(monthViewYear - 1)}
                    onClick={() => setMonthViewYear((year) => year - 1)}
                    className="ds-focus-ring flex size-8 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                  >
                    <ChevronLeft size={16} strokeWidth={1.75} />
                  </button>
                  <span className="text-sm font-medium">{monthViewYear}</span>
                  <button
                    type="button"
                    aria-label={`Next year, ${monthViewYear + 1}`}
                    disabled={!hasSelectableMonth(monthViewYear + 1)}
                    onClick={() => setMonthViewYear((year) => year + 1)}
                    className="ds-focus-ring flex size-8 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                  >
                    <ChevronRight size={16} strokeWidth={1.75} />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1">
                  {monthNames.map((monthName, monthIndex) => {
                    const monthDate = new Date(monthViewYear, monthIndex, 1)
                    const isSelected =
                      selectedDate?.getFullYear() === monthViewYear &&
                      selectedDate.getMonth() === monthIndex
                    const monthDisabled = isDateDisabled(monthDate)

                    return (
                      <button
                        key={monthName}
                        type="button"
                        disabled={monthDisabled}
                        aria-pressed={isSelected}
                        aria-label={`Select ${dayjs(monthDate).format('MMMM YYYY')}`}
                        onClick={() => {
                          onValueChange(dayjs(monthDate).format('YYYY-MM'))
                          setOpen(false)
                        }}
                        className={cn(
                          'ds-focus-ring h-9 rounded-sm text-[13px] hover:bg-muted disabled:pointer-events-none disabled:text-muted-foreground disabled:opacity-35',
                          isSelected && 'bg-foreground text-background hover:bg-[#30302f]',
                        )}
                      >
                        {monthName}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <DayPicker
                mode="single"
                selected={selectedDate}
                defaultMonth={selectedDate ?? minDate ?? new Date()}
                onSelect={(date) => {
                  onValueChange(date ? dayjs(date).format('YYYY-MM-DD') : '')
                  setOpen(false)
                }}
                disabled={isDateDisabled}
                showOutsideDays
                fixedWeeks
                classNames={{
                  [UI.Root]: 'relative p-3',
                  [UI.Months]: 'flex flex-col',
                  [UI.Month]: 'space-y-3',
                  [UI.MonthCaption]: 'flex h-8 items-center justify-center',
                  [UI.CaptionLabel]: 'text-sm font-medium',
                  [UI.Nav]: 'absolute inset-x-3 top-3 flex items-center justify-between',
                  [UI.PreviousMonthButton]:
                    'ds-focus-ring flex size-8 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35',
                  [UI.NextMonthButton]:
                    'ds-focus-ring flex size-8 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35',
                  [UI.Chevron]: 'size-4',
                  [UI.MonthGrid]: 'w-full border-collapse',
                  [UI.Weekdays]: 'text-muted-foreground',
                  [UI.Weekday]: 'w-8 pb-1 text-center text-[11px] font-medium',
                  [UI.Week]: 'mt-1',
                  [UI.Day]: 'size-8 p-0 text-center',
                  [UI.DayButton]:
                    'ds-focus-ring flex size-8 items-center justify-center rounded-sm text-[13px] hover:bg-muted',
                  [SelectionState.selected]: 'bg-foreground text-background hover:bg-[#30302f]',
                  [DayFlag.today]: 'font-semibold text-info',
                  [DayFlag.outside]: 'text-muted-foreground opacity-40',
                  [DayFlag.disabled]: 'cursor-not-allowed text-muted-foreground opacity-35',
                }}
                components={{
                  Chevron: ({ orientation, className }) =>
                    orientation === 'left' ? (
                      <ChevronLeft className={className} strokeWidth={1.75} />
                    ) : (
                      <ChevronRight className={className} strokeWidth={1.75} />
                    ),
                }}
              />
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {name && <input type="hidden" name={name} value={value ?? ''} />}

      {error ? (
        <span
          id={`${fieldId}-error`}
          className="flex items-center gap-1.5 text-[12px] text-destructive"
        >
          <CircleAlert size={13} strokeWidth={1.75} />
          {error}
        </span>
      ) : helperText ? (
        <span id={`${fieldId}-helper`} className="text-[12px] text-muted-foreground">
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

export default DatePickerField
