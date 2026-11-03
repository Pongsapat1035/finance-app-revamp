import { useEffect, useState, type CSSProperties } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { isAxiosError } from 'axios'
import { Link } from '@tanstack/react-router'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CalendarDays, TrendingUp } from 'lucide-react'

import type {
  ExpenseCategorySummary,
  NetCashFlowResponse,
  TransactionSummaryResponse,
} from '#/api/summary/summary.type'
import { AppSidebar, AppTopBar } from '#/components/app-shell'
import { PageHeader } from '#/components/page-header'
import { buttonClasses } from '#/components/ui/Button'
import UpcomingRecurringRow from '#/components/recurring/UpcomingRecurringRow'
import CategoryDistribution, {
  type CategoryDistributionItem,
} from '#/components/transactions/CategoryDistribution'
import RecentTransactionList from '#/components/transactions/RecentTransactionList'
import MetricCard from '#/components/ui/MetricCard'
import DatePickerField from '#/components/ui/DatePicker'
import { transactionPresentation } from '#/components/transactions/transactionPresentation'
import EmptyState from '#/components/ui/EmptyState'
import ErrorState from '#/components/ui/ErrorState'
import { TransactionType } from '#/enum/enum'
import { useFetchUpcomingRecurringTransaction } from '#/hooks/useRecurringTransaction'
import { useCurrentUser } from '#/hooks/useCurrentUser'
import {
  useFetchExpensesByCategory,
  useFetchNetCashFlow,
  useFetchTransaction,
  useFetchTransactionSummary,
} from '#/hooks/useTransaction'
import { formatNumber } from '#/lib/format'

dayjs.extend(utc)
dayjs.extend(timezone)

type Period = 'monthly' | 'yearly'

type PeriodInfo = {
  label: string
  contextLabel: string
  range: string
  averageLabel: string
}

type ChartPoint = {
  key: string
  label: string
  title: string
  income: number
  expense: number
  future: boolean
}

const categoryColors = [
  'var(--chart-plum)',
  'var(--chart-blue)',
  'var(--chart-green)',
  'var(--chart-amber)',
  'var(--chart-neutral)',
]

const roundTo = (value: number, digits: number) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

const getPeriodInfo = (period: Period, date: dayjs.Dayjs): PeriodInfo => {
  if (period === 'monthly') {
    const label = date.format('MMMM YYYY')
    return {
      label,
      contextLabel: label,
      range: `${date.startOf('month').format('MMM D')}-${date.endOf('month').format('D, YYYY')}`,
      averageLabel: 'Average daily spend',
    }
  }

  const year = date.format('YYYY')
  return {
    label: `${year} overview`,
    contextLabel: year,
    range: `Jan 1-Dec 31, ${year}`,
    averageLabel: 'Average monthly spend',
  }
}

const getSavingsRate = (income: number, net: number) =>
  income > 0 ? roundTo((net / income) * 100, 1) : null

// Use elapsed days in the current month and all days for a completed month.
const getAverageSpend = (expenses: number, period: Period, today: dayjs.Dayjs, month: string) => {
  const divisor =
    period === 'yearly'
      ? today.month() + 1
      : month === today.format('YYYY-MM')
        ? today.date()
        : dayjs(`${month}-01`).daysInMonth()
  return roundTo(expenses / divisor, 2)
}

const toChartPoints = (
  data: NetCashFlowResponse,
  period: Period,
  today: dayjs.Dayjs,
): ChartPoint[] =>
  data.data.map((item) => {
    const date = dayjs(item.period)
    const day = date.date()

    return {
      key: item.period,
      // The daily view has up to 31 bars, so only every fifth day is labelled to keep the axis readable.
      label:
        period === 'monthly' ? (day === 1 || day % 5 === 0 ? String(day) : '') : date.format('MMM'),
      title: period === 'monthly' ? date.format('MMM D') : date.format('MMM YYYY'),
      income: item.income,
      expense: item.expenses,
      future: date.isAfter(today, period === 'monthly' ? 'day' : 'month'),
    }
  })

