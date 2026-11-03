import { TransactionType } from '#/enum/enum'
import { transactionPresentation } from '#/components/transactions/transactionPresentation'

interface TypeSelectorProps {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

const types = Object.values(TransactionType)

const TypeSelector = ({ value, onChange }: TypeSelectorProps) => {
  const selectedIndex = Math.max(0, types.indexOf(value))

  return (
    <div>
      <p className="mb-2 text-[13px] font-medium">Transaction type</p>
      <div className="relative grid grid-cols-3 rounded-sm border bg-muted p-1">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 left-1 rounded-sm bg-background shadow-[0_1px_3px_rgb(22_22_22/0.09)] motion-safe:transition-transform motion-safe:duration-(--duration-base) motion-safe:ease-(--ease-in-out)"
          style={{
            width: `calc((100% - 8px) / 3)`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />
        {types.map((type) => {
          const selected = value === type
          const { label, icon: Icon } = transactionPresentation[type]
          return (
            <button
              key={type}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(type)}
              className={`ds-focus-ring ds-interactive relative flex h-10 items-center justify-center gap-1.5 rounded-sm text-xs font-medium sm:text-sm ${
                selected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={15} strokeWidth={1.75} className="shrink-0" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TypeSelector
