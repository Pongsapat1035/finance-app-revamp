import * as SelectPrimitive from '@radix-ui/react-select'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronDown, ChevronUp, CircleAlert } from 'lucide-react'
import { useId, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import SearchInput from '#/components/ui/SearchInput'
import { cn } from '#/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

type SelectSize = 'default' | 'dense'

const triggerHeights: Record<SelectSize, string> = {
  default: 'h-10',
  dense: 'h-9 text-[13px]',
}

const selectTriggerClassName = ({
  size,
  invalid,
  className,
}: {
  size: SelectSize
  invalid: boolean
  className?: string
}) =>
  cn(
    'flex w-full items-center justify-between gap-2 rounded-sm border bg-background px-3 text-sm transition-[border-color,box-shadow] duration-150 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none aria-[invalid=true]:focus-visible:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/20 motion-reduce:transition-none',
    'hover:border-[#a9a9a5] disabled:pointer-events-none disabled:opacity-45',
    'data-placeholder:text-muted-foreground [&>span]:truncate',
    triggerHeights[size],
    invalid ? 'border-destructive' : 'border-input',
    className,
  )

function SelectTrigger({
  className,
  size = 'default',
  invalid = false,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: SelectSize
  invalid?: boolean
}) {
  return (
    <SelectPrimitive.Trigger
      aria-invalid={invalid || undefined}
      className={selectTriggerClassName({ size, invalid, className })}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          size={15}
          strokeWidth={1.75}
          className="shrink-0 text-muted-foreground transition-transform duration-150 motion-reduce:transition-none [[data-state=open]>&]:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  sideOffset = 6,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={sideOffset}
        className={cn(
          'relative z-50 max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-[0_8px_30px_rgb(22_22_22/0.08)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center bg-popover text-muted-foreground">
          <ChevronUp size={14} strokeWidth={1.75} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center bg-popover text-muted-foreground">
          <ChevronDown size={14} strokeWidth={1.75} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn('px-2 py-1.5 text-[11px] font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex h-9 cursor-default select-none items-center gap-2 rounded-sm pl-2 pr-8 text-[13px] outline-none',
        'data-highlighted:bg-muted data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-45',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
        <Check size={15} strokeWidth={2} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  )
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const SEARCH_SELECT_THRESHOLD = 9

export interface SearchSelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  ariaLabel: string
  size?: SelectSize
  invalid?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  'aria-describedby'?: string
  onClose?: () => void
  onSearch?: (keyword: string) => void
}

const SearchSelect = ({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option',
  ariaLabel,
  size = 'default',
  invalid = false,
  disabled = false,
  required = false,
  name,
  id,
  'aria-describedby': ariaDescribedBy,
  onClose,
  onSearch,
}: SearchSelectProps) => {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const optionsId = `${triggerId}-options`
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const selectedValue = value ?? internalValue
  const selectedOption = options.find((option) => option.value === selectedValue)
  const filteredOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )

  const selectOption = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
    setOpen(false)
    setQuery('')
    onSearch?.('')
  }

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery)
    onSearch?.(nextQuery)
  }

  const focusFirstOption = (fromEnd = false) => {
    const orderedOptions = fromEnd ? [...filteredOptions].reverse() : filteredOptions
    const option = orderedOptions.find((item) => !item.disabled)
    if (!option) return
    const optionIndex = filteredOptions.findIndex((item) => item.value === option.value)
    optionRefs.current[optionIndex]?.focus()
  }

  const focusAdjacentOption = (currentIndex: number, direction: 1 | -1) => {
    for (let offset = 1; offset <= filteredOptions.length; offset += 1) {
      const nextIndex = (currentIndex + direction * offset + filteredOptions.length) % filteredOptions.length
      if (!filteredOptions[nextIndex]?.disabled) {
        optionRefs.current[nextIndex]?.focus()
        return
      }
    }
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setQuery('')
          onSearch?.('')
          onClose?.()
        }
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          id={triggerId}
          type="button"
          role="combobox"
          aria-label={ariaLabel}
          aria-controls={optionsId}
          aria-expanded={open}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={ariaDescribedBy}
          aria-haspopup="listbox"
          disabled={disabled}
          className={selectTriggerClassName({ size, invalid, className: undefined })}
        >
          <span className={selectedOption ? undefined : 'text-muted-foreground'}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown
            size={15}
            strokeWidth={1.75}
            className="shrink-0 text-muted-foreground transition-transform duration-150 motion-reduce:transition-none [[data-state=open]>&]:rotate-180"
          />
        </button>
      </PopoverPrimitive.Trigger>
      {name && <input type="hidden" name={name} value={selectedValue} />}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-50 w-(--radix-popover-trigger-width) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-[0_8px_30px_rgb(22_22_22/0.08)]"
        >
          <SearchInput
            className="block w-full"
            value={query}
            onValueChange={updateQuery}
            ariaLabel={`Search ${ariaLabel.toLocaleLowerCase()} options`}
            placeholder="Search options"
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                focusFirstOption()
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                focusFirstOption(true)
              }
            }}
          />
          <div id={optionsId} role="listbox" aria-label={ariaLabel} className="max-h-56 overflow-y-auto p-1">
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  ref={(node) => {
                    optionRefs.current[index] = node
                  }}
                  type="button"
                  role="option"
                  aria-selected={option.value === selectedValue}
                  disabled={option.disabled}
                  onClick={() => selectOption(option.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      focusAdjacentOption(index, 1)
                    } else if (event.key === 'ArrowUp') {
                      event.preventDefault()
                      focusAdjacentOption(index, -1)
                    } else if (event.key === 'Home') {
                      event.preventDefault()
                      focusFirstOption()
                    } else if (event.key === 'End') {
                      event.preventDefault()
                      focusFirstOption(true)
                    }
                  }}
                  className="flex h-9 w-full items-center justify-between gap-2 rounded-sm px-2 text-left text-[13px] outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-45"
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === selectedValue && <Check size={15} strokeWidth={2} />}
                </button>
              ))
            ) : (
              <p className="px-2 py-3 text-[13px] text-muted-foreground">No options found.</p>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export interface SelectFieldProps {
  label: string
  options: Array<SelectOption>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  helperText?: string
  error?: string
  validate?: (value: string | undefined) => string | undefined
  disabled?: boolean
  required?: boolean
  name?: string
  size?: SelectSize
  id?: string
  ariaLabel?: string
  onSearch?: (keyword: string) => void
  children?: ReactNode
}

/**
 * Field-level wrapper: label above, helper or error below, matching InputField.
 * Use the composable parts directly when a group, separator, or custom item is needed.
 */
const SelectField = ({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option',
  helperText,
  error,
  validate,
  disabled,
  required,
  name,
  size = 'default',
  id,
  ariaLabel,
  onSearch,
}: SelectFieldProps) => {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [internalError, setInternalError] = useState<string>()
  const [internalTouched, setInternalTouched] = useState(false)
  const fieldError = error ?? internalError
  const hasError = Boolean(error) || (internalTouched && Boolean(internalError))
  const descriptionId = hasError ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined

  const validateValue = (nextValue: string | undefined) => {
    if (validate) setInternalError(validate(nextValue))
  }

  return (
    <div className="grid gap-2">
      {label && (
        <label htmlFor={fieldId} className="text-[13px] font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-1 text-muted-foreground" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {options.length > SEARCH_SELECT_THRESHOLD ? (
        <SearchSelect
          id={fieldId}
          ariaLabel={ariaLabel || label || placeholder}
          options={options}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(nextValue) => {
            validateValue(nextValue)
            onValueChange?.(nextValue)
          }}
          placeholder={placeholder}
          size={size}
          invalid={hasError}
          disabled={disabled}
          required={required}
          name={name}
          aria-describedby={descriptionId}
          onSearch={onSearch}
          onClose={() => {
            setInternalTouched(true)
            validateValue(value)
          }}
        />
      ) : (
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={(nextValue) => {
            validateValue(nextValue)
            onValueChange?.(nextValue)
          }}
          disabled={disabled}
          required={required}
          name={name}
        >
          <SelectTrigger
            id={fieldId}
            size={size}
            invalid={hasError}
            aria-label={ariaLabel}
            aria-describedby={descriptionId}
            onBlur={() => {
              setInternalTouched(true)
              validateValue(value)
            }}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {hasError && fieldError ? (
        <span
          id={`${fieldId}-error`}
          className="flex items-center gap-1.5 text-[12px] text-destructive-text"
        >
          <CircleAlert size={13} strokeWidth={1.75} />
          {fieldError}
        </span>
      ) : helperText ? (
        <span id={`${fieldId}-helper`} className="text-[12px] text-muted-foreground">
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SearchSelect,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
