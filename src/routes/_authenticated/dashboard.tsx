import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  TrendingUp,
} from 'lucide-react'

import { AppSidebar, AppTopBar } from '#/components/app-shell'
import { formatCurrency as currency } from '#/lib/format'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: 'Dashboard | My Finance' },
      {
        name: 'description',
        content: 'A monthly and yearly overview of personal income and expenses.',
      },
    ],
  }),
})

type Period = 'monthly' | 'yearly'

type DashboardData = {
  label: string
  contextLabel: string
  range: string
  balance: number
  income: number
  expenses: number
  net: number
  savingsRate: number
  transactionCount: number
  averageLabel: string
  averageValue: number
  chart: Array<{ label: string; income: number; expense: number }>
  categories: Array<{ name: string; amount: number; percent: number; color: string }>
}

const periodData: Record<Period, DashboardData> = {
  monthly: {
    label: 'July 2026',
    contextLabel: 'July 2026',
    range: 'Jul 1-31, 2026',
    balance: 2791.01,
    income: 4150,
    expenses: 1358.99,
    net: 2791.01,
    savingsRate: 67.3,
    transactionCount: 24,
    averageLabel: 'Average daily spend',
    averageValue: 43.84,
    chart: [
      { label: 'Jul 1', income: 0, expense: 146 },
      { label: 'Jul 5', income: 0, expense: 252 },
      { label: 'Jul 10', income: 3500, expense: 318 },
      { label: 'Jul 15', income: 0, expense: 208 },
      { label: 'Jul 20', income: 0, expense: 176 },
      { label: 'Jul 25', income: 650, expense: 154 },
      { label: 'Jul 31', income: 0, expense: 104.99 },
    ],
    categories: [
      { name: 'Housing', amount: 760, percent: 55.9, color: '#704366' },
      { name: 'Groceries', amount: 241.4, percent: 17.8, color: '#5f86c9' },
      { name: 'Dining', amount: 142, percent: 10.4, color: '#2f9c58' },
      { name: 'Transport', amount: 118.6, percent: 8.7, color: '#a46714' },
      { name: 'Other', amount: 96.99, percent: 7.2, color: '#9b9b97' },
    ],
  },
  yearly: {
    label: '2026 overview',
    contextLabel: '2026',
    range: 'Jan 1-Dec 31, 2026',
    balance: 18426.72,
    income: 42360,
    expenses: 23933.28,
    net: 18426.72,
    savingsRate: 43.5,
    transactionCount: 286,
    averageLabel: 'Average monthly spend',
    averageValue: 3419.04,
    chart: [
      { label: 'Jan', income: 5100, expense: 2980 },
      { label: 'Feb', income: 4200, expense: 3210 },
      { label: 'Mar', income: 5650, expense: 3480 },
      { label: 'Apr', income: 4300, expense: 3090 },
      { label: 'May', income: 5900, expense: 3620 },
      { label: 'Jun', income: 4710, expense: 2860 },
      { label: 'Jul', income: 4150, expense: 1358.99 },
      { label: 'Aug', income: 0, expense: 0 },
      { label: 'Sep', income: 0, expense: 0 },
      { label: 'Oct', income: 0, expense: 0 },
      { label: 'Nov', income: 0, expense: 0 },
      { label: 'Dec', income: 0, expense: 0 },
    ],
    categories: [
      { name: 'Housing', amount: 9120, percent: 38.1, color: '#704366' },
      { name: 'Groceries', amount: 4312.64, percent: 18, color: '#5f86c9' },
      { name: 'Dining', amount: 3468.2, percent: 14.5, color: '#2f9c58' },
      { name: 'Transport', amount: 2871.55, percent: 12, color: '#a46714' },
      { name: 'Other', amount: 4160.89, percent: 17.4, color: '#9b9b97' },
    ],
  },
}

const recentTransactions = [
  { name: 'Green Market', category: 'Groceries', date: 'Jul 12', amount: -82.4 },
  { name: 'Monthly salary', category: 'Salary', date: 'Jul 10', amount: 3500 },
  { name: 'City apartment', category: 'Housing', date: 'Jul 8', amount: -1250 },
  { name: 'Spotify', category: 'Subscriptions', date: 'Jul 7', amount: -11.99 },
  { name: 'Grab', category: 'Transport', date: 'Jul 6', amount: -14.6 },
]

const recurringPayments = [
  { name: 'City apartment', date: 'Aug 1', amount: 1250, category: 'Housing' },
  { name: 'Spotify', date: 'Aug 7', amount: 11.99, category: 'Subscriptions' },
  { name: 'Cloud storage', date: 'Aug 12', amount: 9.99, category: 'Subscriptions' },
]

