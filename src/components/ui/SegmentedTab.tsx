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
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === active),
  )

  return (
    <div
      className="relative border-b"
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
          </button>
        )
      })}
      {/* One indicator that slides to the active tab */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px left-0 h-0.5 bg-foreground motion-safe:transition-transform motion-safe:duration-(--duration-base) motion-safe:ease-(--ease-in-out)"
        style={{ width: `${100 / tabs.length}%`, transform: `translateX(${activeIndex * 100}%)` }}
      />
    </div>
  )
}

export default SegmentedTab
