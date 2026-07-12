interface Tab<T extends string> {
  label: string
  value: T
}

interface SegmentedTabProps<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (value: T) => void
  ariaLabel?: string
}

const SegmentedTab = <T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel,
}: SegmentedTabProps<T>) => {
  return (
    <div
      className="border-b"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === active
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`ds-focus-ring ds-interactive relative h-11 text-sm font-medium ${
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedTab
