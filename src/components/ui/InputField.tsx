import { useState, type InputHTMLAttributes } from 'react'

import { cn } from '#/lib/utils'

export interface InputFieldProps {
  id: string
  label: string
  hideLabel?: boolean
  type?: string
  placeholder?: string
  autoComplete?: string
  autoFocus?: boolean
  min?: string
  max?: string
  step?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  helperText?: string
  inputClassName?: string
  required?: boolean

  // Controlled mode — pass these from form.Field
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  error?: string
  touched?: boolean

  // Per-field validation runs on blur and on changes after the field is blurred.
  validate?: (value: string) => string | undefined
}

const InputField = ({
  id,
  label,
  hideLabel = false,
  type = 'text',
  placeholder,
  autoComplete,
  autoFocus,
  min,
  max,
  step,
  inputMode,
  helperText,
  inputClassName,
  required,
  value,
  onChange,
  onBlur,
  onKeyDown,
  error: controlledError,
  touched: controlledTouched,
  validate,
}: InputFieldProps) => {
  const [internalError, setInternalError] = useState<string | undefined>(undefined)
  const [internalTouched, setInternalTouched] = useState(false)

  const error = controlledError ?? internalError
  const touched = controlledTouched ?? internalTouched

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setInternalTouched(true)
    if (validate) setInternalError(validate(e.target.value))
    onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (internalTouched && validate) {
      setInternalError(validate(e.target.value))
    }
    onChange?.(e)
  }

  const hasError = touched && !!error

  return (
    <label htmlFor={id} className="grid gap-2 text-[13px] font-medium text-foreground">
      <span className={hideLabel ? 'sr-only' : undefined}>{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(
          'h-10 w-full rounded-sm border bg-background px-3 text-sm font-normal text-foreground transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground hover:border-[#a9a9a5] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none aria-[invalid=true]:focus-visible:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/20 motion-reduce:transition-none',
          hasError ? 'border-destructive' : 'border-input',
          inputClassName,
        )}
      />
      {hasError && (
        <span id={`${id}-error`} className="text-[12px] font-normal text-destructive">
          {error}
        </span>
      )}
      {!hasError && helperText && (
        <span className="text-[12px] font-normal text-muted-foreground">{helperText}</span>
      )}
    </label>
  )
}

export default InputField
