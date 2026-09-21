import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  Copy,
  Ellipsis,
  Eye,
  Home,
  LayoutGrid,
  Menu,
  Pencil,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react'
import ConfirmModal from '#/components/ui/ConfirmModal'
import BaseModal, {
  BaseModalBody,
  BaseModalClose,
  BaseModalContent,
  BaseModalDescription,
  BaseModalFooter,
  BaseModalHeader,
  BaseModalTitle,
} from '#/components/ui/BaseModal'
import Checkbox from '#/components/ui/Checkbox'
import DatePickerField from '#/components/ui/DatePicker'
import EmptyState from '#/components/ui/EmptyState'
import ErrorState from '#/components/ui/ErrorState'
import InputField from '#/components/ui/InputField'
import Pagination from '#/components/ui/Pagination'
import SearchInput from '#/components/ui/SearchInput'
import Toast, { type ToastTone } from '#/components/ui/Toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/DropdownMenu'
import {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/Select'

const colors = [
  {
    name: 'Ink',
    token: '--foreground',
    value: '#161616',
    className: 'bg-[#161616]',
    inverse: true,
  },
  { name: 'Canvas', token: '--background', value: '#FFFFFF', className: 'bg-white' },
  { name: 'Soft', token: '--muted', value: '#F6F6F4', className: 'bg-[#f6f6f4]' },
  { name: 'Line', token: '--border', value: '#DEDEDB', className: 'bg-[#dededb]' },
  { name: 'Signal', token: '--accent', value: '#D7F500', className: 'bg-[#d7f500]' },
  {
    name: 'Success',
    token: '--success',
    value: '#00B852',
    className: 'bg-[#00b852]',
    inverse: true,
  },
  {
    name: 'Warning',
    token: '--warning',
    value: '#F5A000',
    className: 'bg-[#f5a000]',
    inverse: true,
  },
  {
    name: 'Danger',
    token: '--destructive',
    value: '#F04438',
    className: 'bg-[#f04438]',
    inverse: true,
  },
]

const chartColors = [
  { name: 'Blue', token: '--chart-blue', value: '#3B82F6', className: 'bg-[#3b82f6]' },
  { name: 'Green', token: '--chart-green', value: '#00B852', className: 'bg-[#00b852]' },
  { name: 'Berry', token: '--chart-plum', value: '#C2467D', className: 'bg-[#c2467d]' },
  { name: 'Amber', token: '--chart-amber', value: '#F5A000', className: 'bg-[#f5a000]' },
  {
    name: 'Neutral',
    token: '--chart-neutral',
    value: '#858581',
    className: 'bg-[#858581]',
  },
]

const spacing = [4, 8, 12, 16, 24, 32, 48, 64]

const periodOptions = [
  { value: '30d', label: 'Last 30 days' },
  { value: 'quarter', label: 'Last quarter' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'custom', label: 'Custom range', disabled: true },
]

const currencyOptions = [
  { value: 'usd', label: 'US dollar' },
  { value: 'eur', label: 'EUR - Euro' },
  { value: 'thb', label: 'THB - Thai baht' },
]

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <h2 className="text-[28px] font-medium tracking-[-0.035em] text-foreground sm:text-[34px]">
        {title}
      </h2>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function Swatch({ name, token, value, className, inverse = false }: (typeof colors)[number]) {
  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      <div className={`h-28 border-b ${className}`} aria-label={`${name}, ${value}`} />
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-sm font-medium">{name}</h3>
          <code className="mt-1 block font-mono text-[11px] text-muted-foreground">{token}</code>
        </div>
        <span
          className={`rounded-sm px-1.5 py-1 font-mono text-[10px] ${
            inverse ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
          }`}
        >
          {value}
        </span>
      </div>
    </article>
  )
}

