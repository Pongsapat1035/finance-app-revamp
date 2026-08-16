import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, ChevronDown, CircleCheck, CreditCard, Plus, Trash2 } from 'lucide-react'

import { AppPageShell } from '#/components/app-shell'

import type { ReactNode } from 'react'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: 'Settings | My Finance' },
      {
        name: 'description',
        content: 'Manage finance workspace preferences and connected accounts.',
      },
    ],
  }),
})

function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)

  return (
    <AppPageShell
      activeItem="Settings"
      searchLabel="Search settings"
      periodLabel="Workspace settings"
    >
      <div>
        <p className="text-xs font-medium text-muted-foreground">Workspace preferences</p>
        <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage regional preferences, notifications, and the accounts connected to this workspace.
        </p>
      </div>

      <nav className="mt-8 flex gap-6 overflow-x-auto border-b" aria-label="Settings sections">
        <span className="relative shrink-0 pb-3 text-sm font-medium text-foreground">
          General settings
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
        </span>
        <Link
          to="/profile"
          className="ds-focus-ring relative shrink-0 pb-3 text-sm text-muted-foreground no-underline hover:text-foreground"
        >
          Profile and security
        </Link>
      </nav>

      {saved && (
        <div
          className="mt-6 flex items-center gap-2 rounded-sm bg-success-soft px-4 py-3 text-xs font-medium text-success"
          role="status"
        >
          <CircleCheck size={15} /> Settings saved.
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSaved(true)
        }}
        className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]"
      >
        <div className="space-y-6">
          <SettingsSection
            title="General"
            description="Used for dates, currency, and report periods."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Currency"
                defaultValue="USD - US dollar"
                options={['USD - US dollar', 'EUR - Euro', 'THB - Thai baht']}
              />
              <SelectField
                label="Timezone"
                defaultValue="Asia/Bangkok"
                options={['Asia/Bangkok', 'America/New_York', 'Europe/London']}
              />
              <SelectField
                label="Month starts"
                defaultValue="First day of month"
                options={['First day of month', 'Payday']}
              />
              <SelectField
                label="Number format"
                defaultValue="1,234.56"
                options={['1,234.56', '1.234,56']}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Notifications"
            description="Choose which account updates arrive by email."
          >
            <div className="divide-y">
              <ToggleRow
                label="Weekly summary"
                description="A concise review of cash flow and top categories."
                checked={weeklySummary}
                onChange={setWeeklySummary}
              />
              <ToggleRow
                label="Budget alerts"
                description="Notify me when a category reaches 80% of its limit."
                checked={budgetAlerts}
                onChange={setBudgetAlerts}
              />
              <ToggleRow
                label="Product updates"
                description="Occasional notes about new finance tools."
                checked={productUpdates}
                onChange={setProductUpdates}
              />
            </div>
          </SettingsSection>

          <div className="flex justify-end border-t pt-5">
            <button
              type="submit"
              className="ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]"
            >
              <Check size={15} strokeWidth={2} /> Save changes
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="overflow-hidden rounded-lg border">
            <div className="border-b px-5 py-4">
              <h2 className="text-sm font-medium">Connected accounts</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Last refreshed 8 minutes ago</p>
            </div>
            <div className="divide-y">
              <AccountRow name="Everyday checking" detail="•• 4821" balance="$8,240" />
              <AccountRow name="Savings" detail="•• 0914" balance="$24,680" />
              <AccountRow name="Travel card" detail="•• 7730" balance="-$842" />
            </div>
            <button
              type="button"
              className="ds-focus-ring flex h-11 w-full items-center justify-center gap-2 border-t text-xs font-medium hover:bg-muted"
            >
              <Plus size={14} /> Connect account
            </button>
          </section>

          <section className="rounded-lg border border-destructive/35 p-5">
            <div className="flex items-center gap-2 text-destructive">
              <Trash2 size={15} />
              <h2 className="text-sm font-medium">Delete workspace</h2>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Permanently remove budgets, reports, and linked account history.
            </p>
            <button
              type="button"
              className="ds-focus-ring mt-5 h-9 rounded-sm border border-destructive/45 px-3 text-xs font-medium text-destructive hover:bg-destructive/5"
            >
              Delete workspace
            </button>
          </section>
        </aside>
      </form>
    </AppPageShell>
  )
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border">
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-medium tracking-[-0.02em]">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function SelectField({
  label,
  defaultValue,
  options,
}: {
  label: string
  defaultValue: string
  options: string[]
}) {
  return (
    <label className="grid gap-2 text-xs font-medium">
      {label}
      <span className="relative">
        <select
          defaultValue={defaultValue}
          className="ds-focus-ring h-10 w-full appearance-none rounded-sm border border-input bg-background px-3 pr-9 text-sm font-normal"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-3 text-muted-foreground"
          size={15}
        />
      </span>
    </label>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`ds-focus-ring relative h-6 w-11 shrink-0 rounded-full border ${checked ? 'border-foreground bg-foreground' : 'bg-muted'}`}
      >
        <span
          className={`absolute top-0.5 grid size-4 place-items-center rounded-full bg-background transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-1'}`}
        >
          {checked && <Check size={10} strokeWidth={2.5} />}
        </span>
      </button>
    </div>
  )
}

function AccountRow({ name, detail, balance }: { name: string; detail: string; balance: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="grid size-9 place-items-center rounded-sm bg-muted">
        <CreditCard size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{name}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{detail}</p>
      </div>
      <p className="font-mono text-xs font-medium">{balance}</p>
    </div>
  )
}
