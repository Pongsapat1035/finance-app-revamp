import { TransactionType } from '#/enum/enum'
import { transactionPresentation } from '#/components/transactions/transactionPresentation'

interface TypeSelectorProps {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

const TypeSelector = ({ value, onChange }: TypeSelectorProps) => {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium">Transaction type</p>
      <div className="grid grid-cols-3 rounded-sm border bg-muted p-1">
        {Object.values(TransactionType).map((type) => {
          const selected = value === type
          const { label, icon: Icon } = transactionPresentation[type]
          return (
            <button
              key={type}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(type)}
              className={`ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-1.5 rounded-sm text-xs font-medium sm:text-sm ${
                selected
                  ? 'bg-background shadow-[0_1px_3px_rgb(22_22_22/0.09)]'
                  : 'text-muted-foreground hover:text-foreground'
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