function ConfirmDialogDemo() {
  const [openDialog, setOpenDialog] = useState<'default' | 'destructive' | 'loading' | null>(null)
  const [pending, setPending] = useState(false)

  const startPending = () => {
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      setOpenDialog(null)
    }, 1600)
  }

  return (
    <article id="confirm-dialog" className="rounded-lg border p-5 sm:p-7 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Confirm dialog</h3>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground">
            Reserved for actions that are hard to undo or move money. The title states the action,
            the body states the consequence, and the confirm button repeats the verb.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/ConfirmModal
        </code>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setOpenDialog('default')}
          className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#30302f]"
        >
          Send payment
        </button>
        <button
          onClick={() => setOpenDialog('destructive')}
          className="ds-focus-ring ds-interactive inline-flex h-10 items-center gap-2 rounded-sm border bg-background px-4 text-sm font-medium text-destructive-text hover:bg-destructive/10"
        >
          <Trash2 size={15} strokeWidth={1.75} />
          Delete transaction
        </button>
        <button
          onClick={() => setOpenDialog('loading')}
          className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm border bg-background px-4 text-sm font-medium hover:bg-muted"
        >
          Close period, with pending state
        </button>
      </div>

      <ul className="mt-6 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <li>Focus moves into the dialog and returns to the trigger on dismissal.</li>
        <li>Escape and outside click cancel, except while work is in flight.</li>
        <li>Cancel sits first in the DOM and last visually on desktop.</li>
        <li>Never use it for reversible actions. Use an inline undo instead.</li>
      </ul>

      <ConfirmModal
        open={openDialog === 'default'}
        onOpenChange={(open) => setOpenDialog(open ? 'default' : null)}
        title="Send this payment?"
        description="The transfer leaves the operating account today and cannot be recalled after it settles."
        details={
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Green Market, example data</span>
            <span className="font-mono font-medium tabular-nums">2,418.63</span>
          </div>
        }
        confirmLabel="Send payment"
        onConfirm={() => setOpenDialog(null)}
      />

      <ConfirmModal
        open={openDialog === 'destructive'}
        onOpenChange={(open) => setOpenDialog(open ? 'destructive' : null)}
        tone="destructive"
        title="Delete this transaction?"
        description="The transaction, its receipt, and its category are removed from the July period. This cannot be undone."
        confirmLabel="Delete transaction"
        cancelLabel="Keep transaction"
        onConfirm={() => setOpenDialog(null)}
      />

      <ConfirmModal
        open={openDialog === 'loading'}
        onOpenChange={(open) => setOpenDialog(open ? 'loading' : null)}
        title="Close the July period?"
        description="Closing locks 59 transactions. Reopening the period requires an admin."
        confirmLabel="Close period"
        loading={pending}
        onConfirm={startPending}
      />
    </article>
  )
}

function BaseModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <article className="rounded-lg border p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Modal layout</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Keep the header and actions fixed; only the body scrolls when its content is long.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/BaseModal
        </code>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ds-focus-ring ds-interactive mt-6 inline-flex h-10 items-center justify-center rounded-sm border bg-background px-4 text-sm font-medium hover:bg-muted"
      >
        Open long form
      </button>

      <BaseModal open={open} onOpenChange={setOpen}>
        <BaseModalContent showCloseButton={false} scrollable={false} className="sm:max-w-md">
          <BaseModalHeader>
            <BaseModalTitle className="text-lg font-medium tracking-[-0.02em]">
              Review imported entries
            </BaseModalTitle>
            <BaseModalDescription className="mt-1 text-xs leading-5 text-muted-foreground">
              The header and footer remain visible while the list scrolls.
            </BaseModalDescription>
          </BaseModalHeader>
          <BaseModalBody className="grid max-h-52 gap-3">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="rounded-sm border bg-muted px-3 py-2.5 text-sm">
                Imported transaction {index + 1}
              </div>
            ))}
          </BaseModalBody>
          <BaseModalFooter>
            <div className="flex justify-end gap-2">
              <BaseModalClose asChild>
                <button className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm border bg-background px-4 text-sm font-medium hover:bg-muted">
                  Cancel
                </button>
              </BaseModalClose>
              <button className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]">
                Continue
              </button>
            </div>
          </BaseModalFooter>
        </BaseModalContent>
      </BaseModal>
    </article>
  )
}

