import { Link } from '@tanstack/react-router'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import GridOverlay from '#/components/GridOverlay'
import LedgrIcon from '#/components/icons/LedgrIcon'
import { formatCurrency as currency } from '#/lib/format'

const heroTransactions = [
  { name: 'Green Market', category: 'Groceries', date: 'Jul 12', amount: -82.4 },
  { name: 'Monthly salary', category: 'Salary', date: 'Jul 10', amount: 3500 },
  { name: 'City apartment', category: 'Housing', date: 'Jul 8', amount: -1250 },
  { name: 'Spotify', category: 'Subscriptions', date: 'Jul 7', amount: -11.99 },
]

const categoryBreakdown = [
  { name: 'Housing', percent: 55.9, amount: 760, color: 'var(--chart-plum)' },
  { name: 'Groceries', percent: 17.8, amount: 241.4, color: 'var(--chart-blue)' },
  { name: 'Dining', percent: 10.4, amount: 142, color: 'var(--chart-green)' },
  { name: 'Transport', percent: 8.7, amount: 118.6, color: 'var(--warning)' },
  { name: 'Other', percent: 7.2, amount: 96.99, color: '#9b9b97' },
]

const stats = [
  { label: 'Savings rate', value: '67.3%' },
  { label: 'Transactions tracked', value: '24' },
  { label: 'Average daily spend', value: currency(43.84) },
  { label: 'Categories organized', value: '5' },
]

const Nav = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-330 items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        <Link to="/" className="ds-focus-ring inline-flex items-center gap-2.5 text-foreground no-underline">
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
    <div className="overflow-hidden rounded-lg border bg-background shadow-[0_24px_70px_rgb(22_22_22/0.1)]">
      <div className="flex items-center justify-between border-b bg-muted px-5 py-4">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">EXAMPLE MONTH</p>
          <p className="mt-1 text-sm font-medium">July 2026 overview</p>
        </div>
        <span className="rounded-full bg-success-soft px-2 py-1 text-[10px] font-semibold text-success">On track</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        <div className="bg-background p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp size={14} strokeWidth={1.75} />
            <span className="text-[11px]">Income</span>
          </div>
          <p className="mt-4 font-mono text-[22px] font-medium tracking-[-0.04em]">{currency(4150)}</p>
        </div>
        <div className="bg-background p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingDown size={14} strokeWidth={1.75} />
            <span className="text-[11px]">Expenses</span>
          </div>
          <p className="mt-4 font-mono text-[22px] font-medium tracking-[-0.04em]">{currency(1358.99)}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] text-muted-foreground">Available after expenses</p>
            <p className="mt-2 font-mono text-[28px] font-medium tracking-[-0.045em]">{currency(2791.01)}</p>
          </div>
          <div className="flex h-14 w-32 items-end gap-1" aria-label="Example daily spending trend, low to high">
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
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles size={14} strokeWidth={1.75} className="text-accent" />
            Personal finance, clearly organized
          </p>
          <h1 className="mt-5 text-[40px] font-medium leading-[0.98] tracking-[-0.05em] sm:text-[52px] xl:text-[64px]">
            Know where your money goes.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Ledgr brings your income, expenses, and savings into one clear picture, so
            decisions take seconds, not spreadsheets.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              className="ds-focus-ring ds-interactive flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-semibold text-accent-foreground no-underline hover:bg-[#c7e600]"
            >
              Get started <ArrowRight size={15} />
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
    title: 'Categorized automatically',
    description: 'Every transaction is sorted into a category the moment it lands, no manual tagging.',
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
            Every transaction, organized automatically.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Income and expenses land in one ledger with categories already applied. Review
            recent activity or add a transaction by hand in seconds.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="border-b bg-muted px-5 py-3">
            <p className="text-[11px] font-medium text-muted-foreground">EXAMPLE TRANSACTIONS</p>
          </div>
          <div className="divide-y">
            {heroTransactions.map((transaction) => {
              const income = transaction.amount > 0
              return (
                <div key={`${transaction.name}-${transaction.date}`} className="flex items-center gap-3 px-5 py-3.5">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-sm ${income ? 'bg-success-soft text-success' : 'bg-muted text-foreground'}`}>
                    {income ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{transaction.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{transaction.category}, {transaction.date}</p>
                  </div>
                  <p className={`shrink-0 font-mono text-xs font-medium tabular-nums ${income ? 'text-success' : ''}`}>
                    {income ? '+' : '-'}{currency(Math.abs(transaction.amount))}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const CategoryStory = () => {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-full max-w-330 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-lg border bg-background p-5 lg:order-1">
          <p className="text-[11px] font-medium text-muted-foreground">EXAMPLE SPENDING, JULY 2026</p>
          <div className="mt-4 flex h-3 overflow-hidden rounded-[2px]" aria-label="Stacked spending distribution by category">
            {categoryBreakdown.map((category) => (
              <span key={category.name} style={{ width: `${category.percent}%`, backgroundColor: category.color }} title={`${category.name} ${category.percent}%`} />
            ))}
          </div>
          <div className="mt-5 divide-y">
            {categoryBreakdown.map((category) => (
              <div key={category.name} className="grid grid-cols-[4px_1fr_auto] items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="h-6 rounded-[1px]" style={{ backgroundColor: category.color }} aria-hidden="true" />
                <p className="truncate text-sm font-medium">{category.name}</p>
                <p className="font-mono text-xs font-medium tabular-nums text-muted-foreground">{currency(category.amount)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-md lg:order-2">
          <p className="text-xs font-medium text-muted-foreground">Spending insight</p>
          <h2 className="mt-3 text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px]">
            See exactly where it goes.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Category breakdowns update as you spend, so you can catch a drifting budget
            before the month closes, not after.
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
            <div key={stat.label} className="bg-background p-6">
              <p className="font-mono text-[28px] font-medium tracking-[-0.04em]">{stat.value}</p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
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
            className="ds-focus-ring ds-interactive flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-semibold text-accent-foreground no-underline hover:bg-[#c7e600]"
          >
            Get started <ArrowRight size={15} />
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
        <Link to="/" className="ds-focus-ring inline-flex items-center gap-2.5 text-foreground no-underline">
          <LedgrIcon size={22} />
          <span className="text-xs font-medium text-muted-foreground">Ledgr, personal finance workspace</span>
        </Link>
        <div className="flex items-center gap-5 text-[11px] text-muted-foreground">
          <span>&copy; 2026 Ledgr</span>
          <Link to="/design-system" className="ds-focus-ring underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-foreground">
            Design system
          </Link>
        </div>
      </div>
    </footer>
  )
}

const HomePage = () => {
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
