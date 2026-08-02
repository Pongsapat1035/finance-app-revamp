import { useState } from 'react'

export interface InputFieldProps {
  id: string
  label: string
  hideLabel?: boolean
  type?: string
  placeholder?: string
  autoComplete?: string

  // Controlled mode — pass these from form.Field
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  error?: string
  touched?: boolean

  // Uncontrolled mode — for standalone use without a form library
  validate?: (value: string) => string | undefined
}

const InputField = ({
  id,
  label,
  hideLabel = false,
  type = 'text',
  placeholder,
  autoComplete,
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

  const isControlled = value !== undefined
  const error = isControlled ? controlledError : internalError
  const touched = isControlled ? (controlledTouched ?? false) : internalTouched

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalTouched(true)
      if (validate) setInternalError(validate(e.target.value))
    }
    onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled && internalTouched && validate) {
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
        placeholder={placeholder}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={`ds-focus-ring h-11 w-full rounded-sm border bg-background px-3.5 text-[14px] font-normal text-foreground placeholder:text-[#8a8a86] hover:border-[#a9a9a5] ${
          hasError ? 'border-destructive' : 'border-input'
        }`}
      />
      {hasError && (
        <span id={`${id}-error`} className="text-[12px] font-normal text-destructive">
          {error}
        </span>
      )}
    </label>
  )
}

export default InputField
