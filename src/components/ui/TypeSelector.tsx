import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

type TransactionType = 'expense' | 'income'

interface TypeSelectorProps {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

const TypeSelector = ({ value, onChange }: TypeSelectorProps) => {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium">Transaction type</p>
      <div className="grid grid-cols-2 rounded-sm border bg-muted p-1">
        {(['expense', 'income'] as TransactionType[]).map((type) => {
          const selected = value === type
          return (
            <button
              key={type}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(type)}
              className={`ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 rounded-sm text-sm font-medium capitalize ${
                selected ? 'bg-background shadow-[0_1px_3px_rgb(22_22_22/0.09)]' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type === 'expense' ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
              {type}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TypeSelector
