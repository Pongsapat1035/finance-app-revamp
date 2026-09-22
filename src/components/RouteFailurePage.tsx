import { ArrowLeft, CircleAlert, House } from 'lucide-react'

import type { ErrorComponentProps, NotFoundRouteProps } from '@tanstack/react-router'
import Button from '#/components/ui/Button'

function RecoveryLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="/"
      className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-input bg-background px-4 text-sm font-medium text-foreground no-underline hover:bg-muted"
    >
      {children}
    </a>
  )
}

function FailureLayout({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-background px-4 py-8 sm:px-6">
      <section
        className="w-full max-w-lg border bg-card p-6 sm:p-8"
        aria-labelledby="failure-title"
      >
        <span className="grid size-11 place-items-center rounded-sm bg-destructive/10 text-destructive-text">
          <CircleAlert size={21} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1
          id="failure-title"
          className="mt-2 text-[28px] font-medium tracking-[-0.03em] sm:text-[34px]"
        >
          {title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">{children}</div>
      </section>
    </main>
  )
}

export default function RouteErrorPage({ reset }: ErrorComponentProps) {
  return (
    <FailureLayout
      eyebrow="Something went wrong"
      title="We could not open this page"
      description="Your financial data is still safe. Try loading this page again, or return to the overview."
    >
      <Button type="button" fullWidth={false} onClick={reset} prefixIcon={<ArrowLeft size={16} />}>
        Try again
      </Button>
      <RecoveryLink>
        <House size={16} strokeWidth={1.75} aria-hidden="true" />
        Go to overview
      </RecoveryLink>
    </FailureLayout>
  )
}

export function NotFoundPage(_: NotFoundRouteProps) {
  return (
    <FailureLayout
      eyebrow="Page not found"
      title="This page does not exist"
      description="Check the address, or return to the overview to continue managing your finances."
    >
      <RecoveryLink>
        <House size={16} strokeWidth={1.75} aria-hidden="true" />
        Go to overview
      </RecoveryLink>
    </FailureLayout>
  )
}
