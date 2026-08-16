import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Ellipsis,
  Plus,
} from 'lucide-react'

import { AppPageShell } from '#/components/app-shell'
import BaseModal, {
  BaseModalClose,
  BaseModalContent,
  BaseModalDescription,
  BaseModalTitle,
} from '#/components/ui/BaseModal'

export const Route = createFileRoute('/_authenticated/budgets')({
  component: BudgetsPage,
  head: () => ({
    meta: [
      { title: 'Budgets | My Finance' },
      {
        name: 'description',
        content: 'Plan monthly spending limits and review category progress.',
      },
    ],
  }),
})

const budgetItems = [
  { name: 'Housing', used: 1920, limit: 2200, icon: 'HO', color: 'var(--chart-blue)' },
  { name: 'Food and dining', used: 684, limit: 900, icon: 'FD', color: 'var(--chart-green)' },
  { name: 'Transport', used: 336, limit: 480, icon: 'TR', color: 'var(--chart-plum)' },
  { name: 'Shopping', used: 412, limit: 400, icon: 'SH', color: 'var(--warning)' },
  { name: 'Subscriptions', used: 124, limit: 180, icon: 'SU', color: 'var(--info)' },
]

function money(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function BudgetsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const totalLimit = budgetItems.reduce((sum, item) => sum + item.limit, 0)
  const totalUsed = budgetItems.reduce((sum, item) => sum + item.used, 0)
  const remaining = totalLimit - totalUsed

  return (
    <AppPageShell activeItem="Budgets" searchLabel="Search budgets" periodLabel="Budget planning">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Monthly plan</p>
          <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
            Budgets
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Set category limits and see where this month's plan needs attention. Example amounts are
            shown in USD.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]"
        >
          <Plus size={16} strokeWidth={2} /> Create budget
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="ds-focus-ring grid size-8 place-items-center rounded-sm hover:bg-muted"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="ds-focus-ring flex h-8 items-center gap-2 rounded-sm px-2 text-xs font-medium hover:bg-muted"
          >
            <CalendarDays size={14} strokeWidth={1.75} /> July 2026 <ChevronDown size={13} />
          </button>
          <button
            type="button"
            className="ds-focus-ring grid size-8 place-items-center rounded-sm hover:bg-muted"
            aria-label="Next month"
          >
            <ChevronRight size={16} strokeWidth={1.75} />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">Month ends in 12 days</p>
      </div>

      <section
        className="mt-6 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3"
        aria-label="July budget summary"
      >
        <Metric label="Planned" value={money(totalLimit)} note="Across 5 categories" />
        <Metric
          label="Spent"
          value={money(totalUsed)}
          note={`${Math.round((totalUsed / totalLimit) * 100)}% of planned`}
        />
        <Metric
          label="Remaining"
          value={money(remaining)}
          note="Available through Jul 31"
          positive={remaining >= 0}
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        <section className="overflow-hidden rounded-lg border bg-background">
          <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
            <div>
              <h2 className="text-base font-medium tracking-[-0.02em]">Category budgets</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Amounts update as transactions are categorized.
              </p>
            </div>
            <button
              type="button"
              className="ds-focus-ring text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Edit limits
            </button>
          </div>
          <div className="divide-y">
            {budgetItems.map((item) => (
              <BudgetRow key={item.name} item={item} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border bg-muted p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium">Plan health</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Based on current spending</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-warning-soft px-2 py-1 text-[11px] font-medium text-warning">
                <CircleAlert size={13} /> Review
              </span>
            </div>
            <p className="mt-6 font-mono text-[28px] font-medium tracking-[-0.045em]">1 category</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Shopping is $12 over its monthly limit.
            </p>
            <button
              type="button"
              className="ds-focus-ring mt-5 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Move money
            </button>
          </section>

          <section className="overflow-hidden rounded-lg border">
            <div className="border-b px-5 py-4">
              <h2 className="text-sm font-medium">Upcoming costs</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Expected before Jul 31</p>
            </div>
            <div className="divide-y">
              {[
                ['Internet', 'Jul 23', 64],
                ['Cloud storage', 'Jul 26', 12],
                ['Gym', 'Jul 28', 48],
              ].map(([name, date, value]) => (
                <div
                  key={String(name)}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div>
                    <p className="text-xs font-medium">{name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{date}</p>
                  </div>
                  <p className="font-mono text-xs font-medium">{money(Number(value))}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <CreateBudgetDialog open={modalOpen} onOpenChange={setModalOpen} />
    </AppPageShell>
  )
}

function Metric({
  label,
  value,
  note,
  positive = false,
}: {
  label: string
  value: string
  note: string
  positive?: boolean
}) {
  return (
    <article className="bg-background p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-5 font-mono text-[24px] font-medium tracking-[-0.045em] ${positive ? 'text-success' : ''}`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-muted-foreground">{note}</p>
    </article>
  )
}

function BudgetRow({ item }: { item: (typeof budgetItems)[number] }) {
  const percent = Math.round((item.used / item.limit) * 100)
  const over = item.used > item.limit

  return (
    <article className="px-5 py-4 hover:bg-muted/55">
      <div className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3">
        <span className="grid size-9 place-items-center rounded-sm bg-muted font-mono text-[10px] font-semibold">
          {item.icon}
        </span>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="shrink-0 font-mono text-xs font-medium tabular-nums">
              {money(item.used)}{' '}
              <span className="text-muted-foreground">of {money(item.limit)}</span>
            </p>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-[1px] bg-muted">
            <span
              className={`block h-full ${over ? 'bg-warning' : ''}`}
              style={{
                width: `${Math.min(percent, 100)}%`,
                backgroundColor: over ? undefined : item.color,
              }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
            <span>{percent}% used</span>
            <span className={over ? 'font-medium text-warning' : ''}>
              {over
                ? `${money(item.used - item.limit)} over`
                : `${money(item.limit - item.used)} left`}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="ds-focus-ring grid size-8 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`More options for ${item.name}`}
        >
          <Ellipsis size={16} />
        </button>
      </div>
    </article>
  )
}

function CreateBudgetDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <BaseModal open={open} onOpenChange={onOpenChange}>
      <BaseModalContent className="sm:max-w-md">
        <div className="border-b px-5 py-4 pr-14">
          <BaseModalTitle className="text-base font-medium">Create budget</BaseModalTitle>
          <BaseModalDescription className="mt-1 text-xs text-muted-foreground">
            Add a monthly limit for one category.
          </BaseModalDescription>
        </div>
        <form
          className="grid gap-4 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            onOpenChange(false)
          }}
        >
          <label className="grid gap-2 text-xs font-medium">
            Category
            <select
              autoFocus
              className="ds-focus-ring h-10 rounded-sm border border-input bg-background px-3 text-sm font-normal"
            >
              <option>Health and wellness</option>
              <option>Travel</option>
              <option>Education</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-medium">
            Monthly limit
            <input
              type="number"
              min="1"
              required
              defaultValue="250"
              className="ds-focus-ring h-10 rounded-sm border border-input bg-background px-3 font-mono text-sm font-normal"
            />
          </label>
          <p className="text-[11px] leading-5 text-muted-foreground">
            The limit starts in July and can be changed at any time.
          </p>
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <BaseModalClose asChild>
              <button
                type="button"
                className="ds-focus-ring ds-interactive h-10 rounded-sm border px-4 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
            </BaseModalClose>
            <button
              type="submit"
              className="ds-focus-ring ds-interactive h-10 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]"
            >
              Create budget
            </button>
          </div>
        </form>
      </BaseModalContent>
    </BaseModal>
  )
}
