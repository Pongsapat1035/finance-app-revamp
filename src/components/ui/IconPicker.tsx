import * as Popover from '@radix-ui/react-popover'
import {
  Apple,
  ArrowDownLeft,
  ArrowUpRight,
  Baby,
  Banknote,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Bus,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronDown,
  CircleAlert,
  CircleHelp,
  Coffee,
  CreditCard,
  Dumbbell,
  Film,
  Fuel,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Lightbulb,
  Music,
  PawPrint,
  Phone,
  Plane,
  ReceiptText,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  Tags,
  Train,
  TrendingUp,
  Utensils,
  Wallet,
  WalletCards,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useId, useRef, useState } from 'react'

import SearchInput from '#/components/ui/SearchInput'
import { cn } from '#/lib/utils'

const iconOptions: { name: string; icon: LucideIcon }[] = [
  { name: 'Apple', icon: Apple },
  { name: 'ArrowDownLeft', icon: ArrowDownLeft },
  { name: 'ArrowUpRight', icon: ArrowUpRight },
  { name: 'Baby', icon: Baby },
  { name: 'Banknote', icon: Banknote },
  { name: 'Bell', icon: Bell },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'BriefcaseBusiness', icon: BriefcaseBusiness },
  { name: 'Bus', icon: Bus },
  { name: 'CalendarDays', icon: CalendarDays },
  { name: 'Camera', icon: Camera },
  { name: 'Car', icon: Car },
  { name: 'Coffee', icon: Coffee },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Film', icon: Film },
  { name: 'Fuel', icon: Fuel },
  { name: 'Gift', icon: Gift },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'House', icon: House },
  { name: 'Laptop', icon: Laptop },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Music', icon: Music },
  { name: 'PawPrint', icon: PawPrint },
  { name: 'Phone', icon: Phone },
  { name: 'Plane', icon: Plane },
  { name: 'ReceiptText', icon: ReceiptText },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Shirt', icon: Shirt },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Stethoscope', icon: Stethoscope },
  { name: 'Tags', icon: Tags },
  { name: 'Train', icon: Train },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Utensils', icon: Utensils },
  { name: 'Wallet', icon: Wallet },
  { name: 'WalletCards', icon: WalletCards },
  { name: 'Wrench', icon: Wrench },
]

const labelFor = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2')

export interface IconPickerProps {
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (iconName: string) => void
  id?: string
  name?: string
  helperText?: string
  error?: string
  disabled?: boolean
  className?: string
}

export default function IconPicker({
  label,
  value,
  defaultValue = '',
  onValueChange,
  id,
  name,
  helperText,
  error,
  disabled = false,
  className,
}: IconPickerProps) {
  const generatedId = useId()
  const pickerId = id ?? generatedId
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const selectedValue = value ?? internalValue
  const selected = iconOptions.find((option) => option.name === selectedValue)
  const filteredOptions = iconOptions.filter((option) =>
    labelFor(option.name).toLowerCase().includes(query.trim().toLowerCase()),
  )
  const SelectedIcon = selected?.icon ?? CircleHelp
  const describedBy = error ? `${pickerId}-error` : helperText ? `${pickerId}-helper` : undefined

  const selectIcon = (iconName: string) => {
    if (value === undefined) setInternalValue(iconName)
    onValueChange?.(iconName)
    setOpen(false)
  }

  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <label htmlFor={pickerId} className="text-[13px] font-medium text-foreground">
        {label}
      </label>
      <Popover.Root
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) setQuery('')
        }}
      >
        <Popover.Trigger asChild>
          <button
            id={pickerId}
            type="button"
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={cn(
              'flex h-10 w-full items-center gap-2 rounded-sm border bg-background px-3 text-left text-sm transition-[border-color,box-shadow] duration-150 ease-out hover:border-foreground/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none',
              error ? 'border-destructive' : 'border-input',
            )}
          >
            <SelectedIcon size={17} strokeWidth={1.75} aria-hidden="true" />
            <span
              className={cn('min-w-0 flex-1 truncate', !selectedValue && 'text-muted-foreground')}
            >
              {selectedValue ? labelFor(selectedValue) : 'Select an icon'}
            </span>
            <ChevronDown
              size={15}
              strokeWidth={1.75}
              className={cn(
                'shrink-0 text-muted-foreground transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            onOpenAutoFocus={(event) => {
              event.preventDefault()
              searchRef.current?.focus()
            }}
            className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-md border bg-popover p-3 text-popover-foreground shadow-[0_8px_30px_rgb(22_22_22/0.08)]"
          >
            <SearchInput
              value={query}
              onValueChange={setQuery}
              ariaLabel="Search icons"
              placeholder="Search icons"
              inputRef={searchRef}
            />
            <div className="mt-3 max-h-64 overflow-y-auto" aria-label="Available icons">
              {filteredOptions.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No icons found.
                </p>
              ) : (
                <div className="grid grid-cols-6 gap-1">
                  {filteredOptions.map(({ name: iconName, icon: Icon }) => (
                    <button
                      key={iconName}
                      type="button"
                      aria-label={labelFor(iconName)}
                      aria-pressed={selectedValue === iconName}
                      title={labelFor(iconName)}
                      onClick={() => selectIcon(iconName)}
                      className={cn(
                        'relative flex h-10 items-center justify-center rounded-sm text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring motion-reduce:transition-none',
                        selectedValue === iconName && 'bg-muted',
                      )}
                    >
                      <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
                      {selectedValue === iconName && (
                        <Check
                          size={11}
                          strokeWidth={2}
                          className="absolute bottom-1 right-1"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 border-t pt-2 text-[11px] text-muted-foreground">
              {filteredOptions.length} icons
            </p>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {name && <input type="hidden" name={name} value={selectedValue} disabled={disabled} />}
      {error ? (
        <p
          id={`${pickerId}-error`}
          className="flex items-center gap-1.5 text-[12px] text-destructive-text"
        >
          <CircleAlert size={13} strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      ) : helperText ? (
        <p id={`${pickerId}-helper`} className="text-[12px] text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