function PeriodSwitch({
  period,
  setPeriod,
}: {
  period: Period
  setPeriod: (period: Period) => void
}) {
  return (
    <div
      className="grid grid-cols-2 rounded-sm border bg-muted p-1"
      role="tablist"
      aria-label="Dashboard period"
    >
      {(['monthly', 'yearly'] as Period[]).map((item) => {
        const active = period === item
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setPeriod(item)}
            className={`ds-focus-ring ds-interactive h-8 rounded-sm px-3 text-xs font-medium capitalize ${
              active
                ? 'bg-background text-foreground shadow-[0_1px_3px_rgb(22_22_22/0.08)]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}

function MetricStrip({ data }: { data: DashboardData }) {
  const metrics = [
    { label: 'Current balance', value: data.balance, note: data.range, icon: CircleDollarSign },
    {
      label: 'Income',
      value: data.income,
      note: `${data.transactionCount} total transactions`,
      icon: ArrowDownLeft,
      positive: true,
    },
    { label: 'Expenses', value: data.expenses, note: data.averageLabel, icon: ArrowUpRight },
    {
      label: 'Net saved',
      value: data.net,
      note: `${data.savingsRate}% savings rate`,
      icon: TrendingUp,
      positive: true,
    },
  ]

  return (
    <section
      className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 xl:grid-cols-4"
      aria-label={`${data.label} financial summary`}
    >
      {metrics.map(({ label, value, note, icon: Icon, positive }) => (
        <article key={label} className="bg-background p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <Icon
              size={15}
              strokeWidth={1.75}
              className={positive ? 'text-success' : 'text-muted-foreground'}
            />
          </div>
          <p
            className={`mt-5 font-mono text-[24px] font-medium tracking-[-0.045em] ${positive && label !== 'Current balance' ? 'text-success' : ''}`}
          >
            {currency(value)}
          </p>
          <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{note}</p>
        </article>
      ))}
    </section>
  )
}

function CashFlowChart({ data }: { data: DashboardData }) {
  const maxValue = Math.max(...data.chart.flatMap((point) => [point.income, point.expense]), 1)

  return (
    <section className="overflow-hidden rounded-lg border bg-background">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="text-base font-medium tracking-[-0.02em]">Cash flow</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Income compared with expenses for {data.contextLabel}.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-4 rounded-[1px] bg-success" /> Income
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-4 rounded-[1px] bg-chart-plum" /> Expenses
          </span>
        </div>
      </div>

      <div className="overflow-x-auto p-5">
        <div className="min-w-[520px]">
          <div
            className="flex h-56 items-end gap-3 border-b border-l px-4 pt-4"
            role="img"
            aria-label={`Cash flow chart. Income ${currency(data.income)}, expenses ${currency(data.expenses)}.`}
          >
            {data.chart.map((point) => {
              const future = point.income === 0 && point.expense === 0
              return (
                <div
                  key={point.label}
                  className="flex h-full min-w-8 flex-1 items-end justify-center gap-1.5"
                >
                  <span
                    className={`w-[42%] max-w-8 rounded-t-[2px] ${future ? 'border border-dashed border-border bg-transparent' : 'bg-success'}`}
                    style={{
                      height: future
                        ? '4%'
                        : `${Math.max((point.income / maxValue) * 100, point.income ? 3 : 0)}%`,
                    }}
                    title={`${point.label} income ${currency(point.income)}`}
                  />
                  <span
                    className={`w-[42%] max-w-8 rounded-t-[2px] ${future ? 'border border-dashed border-border bg-transparent' : 'bg-chart-plum'}`}
                    style={{
                      height: future
                        ? '4%'
                        : `${Math.max((point.expense / maxValue) * 100, point.expense ? 3 : 0)}%`,
                    }}
                    title={`${point.label} expenses ${currency(point.expense)}`}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 pl-4 pt-2">
            {data.chart.map((point) => (
              <span
                key={point.label}
                className="min-w-8 flex-1 text-center font-mono text-[10px] text-muted-foreground"
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-px border-t bg-border sm:grid-cols-3">
        <div className="bg-muted px-5 py-3">
          <p className="text-[10px] text-muted-foreground">NET CASH FLOW</p>
          <p className="mt-1 font-mono text-sm font-medium text-success">+{currency(data.net)}</p>
        </div>
        <div className="bg-muted px-5 py-3">
          <p className="text-[10px] text-muted-foreground">SAVINGS RATE</p>
          <p className="mt-1 font-mono text-sm font-medium">{data.savingsRate}%</p>
        </div>
        <div className="bg-muted px-5 py-3">
          <p className="text-[10px] text-muted-foreground">{data.averageLabel.toUpperCase()}</p>
          <p className="mt-1 font-mono text-sm font-medium">{currency(data.averageValue)}</p>
        </div>
      </div>
    </section>
  )
}

function CategoryBreakdown({ data }: { data: DashboardData }) {
  return (
    <section className="overflow-hidden rounded-lg border bg-background">
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-medium tracking-[-0.02em]">Spending by category</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Where your expenses went in {data.contextLabel}.
        </p>
      </div>
      <div className="p-5">
        <div
          className="flex h-3 overflow-hidden rounded-[2px]"
          aria-label="Stacked spending distribution"
        >
          {data.categories.map((category) => (
            <span
              key={category.name}
              style={{ width: `${category.percent}%`, backgroundColor: category.color }}
              title={`${category.name} ${category.percent}%`}
            />
          ))}
        </div>
        <div className="mt-6 divide-y">
          {data.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-[4px_1fr_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span
                className="h-8 rounded-[1px]"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{category.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {category.percent}% of expenses
                </p>
              </div>
              <p className="font-mono text-xs font-medium tabular-nums">
                {currency(category.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecentTransactions() {
  return (
    <section className="overflow-hidden rounded-lg border bg-background">
      <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="text-base font-medium tracking-[-0.02em]">Latest transactions</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Most recent activity across all categories.
          </p>
        </div>
        <Link
          to="/transactions"
          className="ds-focus-ring flex items-center gap-1.5 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>
      <div className="divide-y">
        {recentTransactions.map((transaction) => {
          const income = transaction.amount > 0
          return (
            <div
              key={`${transaction.name}-${transaction.date}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/65"
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-sm ${income ? 'bg-success-soft text-success' : 'bg-muted text-foreground'}`}
              >
                {income ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{transaction.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {transaction.category}, {transaction.date}
                </p>
              </div>
              <p
                className={`shrink-0 font-mono text-xs font-medium tabular-nums ${income ? 'text-success' : ''}`}
              >
                {income ? '+' : '-'}
                {currency(Math.abs(transaction.amount))}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RecurringPayments() {
  const total = recurringPayments.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <section className="overflow-hidden rounded-lg border bg-background">
      <div className="border-b px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-medium tracking-[-0.02em]">Upcoming recurring</h2>
            <p className="mt-1 text-xs text-muted-foreground">Expected in the next 30 days.</p>
          </div>
          <CalendarDays size={17} className="text-muted-foreground" />
        </div>
      </div>
      <div className="divide-y">
        {recurringPayments.map((payment) => (
          <div key={payment.name} className="flex items-center gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{payment.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {payment.category}, due {payment.date}
              </p>
            </div>
            <p className="font-mono text-xs font-medium tabular-nums">{currency(payment.amount)}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t bg-muted px-5 py-3">
        <p className="text-[11px] text-muted-foreground">Expected total</p>
        <p className="font-mono text-sm font-medium">{currency(total)}</p>
      </div>
    </section>
  )
}

function DashboardPage() {
  const [period, setPeriod] = useState<Period>('monthly')
  const data = useMemo(() => periodData[period], [period])

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AppSidebar activeItem="Overview" />
      <AppTopBar
        activeItem="Overview"
        searchLabel="Search your finances"
        periodLabel={data.label}
        periodClassName="hidden text-xs text-muted-foreground sm:block"
      />

      <main className="lg:ml-56">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Financial overview</p>
              <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
                Good morning, Mina
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Here is the full picture for {data.contextLabel}.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <PeriodSwitch period={period} setPeriod={setPeriod} />
              <button
                type="button"
                className="ds-focus-ring flex h-8 items-center justify-between gap-3 rounded-sm px-1 text-xs text-muted-foreground sm:justify-end"
              >
                <CalendarDays size={14} /> {data.range} <ChevronDown size={13} />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <MetricStrip data={data} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
            <CashFlowChart data={data} />
            <CategoryBreakdown data={data} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
            <RecentTransactions />
            <RecurringPayments />
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium">Need the complete ledger?</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Review, filter, and add transactions from the activity page.
              </p>
            </div>
            <Link
              to="/transactions"
              className="ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground no-underline hover:bg-[#c7e600]"
            >
              View transactions <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
