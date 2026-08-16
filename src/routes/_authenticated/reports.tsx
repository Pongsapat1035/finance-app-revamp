import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowDownLeft, ArrowUpRight, CalendarDays, CircleCheck, Download } from 'lucide-react'

import { AppPageShell } from '#/components/app-shell'

export const Route = createFileRoute('/_authenticated/reports')({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: 'Reports | My Finance' },
      {
        name: 'description',
        content: 'Review cash flow, category spending, and financial trends.',
      },
    ],
  }),
})

type ReportRange = '6 months' | '12 months'

const sixMonthReport = [
  { label: 'Feb', income: 6100, expense: 4480 },
  { label: 'Mar', income: 6350, expense: 4720 },
  { label: 'Apr', income: 6120, expense: 4210 },
  { label: 'May', income: 6680, expense: 4980 },
  { label: 'Jun', income: 6420, expense: 4560 },
  { label: 'Jul', income: 6840, expense: 3972 },
]

const reportRanges: Record<
  ReportRange,
  {
    months: typeof sixMonthReport
    dateLabel: string
    incomeChange: string
    expenseChange: string
  }
> = {
  '6 months': {
    months: sixMonthReport,
    dateLabel: 'Feb 1 - Jul 31, 2026',
    incomeChange: 'Up 5.8%',
    expenseChange: 'Down 3.2%',
  },
  '12 months': {
    months: [
      { label: 'Aug', income: 5800, expense: 4320 },
      { label: 'Sep', income: 6250, expense: 4510 },
      { label: 'Oct', income: 6100, expense: 4620 },
      { label: 'Nov', income: 6400, expense: 4890 },
      { label: 'Dec', income: 7200, expense: 5380 },
      { label: 'Jan', income: 6050, expense: 4410 },
      ...sixMonthReport,
    ],
    dateLabel: 'Aug 1, 2025 - Jul 31, 2026',
    incomeChange: 'Up 8.1%',
    expenseChange: 'Down 1.4%',
  },
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function ReportsPage() {
  const [range, setRange] = useState<ReportRange>('6 months')
  const report = reportRanges[range]
  const totalIncome = report.months.reduce((sum, month) => sum + month.income, 0)
  const totalExpenses = report.months.reduce((sum, month) => sum + month.expense, 0)
  const netSaved = totalIncome - totalExpenses
  const averageSpend = totalExpenses / report.months.length
  const maxChart = Math.max(...report.months.flatMap((month) => [month.income, month.expense]))

  return (
    <AppPageShell activeItem="Reports" searchLabel="Search reports" periodLabel="Financial reports">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Financial performance</p>
          <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-[-0.045em] sm:text-[40px]">
            Reports
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review cash flow, spending trends, and category changes using example data through July
            2026.
          </p>
        </div>
        <button
          type="button"
          className="ds-focus-ring ds-interactive flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm border bg-background px-4 text-sm font-medium hover:bg-muted"
        >
          <Download size={15} strokeWidth={1.75} /> Export report
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-y py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays size={14} /> {report.dateLabel}
        </div>
        <div
          className="inline-flex w-fit rounded-sm bg-muted p-1"
          role="tablist"
          aria-label="Report range"
        >
          {(Object.keys(reportRanges) as ReportRange[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={range === item}
              aria-controls="cash-flow-report"
              onClick={() => setRange(item)}
              className={`ds-focus-ring h-8 rounded-sm px-3 text-xs font-medium ${range === item ? 'bg-background shadow-[0_1px_3px_rgb(22_22_22/0.08)]' : 'text-muted-foreground'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section
        className="mt-6 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Report summary"
      >
        <ReportMetric
          label="Total income"
          value={money(totalIncome)}
          change={report.incomeChange}
          positive
          icon={ArrowDownLeft}
        />
        <ReportMetric
          label="Total expenses"
          value={money(totalExpenses)}
          change={report.expenseChange}
          positive
          icon={ArrowUpRight}
        />
        <ReportMetric
          label="Net saved"
          value={money(netSaved)}
          change={`${((netSaved / totalIncome) * 100).toFixed(1)}% savings rate`}
          positive
          icon={CircleCheck}
        />
        <ReportMetric
          label="Average spend"
          value={money(averageSpend)}
          change="Per month"
          icon={CalendarDays}
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        <section
          id="cash-flow-report"
          role="tabpanel"
          className="overflow-hidden rounded-lg border"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4">
            <div>
              <h2 className="text-base font-medium tracking-[-0.02em]">Cash flow trend</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Income compared with expenses by month.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-4 rounded-[1px] bg-success" />
                Income
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-4 rounded-[1px] bg-chart-plum" />
                Expenses
              </span>
            </div>
          </div>
          <div className="overflow-x-auto p-5">
            <div className={range === '12 months' ? 'min-w-[760px]' : 'min-w-[520px]'}>
              <div
                className="flex h-64 items-end gap-4 border-b border-l px-4 pt-6"
                role="img"
                aria-label={`Income exceeded expenses in each of the selected ${range}.`}
              >
                {report.months.map((month) => (
                  <div
                    key={month.label}
                    className="flex h-full flex-1 items-end justify-center gap-1.5"
                  >
                    <span
                      className="w-[38%] max-w-8 rounded-t-[2px] bg-success"
                      style={{ height: `${(month.income / maxChart) * 100}%` }}
                      title={`${month.label} income ${money(month.income)}`}
                    />
                    <span
                      className="w-[38%] max-w-8 rounded-t-[2px] bg-chart-plum"
                      style={{ height: `${(month.expense / maxChart) * 100}%` }}
                      title={`${month.label} expenses ${money(month.expense)}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pl-4 pt-2">
                {report.months.map((month, index) => (
                  <span
                    key={`${month.label}-${index}`}
                    className="flex-1 text-center font-mono text-[10px] text-muted-foreground"
                  >
                    {month.label}
                  </span>
                ))}
              </div>
              <table className="sr-only">
                <caption>Cash flow report values for {range}</caption>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Expenses</th>
                  </tr>
                </thead>
                <tbody>
                  {report.months.map((month, index) => (
                    <tr key={`${month.label}-${index}`}>
                      <td>{month.label}</td>
                      <td>{money(month.income)}</td>
                      <td>{money(month.expense)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-t bg-muted px-5 py-3">
            <p className="text-[11px] text-muted-foreground">{range} net cash flow</p>
            <p className="font-mono text-sm font-medium text-success">+{money(netSaved)}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border">
          <div className="border-b px-5 py-4">
            <h2 className="text-base font-medium tracking-[-0.02em]">Spending mix</h2>
            <p className="mt-1 text-xs text-muted-foreground">Share of expenses in July.</p>
          </div>
          <div className="p-5">
            <div
              className="flex h-3 overflow-hidden rounded-[2px]"
              aria-label="Housing 48%, food 17%, transport 9%, other 26%"
            >
              <span className="bg-chart-blue" style={{ width: '48%' }} />
              <span className="bg-chart-green" style={{ width: '17%' }} />
              <span className="bg-chart-plum" style={{ width: '9%' }} />
              <span className="bg-warning" style={{ width: '26%' }} />
            </div>
            <div className="mt-6 space-y-4">
              {[
                ['Housing', '48%', '$1,920', 'bg-chart-blue'],
                ['Food and dining', '17%', '$684', 'bg-chart-green'],
                ['Transport', '9%', '$336', 'bg-chart-plum'],
                ['Other', '26%', '$1,032', 'bg-warning'],
              ].map(([name, percent, amount, color]) => (
                <div key={name} className="grid grid-cols-[4px_1fr_auto] items-center gap-3">
                  <span className={`h-8 rounded-[1px] ${color}`} />
                  <div>
                    <p className="text-xs font-medium">{name}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {percent} of expenses
                    </p>
                  </div>
                  <p className="font-mono text-xs font-medium">{amount}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-lg border">
        <div className="border-b px-5 py-4">
          <h2 className="text-base font-medium tracking-[-0.02em]">What changed</h2>
          <p className="mt-1 text-xs text-muted-foreground">Largest changes compared with June.</p>
        </div>
        <div className="grid gap-px bg-border md:grid-cols-[1.1fr_0.9fr]">
          <article className="bg-background p-5">
            <div className="flex items-center gap-2 text-success">
              <ArrowDownLeft size={15} />
              <p className="text-xs font-medium">Dining decreased</p>
            </div>
            <p className="mt-5 font-mono text-xl font-medium">-$184</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Fewer restaurant transactions accounted for most of the change.
            </p>
          </article>
          <article className="bg-background p-5">
            <div className="flex items-center gap-2 text-warning">
              <ArrowUpRight size={15} />
              <p className="text-xs font-medium">Shopping increased</p>
            </div>
            <p className="mt-5 font-mono text-xl font-medium">+$96</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Two home purchases brought the category above its plan.
            </p>
          </article>
        </div>
      </section>
    </AppPageShell>
  )
}

function ReportMetric({
  label,
  value,
  change,
  positive = false,
  icon: Icon,
}: {
  label: string
  value: string
  change: string
  positive?: boolean
  icon: typeof CalendarDays
}) {
  return (
    <article className="bg-background p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon
          size={15}
          strokeWidth={1.75}
          className={positive ? 'text-success' : 'text-muted-foreground'}
        />
      </div>
      <p className="mt-5 font-mono text-[24px] font-medium tracking-[-0.045em]">{value}</p>
      <p className={`mt-1.5 text-[11px] ${positive ? 'text-success' : 'text-muted-foreground'}`}>
        {change}
      </p>
    </article>
  )
}
