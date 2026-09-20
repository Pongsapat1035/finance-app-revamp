import { Search } from 'lucide-react'
import { useId, type KeyboardEventHandler, type Ref } from 'react'

import { cn } from '#/lib/utils'

export interface SearchInputProps {
  value: string
  onValueChange: (value: string) => void
  ariaLabel: string
  placeholder?: string
  id?: string
  className?: string
  disabled?: boolean
  inputRef?: Ref<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}

const SearchInput = ({
  value,
  onValueChange,
  ariaLabel,
  placeholder = 'Search',
  id,
  className,
  disabled = false,
  inputRef,
  onKeyDown,
}: SearchInputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label htmlFor={inputId} className={cn('relative min-w-0', className)}>
      <span className="sr-only">{ariaLabel}</span>
      <Search
        className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground"
        size={15}
        strokeWidth={1.75}
      />
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="h-9 w-full rounded-sm border border-input bg-background pl-9 pr-3 text-xs transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none"
      />
    </label>
  )
}

export default SearchInput