function DatePickerDemo() {
  const [date, setDate] = useState('2026-09-16')
  const [month, setMonth] = useState('2026-09')

  return (
    <article id="date-picker" className="rounded-lg border p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Date picker</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Use for an exact date when a calendar is quicker and clearer than manual entry.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/DatePicker
        </code>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <DatePickerField
          id="statement-date"
          label="Statement date"
          value={date}
          onValueChange={setDate}
          helperText="Uses your workspace timezone."
        />
        <DatePickerField
          id="statement-month"
          label="Statement month"
          mode="month"
          value={month}
          onValueChange={setMonth}
          helperText="Returns a month in YYYY-MM format."
        />
        <DatePickerField
          id="close-date"
          label="Close date"
          value=""
          onValueChange={() => undefined}
          error="Select a close date to continue."
        />
      </div>
    </article>
  )
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(true)

  return (
    <article className="rounded-lg border p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Checkbox</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Use for an independent boolean setting with a clear label and consequence.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/Checkbox
        </code>
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-md border bg-muted px-4 py-3.5">
        <Checkbox
          id="email-summary"
          checked={checked}
          onCheckedChange={(nextChecked) => setChecked(nextChecked === true)}
          className="mt-0.5"
        />
        <div>
          <label htmlFor="email-summary" className="text-sm font-medium">
            Send monthly summary
          </label>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            Receive a spending and cash-flow summary at the start of each month.
          </p>
        </div>
      </div>
    </article>
  )
}

function SearchInputDemo() {
  const [query, setQuery] = useState('')

  return (
    <article className="rounded-lg border p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Search input</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            A controlled dense field for table filters. It returns the query without owning search
            results.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/SearchInput
        </code>
      </div>
      <SearchInput
        className="mt-6"
        value={query}
        onValueChange={setQuery}
        ariaLabel="Search transactions"
        placeholder="Search name or category"
      />
    </article>
  )
}

function ToastDemo() {
  const [toast, setToast] = useState<{
    id: number
    tone: ToastTone
    title: string
    description: string
  } | null>(null)

  const showToast = (tone: ToastTone) => {
    setToast({
      id: Date.now(),
      tone,
      title: tone === 'success' ? 'Transaction updated' : 'Could not update transaction',
      description:
        tone === 'success'
          ? 'Your changes are reflected in the activity list.'
          : 'Check your connection and try again.',
    })
  }

  return (
    <article className="rounded-lg border p-5 sm:p-7 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Toast</h3>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground">
            Brief confirmation after completed work. Recoverable failures stay inline with the
            action that caused them.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/Toast
        </code>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => showToast('success')}
          className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#30302f]"
        >
          Show success toast
        </button>
        <button
          type="button"
          onClick={() => showToast('error')}
          className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm border bg-background px-4 text-sm font-medium text-destructive-text hover:bg-destructive/10"
        >
          Show error toast
        </button>
      </div>
      {toast && (
        <Toast
          key={toast.id}
          tone={toast.tone}
          title={toast.title}
          description={toast.description}
          duration={0}
          onClose={() => setToast(null)}
        />
      )}
    </article>
  )
}

const PaginationDemo = () => {
  const [page, setPage] = useState(2)

  return (
    <article className="rounded-lg border p-5 sm:p-7 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Pagination</h3>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground">
            Table and collection footer navigation with range summary, icon buttons, and page
            indicator.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/Pagination
        </code>
      </div>
      <div className="mt-6 overflow-hidden rounded-md border bg-background">
        <Pagination
          page={page}
          totalPages={5}
          total={48}
          pageSize={10}
          itemName="transactions"
          onPageChange={setPage}
        />
      </div>
    </article>
  )
}

