import { Link } from '@tanstack/react-router'
import { ArrowRight, ReceiptText, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'

import GridOverlay from '#/components/GridOverlay'
import LedgrIcon from '#/components/icons/LedgrIcon'
import CategoryDistribution from '#/components/transactions/CategoryDistribution'
import RecentTransactionList from '#/components/transactions/RecentTransactionList'
import MetricCard from '#/components/ui/MetricCard'
import { TransactionType } from '#/enum/enum'
import { formatNumber } from '#/lib/format'

const heroTransactions = [
  {
    id: 1,
    description: 'Green Market',
    categoryTitle: 'Groceries',
    date: '2026-07-12',
    amount: 82.4,
    type: TransactionType.EXPEND,
  },
  {
    id: 2,
    description: 'Monthly salary',
    categoryTitle: 'Salary',
    date: '2026-07-10',
    amount: 3500,
    type: TransactionType.INCOME,
  },
  {
    id: 3,
    description: 'City apartment',
    categoryTitle: 'Housing',
    date: '2026-07-08',
    amount: 1250,
    type: TransactionType.EXPEND,
  },
  {
    id: 4,
    description: 'Spotify',
    categoryTitle: 'Subscriptions',
    date: '2026-07-07',
    amount: 11.99,
    type: TransactionType.EXPEND,
  },
]

const categoryBreakdown = [
  { id: 'housing', name: 'Housing', percent: 55.9, amount: 760, color: 'var(--chart-plum)' },
  { id: 'groceries', name: 'Groceries', percent: 17.8, amount: 241.4, color: 'var(--chart-blue)' },
  { id: 'dining', name: 'Dining', percent: 10.4, amount: 142, color: 'var(--chart-green)' },
  { id: 'transport', name: 'Transport', percent: 8.7, amount: 118.6, color: 'var(--chart-amber)' },
  { id: 'other', name: 'Other', percent: 7.2, amount: 96.99, color: 'var(--chart-neutral)' },
]

const stats = [
  { label: 'Savings rate', value: '67.3%' },
  { label: 'Transactions tracked', value: '24' },
  { label: 'Average daily spend', value: formatNumber(43.84) },
  { label: 'Categories organized', value: '5' },
]

const Nav = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-330 items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="ds-focus-ring inline-flex items-center gap-2.5 text-foreground no-underline"
        >
          <LedgrIcon size={30} />
          <span className="text-sm font-medium">Ledgr</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="ds-focus-ring ds-interactive flex h-9 items-center rounded-sm px-3 text-sm font-medium text-muted-foreground no-underline hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="ds-focus-ring ds-interactive flex h-9 items-center rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground no-underline hover:bg-[#c7e600]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}

const HeroPreviewPanel = () => {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-[0_24px_70px_rgb(22_22_22/0.1)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-1000">
      <div className="flex items-center justify-between border-b bg-muted px-5 py-4">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">EXAMPLE MONTH</p>
          <p className="mt-1 text-sm font-medium">July 2026 overview</p>
        </div>
        <span className="rounded-full bg-success-soft px-2 py-1 text-[10px] font-semibold text-success-text">
          On track
        </span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        <MetricCard label="Income" value={4150} note="July 2026" tone="neutral" />
        <MetricCard label="Expenses" value={1358.99} note="July 2026" tone="neutral" />
      </div>
      <div className="p-5">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] text-muted-foreground">Available after expenses</p>
            <p className="mt-2 font-mono text-[28px] font-medium tracking-[-0.045em]">
              {formatNumber(2791.01)}
            </p>
          </div>
          <div
            className="flex h-14 w-32 items-end gap-1"
            aria-label="Example daily spending trend, low to high"
          >
            {[42, 56, 38, 66, 48, 74, 62, 86, 72, 100].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="min-w-1 flex-1 rounded-t-[1px] bg-accent"
                style={{ height: `${height}%`, opacity: 0.35 + index * 0.06 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Hero = () => {
  return (
    <section className="ds-grid border-b border-border">
      <div className="mx-auto grid w-full max-w-330 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8 lg:px-8 lg:py-28">
        <div className="max-w-xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-1000">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles size={14} strokeWidth={1.75} className="text-accent" />
            Personal finance, clearly organized
          </p>
          <h1 className="mt-5 text-[40px] font-medium leading-[0.98] tracking-[-0.05em] sm:text-[52px] xl:text-[64px]">
            Know where your money goes.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Ledgr brings your income, expenses, and savings into one clear picture, so decisions
            take seconds, not spreadsheets.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              className="group ds-focus-ring ds-interactive flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-semibold text-accent-foreground no-underline hover:bg-[#c7e600]"
            >
              Get started{' '}
              <ArrowRight
                size={15}
                className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
              />
            </Link>
            <Link
              to="/auth"
              className="ds-focus-ring ds-interactive flex h-11 items-center justify-center rounded-sm border border-input bg-background px-5 text-sm font-medium text-foreground no-underline hover:bg-muted"
            >
              Sign in
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t pt-5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={14} strokeWidth={1.75} /> Private by design
            </span>
            <span className="inline-flex items-center gap-2">
              <TrendingUp size={14} strokeWidth={1.75} /> Built for daily tracking
            </span>
          </div>
        </div>
        <HeroPreviewPanel />
      </div>
    </section>
  )
}

const featureHighlights = [
  {
    icon: ReceiptText,
    title: 'Organized by category',
    description: 'Choose a category for each transaction and review your spending by category.',
  },
  {
    icon: TrendingUp,
    title: 'Real-time picture',
    description: 'Income, expenses, and balances update as you go, not once a month.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    description: 'Your ledger is yours. Nothing is sold, shared, or used to sell you anything.',
  },
]

const FeatureBand = () => {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#171717] text-white">
      <GridOverlay />
      <div className="relative mx-auto w-full max-w-330 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-medium text-accent">Why Ledgr</p>
        <h2 className="mt-3 max-w-lg text-[26px] font-medium leading-[1.15] tracking-[-0.03em] sm:text-[30px]">
          Built to keep you in control of your money, not the other way around.
        </h2>
        <div className="mt-10 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3 sm:gap-6">
          {featureHighlights.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon size={18} strokeWidth={1.75} className="text-accent" />
              <p className="mt-4 text-sm font-medium">{title}</p>
              <p className="mt-2 text-[13px] leading-6 text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TransactionsStory = () => {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-full max-w-330 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-md">
          <p className="text-xs font-medium text-muted-foreground">Money activity</p>
          <h2 className="mt-3 text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px]">
            Every transaction, organized in one place.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Track income and expenses in one ledger. Choose a category and review recent activity in
            seconds.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="border-b bg-muted px-5 py-3">
            <p className="text-[11px] font-medium text-muted-foreground">EXAMPLE TRANSACTIONS</p>
          </div>
          <RecentTransactionList transactions={heroTransactions} />
        </div>
      </div>
    </section>
  )
}

const CategoryStory = () => {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-full max-w-330 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-lg border bg-background lg:order-1">
          <p className="px-5 pt-5 text-[11px] font-medium text-muted-foreground">
            EXAMPLE SPENDING, JULY 2026
          </p>
          <CategoryDistribution categories={categoryBreakdown} />
        </div>
        <div className="max-w-md lg:order-2">
          <p className="text-xs font-medium text-muted-foreground">Spending insight</p>
          <h2 className="mt-3 text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px]">
            See exactly where it goes.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Category breakdowns update as you spend, so you can catch a drifting budget before the
            month closes, not after.
          </p>
        </div>
      </div>
    </section>
  )
}

const StatsBand = () => {
  return (
    <section className="border-b border-border bg-muted">
      <div className="mx-auto w-full max-w-330 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-medium text-muted-foreground">Example data, July 2026</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <MetricCard
              key={stat.label}
              label={stat.label}
              displayValue={stat.value}
              note="July 2026"
              tone="neutral"
              className="p-6"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const CTABand = () => {
  return (
    <section className="relative overflow-hidden bg-[#171717] text-white">
      <div className="mx-auto flex w-full max-w-330 flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-lg">
          <h2 className="text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
            Start tracking your money today.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Set up your ledger in minutes. No spreadsheets, no guesswork.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/auth"
            className="group ds-focus-ring ds-interactive flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-semibold text-accent-foreground no-underline hover:bg-[#c7e600]"
          >
            Get started{' '}
            <ArrowRight
              size={15}
              className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
            />
          </Link>
          <Link
            to="/auth"
            className="ds-focus-ring ds-interactive flex h-11 items-center justify-center rounded-sm border border-white/20 px-5 text-sm font-medium text-white no-underline hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex w-full max-w-330 flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link
          to="/"
          className="ds-focus-ring inline-flex items-center gap-2.5 text-foreground no-underline"
        >
          <LedgrIcon size={22} />
          <span className="text-xs font-medium text-muted-foreground">
            Ledgr, personal finance workspace
          </span>
        </Link>
        <div className="flex items-center gap-5 text-[11px] text-muted-foreground">
          <span>&copy; 2026 Ledgr</span>
          <Link
            to="/design-system"
            className="ds-focus-ring underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-foreground"
          >
            Design system
          </Link>
        </div>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <FeatureBand />
        <TransactionsStory />
        <CategoryStory />
        <StatsBand />
        <CTABand />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
