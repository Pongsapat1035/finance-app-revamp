import { useState } from 'react'

export interface InputFieldProps {
  id: string
  label: string
  type?: string
  placeholder: string
  autoComplete?: string
  validate?: (value: string) => string | undefined
}

const InputField = ({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  validate,
}: InputFieldProps) => {
  const [error, setError] = useState<string | undefined>(undefined)
  const [touched, setTouched] = useState(false)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true)
    if (validate) {
      setError(validate(e.target.value))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (touched && validate) {
      setError(validate(e.target.value))
    }
  }

  return (
    <label htmlFor={id} className="grid gap-2 text-[13px] font-medium text-foreground">
      {label}
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onBlur={handleBlur}
        onChange={handleChange}
        aria-invalid={touched && !!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`ds-focus-ring h-11 w-full rounded-sm border bg-background px-3.5 text-[14px] font-normal text-foreground placeholder:text-[#8a8a86] hover:border-[#a9a9a5] ${
          touched && error ? 'border-destructive' : 'border-input'
        }`}
      />
      {touched && error && (
        <span id={`${id}-error`} className="text-[12px] font-normal text-destructive">
          {error}
        </span>
      )}
    </label>
  )
}

export default InputField