const EmptyAndErrorStateDemo = () => {
  return (
    <article className="rounded-lg border p-5 sm:p-7 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Empty & Error States</h3>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground">
            Clear, calm states for empty datasets and recoverable service errors. Data tables own
            action markup while pages provide action configuration and callbacks.
          </p>
        </div>
        <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
          ui/EmptyState · ui/ErrorState
        </code>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-md border bg-background">
          <EmptyState
            icon={<Search size={19} strokeWidth={1.75} />}
            title="No transactions yet"
            description="Add your first income or expense to start tracking money activity."
            action={
              <button
                type="button"
                className="ds-focus-ring ds-interactive inline-flex h-9 items-center justify-center rounded-sm bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-[#30302f]"
              >
                Add transaction
              </button>
            }
          />
        </div>
        <div className="overflow-hidden rounded-md border bg-background">
          <ErrorState
            title="Could not load data"
            description="Check your connection and try again."
            onRetry={() => {}}
          />
        </div>
      </div>
    </article>
  )
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="ds-focus-ring ds-interactive grid size-8 place-items-center rounded-sm bg-foreground text-background"
              aria-label="Home"
            >
              <span className="text-sm font-bold tracking-[-0.08em]">F/</span>
            </Link>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <span className="text-sm font-medium">Design system</span>
            <span className="hidden rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              1.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-sm border bg-muted px-3 py-2 text-xs text-muted-foreground md:flex">
              <Search size={14} strokeWidth={1.75} />
              Search tokens
              <kbd className="ml-6 rounded-sm border bg-white px-1.5 py-0.5 font-mono text-[10px]">
                ⌘ K
              </kbd>
            </div>
            <a
              href="#components"
              className="ds-focus-ring ds-interactive inline-flex h-9 items-center gap-2 rounded-sm bg-accent px-3.5 text-xs font-semibold text-accent-foreground no-underline hover:bg-[#c7e600]"
            >
              View components <ArrowRight size={14} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="hidden border-r bg-sidebar lg:block">
          <nav
            className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col p-4"
            aria-label="Design system sections"
          >
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Foundations
            </p>
            {['Principles', 'Color', 'Typography', 'Spacing', 'Radius'].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`ds-focus-ring ds-interactive flex h-9 items-center rounded-sm px-2 text-[13px] no-underline ${
                  index === 0
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                }`}
              >
                {item}
              </a>
            ))}
            <p className="mt-7 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Interface
            </p>
            {['Components', 'Data display', 'Patterns', 'Accessibility'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="ds-focus-ring ds-interactive flex h-9 items-center rounded-sm px-2 text-[13px] text-muted-foreground no-underline hover:bg-sidebar-accent hover:text-foreground"
              >
                {item}
              </a>
            ))}
            <div className="mt-auto border-t px-2 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Source of truth
              </p>
              <code className="mt-2 block font-mono text-[11px] text-foreground">design.md</code>
            </div>
          </nav>
        </aside>

        <main className="min-w-0">
          <section
            id="principles"
            className="ds-grid border-b px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
          >
            <div className="max-w-4xl">
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold">
                <Sparkles size={14} strokeWidth={1.75} /> Finance product language
              </p>
              <h1 className="max-w-3xl text-[46px] font-medium leading-[0.98] tracking-[-0.055em] sm:text-[64px] lg:text-[76px]">
                Clarity is the interface.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                A precise, high-trust system for money movement, reporting, and daily financial
                operations.
              </p>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
              {[
                [
                  '01',
                  'Make money legible',
                  'Numbers lead. Labels explain. Decoration stays quiet.',
                ],
                [
                  '02',
                  'Use density with intent',
                  'Product views are compact. Marketing surfaces get more air.',
                ],
                [
                  '03',
                  'Reserve the signal',
                  'Chartreuse marks the primary action, never ambient decoration.',
                ],
              ].map(([number, title, description]) => (
                <article key={number} className="bg-white p-6 sm:min-h-44">
                  <span className="font-mono text-[11px] text-muted-foreground">{number}</span>
                  <h2 className="mt-9 text-lg font-medium tracking-[-0.02em]">{title}</h2>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="color" className="border-b px-4 py-16 sm:px-8 lg:px-12 lg:py-20">
            <SectionHeading
              title="Color"
              description="Neutral by default, semantic when necessary, fluorescent only for the most important action."
            />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {colors.map((color) => (
                <Swatch key={color.token} {...color} />
              ))}
            </div>
            <article className="mt-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-medium">Chart palette</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use these colors for categories and comparison series, not status meaning.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {chartColors.map((color) => (
                    <div
                      key={color.token}
                      className="flex items-center gap-2 rounded-sm border bg-background px-2 py-1.5"
                    >
                      <span className={`size-3 rounded-[1px] ${color.className}`} />
                      <span className="text-[11px] font-medium">{color.name}</span>
                      <code className="font-mono text-[10px] text-muted-foreground">
                        {color.value}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            <div className="mt-8 grid overflow-hidden rounded-lg border lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[#161616] p-7 text-white sm:p-9">
                <p className="text-xs text-white/60">Dark utility surface</p>
                <p className="mt-8 max-w-md text-2xl font-medium tracking-[-0.035em]">
                  Use near-black for high contrast moments and dense utility regions.
                </p>
                <button className="ds-focus-ring ds-interactive mt-8 inline-flex h-10 items-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]">
                  Primary action <ArrowRight size={15} />
                </button>
              </div>
              <div className="ds-checker p-7 sm:p-9">
                <div className="rounded-lg border bg-white p-5 shadow-[0_8px_30px_rgb(22_22_22/0.08)]">
                  <p className="text-xs text-muted-foreground">Semantic pairing</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-sm bg-success-soft px-2 py-1.5 text-xs font-medium text-success-text">
                      <CircleCheck size={14} /> Approved
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-sm bg-warning-soft px-2 py-1.5 text-xs font-medium text-warning-text">
                      <CircleAlert size={14} /> Review needed
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-sm bg-info-soft px-2 py-1.5 text-xs font-medium text-info">
                      <Sparkles size={14} /> Automated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="typography" className="border-b px-4 py-16 sm:px-8 lg:px-12 lg:py-20">
            <SectionHeading
              title="Typography"
              description="A neutral grotesk stack keeps labels compact and numbers direct. Weight and scale create hierarchy."
            />
            <div className="overflow-hidden rounded-lg border">
              {[
                ['Display', '64 / 64', '500', 'Finance, made clear.'],
                ['Heading 1', '40 / 44', '500', 'Monthly reporting'],
                ['Heading 2', '28 / 34', '500', 'Cash and treasury'],
                [
                  'Body',
                  '15 / 24',
                  '400',
                  'Review spending, approvals, and account activity in one place.',
                ],
                ['Label', '12 / 16', '600', 'AVAILABLE BALANCE'],
                ['Data', '24 / 30', '500', '48,820.14'],
              ].map(([name, size, weight, sample], index) => (
                <div
                  key={name}
                  className="grid gap-4 border-b p-5 last:border-b-0 md:grid-cols-[120px_88px_64px_minmax(0,1fr)] md:items-baseline"
                >
                  <span className="text-xs font-medium">{name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{size}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{weight}</span>
                  <span
                    className={
                      index === 0
                        ? 'text-[42px] font-medium leading-none tracking-[-0.05em] sm:text-[54px]'
                        : index === 1
                          ? 'text-[34px] font-medium leading-tight tracking-[-0.04em]'
                          : index === 2
                            ? 'text-[26px] font-medium leading-tight tracking-[-0.03em]'
                            : index === 4
                              ? 'text-xs font-semibold tracking-[0.08em]'
                              : index === 5
                                ? 'font-mono text-2xl font-medium tracking-[-0.03em]'
                                : 'text-[15px] leading-6'
                    }
                  >
                    {sample}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="spacing" className="border-b px-4 py-16 sm:px-8 lg:px-12 lg:py-20">
            <SectionHeading
              title="Spacing and shape"
              description="A 4px base unit supports compact controls and predictable product rhythm."
            />
            <div className="grid gap-8 xl:grid-cols-2">
              <div className="rounded-lg border p-5 sm:p-7">
                <h3 className="text-sm font-medium">Spacing scale</h3>
                <div className="mt-7 space-y-4">
                  {spacing.map((value) => (
                    <div key={value} className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
                      <code className="font-mono text-[11px] text-muted-foreground">
                        {value / 4}
                      </code>
                      <div
                        className="h-2 rounded-[1px] bg-accent"
                        style={{ width: `${Math.max(value * 2, 12)}px` }}
                      />
                      <span className="text-right font-mono text-[11px] text-muted-foreground">
                        {value}px
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div id="radius" className="rounded-lg border p-5 sm:p-7">
                <h3 className="text-sm font-medium">Radius rules</h3>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  {[
                    ['Control', '4px', 'rounded-sm'],
                    ['Default', '6px', 'rounded-md'],
                    ['Panel', '8px', 'rounded-lg'],
                    ['Badge only', '999px', 'rounded-full'],
                  ].map(([name, value, radius]) => (
                    <div
                      key={name}
                      className={`grid aspect-[1.35] place-content-center border-2 border-foreground ${radius}`}
                    >
                      <span className="text-center text-xs font-medium">{name}</span>
                      <span className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="components" className="border-b px-4 py-16 sm:px-8 lg:px-12 lg:py-20">
            <SectionHeading
              title="Components"
              description="Built on shadcn conventions, then tightened for finance workflows and strong keyboard access."
            />
            <div className="grid gap-5 xl:grid-cols-2">
              <article className="rounded-lg border p-5 sm:p-7">
                <h3 className="text-sm font-medium">Buttons</h3>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-[#c7e600]">
                    Save changes <Check size={15} strokeWidth={2} />
                  </button>
                  <button className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#30302f]">
                    Create report
                  </button>
                  <button className="ds-focus-ring ds-interactive inline-flex h-10 items-center justify-center rounded-sm border bg-background px-4 text-sm font-medium hover:bg-muted">
                    Cancel
                  </button>
                  <button
                    className="ds-focus-ring ds-interactive inline-flex size-10 items-center justify-center rounded-sm border bg-background hover:bg-muted"
                    aria-label="Copy"
                  >
                    <Copy size={16} strokeWidth={1.75} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="ds-focus-ring ds-interactive inline-flex size-10 items-center justify-center rounded-sm border bg-background text-muted-foreground hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
                        aria-label="Example row actions"
                      >
                        <Ellipsis size={16} strokeWidth={1.75} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Green Market</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye size={15} strokeWidth={1.75} />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil size={15} strokeWidth={1.75} />
                        Edit transaction
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive-text data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive-text">
                        <Trash2 size={15} strokeWidth={1.75} />
                        Delete transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </article>

              <article className="rounded-lg border p-5 sm:p-7">
                <h3 className="text-sm font-medium">Fields</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <InputField
                    id="report-name"
                    label="Report name"
                    placeholder="Monthly finance review"
                    helperText="Visible to report collaborators."
                  />
                  <SelectField
                    label="Period"
                    options={periodOptions}
                    defaultValue="30d"
                    helperText="Uses your workspace timezone."
                  />
                </div>
              </article>

              <article id="select" className="rounded-lg border p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium">Select</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      One choice from a known list. Use a dropdown menu for actions, not values.
                    </p>
                  </div>
                  <code className="rounded-sm bg-muted px-1.5 py-1 font-mono text-[10px] text-muted-foreground">
                    ui/Select
                  </code>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Account"
                    options={[
                      { value: 'operating', label: 'Operating account' },
                      { value: 'payroll', label: 'Payroll account' },
                      { value: 'reserve', label: 'Reserve account' },
                    ]}
                    placeholder="Select an account"
                    helperText="Funds move from this account."
                  />
                  <SelectField
                    label="Currency"
                    options={currencyOptions}
                    placeholder="Select a currency"
                    error="Select a currency to continue."
                  />
                  <SelectField
                    label="Owner"
                    options={[{ value: 'mina', label: 'Mina Park' }]}
                    defaultValue="mina"
                    disabled
                    helperText="Locked by workspace policy."
                  />
                  <SelectField
                    label="Category"
                    options={[
                      { value: 'all', label: 'All categories' },
                      { value: 'books', label: 'Books' },
                      { value: 'dining', label: 'Dining' },
                      { value: 'groceries', label: 'Groceries' },
                      { value: 'health', label: 'Health' },
                      { value: 'housing', label: 'Housing' },
                      { value: 'shopping', label: 'Shopping' },
                      { value: 'subscriptions', label: 'Subscriptions' },
                      { value: 'transport', label: 'Transport' },
                      { value: 'travel', label: 'Travel' },
                    ]}
                    placeholder="Select a category"
                    helperText="Search becomes available with more than 9 options."
                  />
                  <div className="grid gap-2">
                    <span className="text-[13px] font-medium">Dense filter, grouped</span>
                    <Select defaultValue="approved">
                      <SelectTrigger size="dense" aria-label="Status filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Resolved</SelectLabel>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Open</SelectLabel>
                          <SelectItem value="review">Needs review</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span className="text-[12px] text-muted-foreground">
                      36px height for table filter bars.
                    </span>
                  </div>
                </div>
              </article>

              <DatePickerDemo />

              <CheckboxDemo />

              <SearchInputDemo />

              <BaseModalDemo />

              <ConfirmDialogDemo />

              <ToastDemo />

              <PaginationDemo />

              <EmptyAndErrorStateDemo />

              <article className="rounded-lg border p-5 sm:p-7 xl:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Navigation shell</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Compact, stable, and task oriented.
                    </p>
                  </div>
                  <span className="rounded-full bg-accent px-2 py-1 text-[11px] font-semibold">
                    59
                  </span>
                </div>
                <div className="mt-6 overflow-hidden rounded-lg border bg-[#f4f4f2]">
                  <div className="flex h-12 items-center justify-between border-b bg-white px-3 sm:px-4">
                    <div className="flex items-center gap-3">
                      <Menu size={17} strokeWidth={1.75} />
                      <span className="text-sm font-medium">Workspace</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Search size={16} />
                      <Settings2 size={16} />
                    </div>
                  </div>
                  <div className="grid min-h-52 sm:grid-cols-[176px_1fr]">
                    <div className="hidden border-r p-2 sm:block">
                      {[
                        [Home, 'Overview'],
                        [LayoutGrid, 'Reports'],
                        [Settings2, 'Settings'],
                      ].map(([Icon, label], index) => (
                        <div
                          key={label as string}
                          className={`flex h-9 items-center gap-2 rounded-sm px-2 text-xs ${index === 0 ? 'bg-[#e5e5e2] font-medium' : 'text-muted-foreground'}`}
                        >
                          <Icon size={15} strokeWidth={1.75} /> {label as string}
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-5 sm:p-7">
                      <p className="text-xs text-muted-foreground">Available balance</p>
                      <div className="mt-2 flex items-end justify-between gap-4">
                        <p className="font-mono text-3xl font-medium tracking-[-0.04em]">
                          48,820.14
                        </p>
                        <span className="text-xs font-medium text-success-text">+8.4%</span>
                      </div>
                      <div
                        className="mt-8 flex h-16 items-end gap-1"
                        aria-label="Sample balance bars"
                      >
                        {[36, 46, 42, 56, 52, 68, 63, 78, 74, 92, 88, 100].map((height, index) => (
                          <div
                            key={`${height}-${index}`}
                            className="min-w-1 flex-1 rounded-[1px] bg-chart-blue"
                            style={{ height: `${height}%`, opacity: 0.45 + index * 0.04 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section id="data-display" className="border-b px-4 py-16 sm:px-8 lg:px-12 lg:py-20">
            <SectionHeading
              title="Data display"
              description="Align numbers, expose units, and let chart color communicate categories rather than decoration."
            />
            <div className="overflow-hidden rounded-lg border">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted px-4 py-3">
                <div>
                  <h3 className="text-sm font-medium">Recent activity</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Example values for component demonstration.
                  </p>
                </div>
                <button className="ds-focus-ring ds-interactive rounded-sm border bg-white px-3 py-2 text-xs font-medium hover:bg-muted">
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="border-b text-[11px] font-medium text-muted-foreground">
                      <th className="px-4 py-3">Merchant</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      ['Figma', 'Mina Park', 'Approved', 'Jul 12, 2026', '144.00'],
                      ['AWS', 'Eli Navarro', 'Review', 'Jul 11, 2026', '2,418.63'],
                      ['Notion', 'Sora Kim', 'Approved', 'Jul 10, 2026', '80.00'],
                    ].map(([merchant, owner, status, date, amount]) => (
                      <tr key={merchant} className="border-b last:border-b-0 hover:bg-muted/70">
                        <td className="px-4 py-3.5 font-medium">{merchant}</td>
                        <td className="px-4 py-3.5 text-muted-foreground">{owner}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-sm px-2 py-1 text-[11px] font-medium ${
                              status === 'Approved'
                                ? 'bg-success-soft text-success-text'
                                : 'bg-warning-soft text-warning-text'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">{date}</td>
                        <td className="px-4 py-3.5 text-right font-mono text-[13px] tabular-nums">
                          {amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="patterns" className="border-b px-4 py-16 sm:px-8 lg:px-12 lg:py-20">
            <SectionHeading
              title="Patterns"
              description="Common product states should feel calm, specific, and immediately actionable."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border p-6">
                <div className="grid size-9 place-items-center rounded-sm bg-success-soft text-success-text">
                  <CircleCheck size={18} />
                </div>
                <h3 className="mt-5 text-base font-medium">Everything is reconciled</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">
                  All transactions have a category, owner, and receipt.
                </p>
              </article>
              <article className="rounded-lg border p-6">
                <div className="grid size-9 place-items-center rounded-sm bg-warning-soft text-warning-text">
                  <CircleAlert size={18} />
                </div>
                <h3 className="mt-5 text-base font-medium">3 items need review</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">
                  Resolve missing receipts before closing the period.
                </p>
                <button className="ds-focus-ring mt-5 text-sm font-medium underline decoration-1 underline-offset-4">
                  Review items
                </button>
              </article>
            </div>
          </section>

          <section
            id="accessibility"
            className="bg-[#161616] px-4 py-16 text-white sm:px-8 lg:px-12 lg:py-20"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <h2 className="text-[34px] font-medium tracking-[-0.04em] sm:text-[42px]">
                  Accessible by default.
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-6 text-white/65">
                  Finance interfaces carry real consequences. Contrast, keyboard operation, and
                  plain status language are product requirements.
                </p>
              </div>
              <div className="grid gap-px overflow-hidden rounded-lg bg-white/15 sm:grid-cols-2">
                {[
                  ['4.5:1', 'Minimum text contrast'],
                  ['44px', 'Preferred touch target'],
                  ['2px', 'Visible focus ring'],
                  ['0', 'Color-only status cues'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-[#202020] p-5">
                    <p className="font-mono text-xl font-medium text-accent">{value}</p>
                    <p className="mt-2 text-xs text-white/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