const toCategoryItems = (data: ExpenseCategorySummary[]): CategoryDistributionItem[] =>
  data.map((item, index) => ({
    id: String(item.categoryId ?? 'uncategorized'),
    name: item.title,
    amount: item.amount,
    percent: item.percentage,
    color: categoryColors[index % categoryColors.length],
  }))

const getSummaryErrorDescription = (error: unknown) => {
  if (!isAxiosError(error) || error.response?.status !== 429) return undefined

  const retryAfter = Number(error.response.headers['retry-after'])
  return Number.isFinite(retryAfter) && retryAfter > 0
    ? `Too many requests. Try again in ${retryAfter} seconds.`
    : 'Too many requests. Wait a moment before trying again.'
}

function PeriodSwitch({
  period,
  setPeriod,
}: {
  period: Period
  setPeriod: (period: Period) => void
}) {
  return (
    <div
      className="relative grid grid-cols-2 rounded-sm border bg-muted p-1"
      role="tablist"
      aria-label="Dashboard period"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-1 rounded-sm bg-background shadow-[0_1px_3px_rgb(22_22_22/0.09)] motion-safe:transition-transform motion-safe:duration-(--duration-base) motion-safe:ease-(--ease-in-out)"
        style={{
          width: `calc((100% - 8px) / 2)`,
          transform: `translateX(${(period === 'yearly' ? 1 : 0) * 100}%)`,
        }}
      />
      {(['monthly', 'yearly'] as Period[]).map((item) => {
        const active = period === item
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setPeriod(item)}
            className={`ds-focus-ring ds-interactive relative h-8 rounded-sm px-3 text-xs font-medium capitalize ${
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}

function MetricStrip({
  info,
  summary,
  isPending,
  isError,
  errorDescription,
  onRetry,
}: {
  info: PeriodInfo
  summary?: TransactionSummaryResponse
  isPending: boolean
  isError: boolean
  errorDescription?: string
  onRetry: () => void
}) {
  const savingsRate = summary ? getSavingsRate(summary.income, summary.net) : null
  const metrics = [
    {
      label: 'Investment',
      value: summary?.investment,
      note: info.range,
      icon: transactionPresentation[TransactionType.INVESTMENT].icon,
      tone: 'neutral' as const,
    },
    {
      label: 'Income',
      value: summary?.income,
      note: summary
        ? `${formatNumber(summary.transactionCount)} total transactions`
        : info.contextLabel,
      icon: ArrowDownLeft,
    },
    {
      label: 'Expenses',
      value: summary ? -summary.expenses : undefined,
      note: info.averageLabel,
      icon: ArrowUpRight,
      formatValue: (value: number) => formatNumber(Math.abs(value)),
    },
    {
      label: 'Net saved',
      value: summary?.net,
      note: !summary
        ? info.contextLabel
        : savingsRate === null
          ? 'No income for a savings rate'
          : `${formatNumber(savingsRate)}% savings rate`,
      icon: TrendingUp,
    },
  ]

  return (
    <section
      className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border xl:grid-cols-4"
      aria-label={`${info.label} financial summary`}
      aria-busy={isPending}
    >
      {isError ? (
        <ErrorState
          title="Could not load financial summary"
          description={errorDescription}
          onRetry={onRetry}
          retryLabel="Retry summary"
          className="col-span-2 bg-background xl:col-span-4"
        />
      ) : (
        metrics.map((item) => (
          <MetricCard key={item.label} {...item} noteClassName="truncate" loading={isPending} />
        ))
      )}
    </section>
  )
}

function CashFlowChart({
  info,
  period,
  today,
  month,
  data,
  isPending,
  isError,
  onRetry,
}: {
  info: PeriodInfo
  period: Period
  today: dayjs.Dayjs
  month: string
  data?: NetCashFlowResponse
  isPending: boolean
  isError: boolean
  onRetry: () => void
}) {
  return (
    <section
      className="overflow-hidden rounded-lg border bg-background"
      aria-label="Cash flow"
      aria-busy={isPending}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="text-base font-medium tracking-[-0.02em]">Cash flow</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Income compared with expenses for {info.contextLabel}.
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

      {isError ? (
        <ErrorState
          title="Could not load cash flow"
          onRetry={onRetry}
          retryLabel="Retry cash flow"
        />
      ) : isPending || !data ? (
        <div className="p-5" aria-label="Loading cash flow">
          <div className="h-64 rounded-sm bg-muted motion-safe:animate-pulse" />
        </div>
      ) : (
        <CashFlowChartBody info={info} period={period} today={today} month={month} data={data} />
      )}
    </section>
  )
}

function CashFlowChartBody({
  info,
  period,
  today,
  month,
  data,
}: {
  info: PeriodInfo
  period: Period
  today: dayjs.Dayjs
  month: string
  data: NetCashFlowResponse
}) {
  const points = toChartPoints(data, period, today)
  const dense = points.length > 12
  const maxValue = Math.max(...points.flatMap((point) => [point.income, point.expense]), 1)
  const { income, expenses, netCashFlow } = data.totals
  const savingsRate = getSavingsRate(income, netCashFlow)
  const netTone =
    netCashFlow > 0 ? 'text-success-text' : netCashFlow < 0 ? 'text-destructive-text' : ''

  return (
    <>
      <div className="overflow-x-auto p-5">
        <div className="min-w-[520px]">
          <div
            className={`flex h-56 items-end border-b border-l px-4 pt-4 ${dense ? 'gap-1' : 'gap-3'}`}
            role="img"
            aria-label={`Cash flow chart for ${info.contextLabel}. Income ${formatNumber(income)}, expenses ${formatNumber(expenses)}, net ${formatNumber(netCashFlow)}.`}
          >
            {points.map((point, index) => (
              <div
                key={point.key}
                className={`flex h-full flex-1 items-end justify-center ${dense ? 'min-w-3 gap-0.5' : 'min-w-8 gap-1.5'}`}
                style={{ '--ds-delay': `${index * 12}ms` } as CSSProperties}
              >
                <span
                  className={`ds-grow-y w-[42%] max-w-8 rounded-t-[2px] ${point.future ? 'border border-dashed border-border bg-transparent' : 'bg-success'}`}
                  style={{
                    height: point.future
                      ? '4%'
                      : `${Math.max((point.income / maxValue) * 100, point.income ? 3 : 0)}%`,
                  }}
                  title={`${point.title} income ${formatNumber(point.income)}`}
                />
                <span
                  className={`ds-grow-y w-[42%] max-w-8 rounded-t-[2px] ${point.future ? 'border border-dashed border-border bg-transparent' : 'bg-chart-plum'}`}
                  style={{
                    height: point.future
                      ? '4%'
                      : `${Math.max((point.expense / maxValue) * 100, point.expense ? 3 : 0)}%`,
                  }}
                  title={`${point.title} expenses ${formatNumber(point.expense)}`}
                />
              </div>
            ))}
          </div>
          <div className={`flex px-4 pt-2 ${dense ? 'gap-1' : 'gap-3'}`}>
            {points.map((point) => (
              <span
                key={point.key}
                className={`flex-1 text-center font-mono text-[10px] text-muted-foreground ${dense ? 'min-w-3' : 'min-w-8'}`}
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
          <p className={`mt-1 font-mono text-sm font-medium ${netTone}`}>
            {netCashFlow > 0 ? '+' : ''}
            {formatNumber(netCashFlow)}
          </p>
        </div>
        <div className="bg-muted px-5 py-3">
          <p className="text-[10px] text-muted-foreground">SAVINGS RATE</p>
          <p className="mt-1 font-mono text-sm font-medium">
            {savingsRate === null ? 'No income' : `${formatNumber(savingsRate)}%`}
          </p>
        </div>
        <div className="bg-muted px-5 py-3">
          <p className="text-[10px] text-muted-foreground">{info.averageLabel.toUpperCase()}</p>
          <p className="mt-1 font-mono text-sm font-medium">
            {formatNumber(getAverageSpend(expenses, period, today, month))}
          </p>
        </div>
      </div>
    </>
  )
}

function CategoryBreakdown({
  info,
  categories,
  isPending,
  isError,
  errorDescription,
  onRetry,
}: {
  info: PeriodInfo
  categories?: CategoryDistributionItem[]
  isPending: boolean
  isError: boolean
  errorDescription?: string
  onRetry: () => void
}) {
  return (
    <section
      className="overflow-hidden rounded-lg border bg-background"
      aria-label="Spending by category"
      aria-busy={isPending}
    >
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-medium tracking-[-0.02em]">Spending by category</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Where your expenses went in {info.contextLabel} (THB).
        </p>
      </div>
      {isError ? (
        <ErrorState
          title="Could not load spending by category"
          description={errorDescription}
          onRetry={onRetry}
          retryLabel="Retry categories"
        />
      ) : isPending || !categories ? (
        <DashboardListLoading label="Loading spending by category" count={5} />
      ) : categories.every((category) => category.amount === 0) ? (
        <EmptyState
          title="No expenses yet"
          description={`Expenses you add for ${info.contextLabel} will appear here.`}
        />
      ) : (
        <CategoryDistribution categories={categories} />
      )}
    </section>
  )
}

function DashboardListLoading({
  label,
  count,
  showIcon = false,
  showDate = false,
}: {
  label: string
  count: number
  showIcon?: boolean
  showDate?: boolean
}) {
  return (
    <div className="divide-y motion-safe:animate-pulse" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 px-5 py-3.5" aria-hidden="true">
          {showIcon && <div className="size-9 shrink-0 rounded-sm bg-muted" />}
          {showDate && (
            <>
              <div className="h-8 w-14 shrink-0 rounded-sm bg-muted" />
              <div className="h-9 w-1 shrink-0 rounded-sm bg-muted" />
            </>
          )}
          <div className="grid min-w-0 flex-1 gap-2">
            <div className="h-4 w-32 max-w-full rounded-sm bg-muted" />
            <div className="h-3 w-40 max-w-full rounded-sm bg-muted" />
          </div>
          <div className="h-4 w-16 shrink-0 rounded-sm bg-muted" />
        </div>
      ))}
    </div>
  )
}

function RecentTransactions() {
  const transactionsQuery = useFetchTransaction({ page: 1, limit: 5 })
  const [minimumLoadingElapsed, setMinimumLoadingElapsed] = useState(false)
  useEffect(() => {
    const timeout = window.setTimeout(() => setMinimumLoadingElapsed(true), 1000)
    return () => window.clearTimeout(timeout)
  }, [])
  const isLoading =
    !transactionsQuery.isError && (transactionsQuery.isPending || !minimumLoadingElapsed)
  const transactions = transactionsQuery.data?.data ?? []

  return (
    <section
      className="overflow-hidden rounded-lg border bg-background"
      aria-label="Latest transactions"
      aria-busy={isLoading}
    >
      <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="text-base font-medium tracking-[-0.02em]">Latest transactions</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Most recent activity across all categories (THB).
          </p>
        </div>
        <Link
          to="/transactions"
          className="ds-focus-ring flex items-center gap-1.5 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>
      {isLoading ? (
        <DashboardListLoading label="Loading latest transactions" count={5} showIcon />
      ) : transactionsQuery.isError ? (
        <ErrorState
          title="Could not load latest transactions"
          onRetry={() => void transactionsQuery.refetch()}
          retryLabel="Retry transactions"
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Add your first transaction from the Transactions page."
        />
      ) : (
        <RecentTransactionList transactions={transactions} />
      )}
    </section>
  )
}

function RecurringPayments() {
  const upcomingQuery = useFetchUpcomingRecurringTransaction()
  const payments = upcomingQuery.data?.data ?? []
  const total = upcomingQuery.data?.meta.expectedTotal ?? 0

  return (
    <section
      className="flex flex-col overflow-hidden rounded-lg border bg-background"
      aria-label="Upcoming recurring"
      aria-busy={upcomingQuery.isPending}
    >
      <div className="border-b px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-medium tracking-[-0.02em]">Upcoming recurring</h2>
            <p className="mt-1 text-xs text-muted-foreground">Expected in the next 30 days.</p>
          </div>
          <Link
            to="/recurring"
            className="ds-focus-ring flex items-center gap-1.5 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Manage <ArrowRight size={13} />
          </Link>
        </div>
      </div>
      {upcomingQuery.isPending ? (
        <DashboardListLoading label="Loading upcoming recurring" count={3} showDate />
      ) : upcomingQuery.isError ? (
        <ErrorState
          title="Could not load upcoming recurring"
          onRetry={() => void upcomingQuery.refetch()}
          retryLabel="Retry recurring"
        />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No upcoming recurring expenses"
          description="No scheduled expenses are due in the next 30 days."
        />
      ) : (
        <div className="divide-y">
          {payments.map((payment) => (
            <UpcomingRecurringRow
              key={`${payment.id}-${payment.dueDate}`}
              dueDate={payment.dueDate}
              description={payment.description}
              category={payment.category?.title ?? 'Uncategorized'}
              amount={payment.amount}
            />
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between border-t bg-muted px-5 py-3">
        <p className="text-[11px] text-muted-foreground">Expected total (THB)</p>
        <p className="font-mono text-sm font-medium">
          {upcomingQuery.isPending ? (
            <span
              className="block h-5 w-20 rounded-sm bg-border motion-safe:animate-pulse"
              aria-label="Loading expected total"
            />
          ) : upcomingQuery.isError ? (
            'Unavailable'
          ) : (
            formatNumber(total)
          )}
        </p>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const { data: user } = useCurrentUser()
  const userName = user?.name?.trim()
  const [period, setPeriod] = useState<Period>('monthly')
  const today = dayjs().tz('Asia/Bangkok')
  const currentMonth = today.format('YYYY-MM')
  const [month, setMonth] = useState(currentMonth)
  const info = getPeriodInfo(period, period === 'monthly' ? dayjs(`${month}-01`) : today)
  const summaryParams = period === 'monthly' ? { month } : { year: today.year() }

  const summaryQuery = useFetchTransactionSummary(summaryParams)
  const categoriesQuery = useFetchExpensesByCategory(summaryParams)
  const cashFlowQuery = useFetchNetCashFlow(
    period === 'monthly' ? { type: 'monthly', month } : { type: 'yearly', year: today.year() },
  )

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AppSidebar activeItem="Overview" />
      <AppTopBar
        activeItem="Overview"
        periodControl={
          period === 'monthly' ? (
            <DatePickerField
              label="Filter by month"
              mode="month"
              value={month}
              onValueChange={setMonth}
              max={currentMonth}
              className="w-40 gap-0 [&>label]:sr-only [&>button]:h-9 [&>button]:text-xs"
            />
          ) : (
            <p className="flex h-9 items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
              <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" /> {info.range}
            </p>
          )
        }
      />

      <main className="ds-vt-page lg:ml-56">
        <div className="mx-auto w-full max-w-330 px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <PageHeader
            eyebrow="Financial overview"
            title={userName ? `Hello, ${userName}` : 'Hello'}
            description={`Here is the full picture for ${info.contextLabel}. Amounts in THB.`}
            action={<PeriodSwitch period={period} setPeriod={setPeriod} />}
          />

          <div className="mt-8">
            <MetricStrip
              info={info}
              summary={summaryQuery.data}
              isPending={summaryQuery.isPending}
              isError={summaryQuery.isError}
              errorDescription={getSummaryErrorDescription(summaryQuery.error)}
              onRetry={() => void summaryQuery.refetch()}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
            <CashFlowChart
              info={info}
              period={period}
              today={today}
              month={month}
              data={cashFlowQuery.data}
              isPending={cashFlowQuery.isPending}
              isError={cashFlowQuery.isError}
              onRetry={() => void cashFlowQuery.refetch()}
            />
            <CategoryBreakdown
              info={info}
              categories={categoriesQuery.data && toCategoryItems(categoriesQuery.data.data)}
              isPending={categoriesQuery.isPending}
              isError={categoriesQuery.isError}
              errorDescription={getSummaryErrorDescription(categoriesQuery.error)}
              onRetry={() => void categoriesQuery.refetch()}
            />
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
            <Link to="/transactions" className={buttonClasses()}>
              View transactions <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
