import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  Ellipsis,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Search,
  Settings,
  WalletCards,
} from 'lucide-react'

import IconButton from '#/components/ui/IconButton'
import BaseModal, {
  BaseModalContent,
  BaseModalDescription,
  BaseModalTitle,
} from '#/components/ui/BaseModal'

export type NavigationItem =
  'Overview' | 'Transactions' | 'Budgets' | 'Reports' | 'Settings' | 'Profile'

const navigation = [
  { label: 'Overview' as const, icon: LayoutDashboard, href: '/dashboard' as const },
  { label: 'Transactions' as const, icon: ReceiptText, href: '/transactions' as const },
  { label: 'Budgets' as const, icon: WalletCards, href: '/budgets' as const },
  { label: 'Reports' as const, icon: BarChart3, href: '/reports' as const },
]

export function BrandMark() {
  return (
    <span className="grid size-8 place-items-center rounded-sm bg-foreground text-xs font-bold tracking-[-0.08em] text-background">
      F/
    </span>
  )
}

function NavigationContent({
  activeItem,
  onNavigate,
}: {
  activeItem: NavigationItem
  onNavigate?: () => void
}) {
  return (
    <>
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <BrandMark />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">My finance</p>
          <p className="truncate text-[11px] text-muted-foreground">Personal workspace</p>
        </div>
      </div>

      <nav className="flex-1 p-3" aria-label="Main navigation">
        <p className="px-2 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Workspace
        </p>
        <div className="grid gap-1">
          {navigation.map(({ label, icon: Icon, href }) => {
            const active = label === activeItem

            return (
              <Link
                key={label}
                to={href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`ds-focus-ring ds-interactive flex h-10 items-center gap-3 rounded-sm px-2.5 text-[13px] no-underline ${
                  active
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                }`}
              >
                <Icon size={17} strokeWidth={1.75} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t p-3">
        <Link
          to="/settings"
          onClick={onNavigate}
          aria-current={activeItem === 'Settings' ? 'page' : undefined}
          className={`ds-focus-ring ds-interactive flex h-10 items-center gap-3 rounded-sm px-2.5 text-[13px] no-underline ${
            activeItem === 'Settings'
              ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
          }`}
        >
          <Settings size={17} strokeWidth={1.75} /> Settings
        </Link>
        <Link
          to="/profile"
          onClick={onNavigate}
          aria-current={activeItem === 'Profile' ? 'page' : undefined}
          className={`ds-focus-ring ds-interactive mt-2 flex items-center gap-3 rounded-sm px-2.5 py-3 no-underline ${
            activeItem === 'Profile'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'hover:bg-sidebar-accent'
          }`}
        >
          <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold">
            MP
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Mina Park</p>
            <p className="truncate text-[11px] text-muted-foreground">mina@example.com</p>
          </div>
          <Ellipsis size={16} className="text-muted-foreground" />
        </Link>
      </div>
    </>
  )
}

export function AppSidebar({ activeItem }: { activeItem: NavigationItem }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r bg-sidebar lg:flex">
      <NavigationContent activeItem={activeItem} />
    </aside>
  )
}

function MobileNavigation({
  activeItem,
  open,
  onOpenChange,
}: {
  activeItem: NavigationItem
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <BaseModal open={open} onOpenChange={onOpenChange}>
      <BaseModalContent className="inset-y-0 left-0 right-auto h-[100dvh] max-h-none w-[min(320px,calc(100%-48px))] rounded-none border-r sm:inset-y-0 sm:left-0 sm:right-auto sm:m-0 sm:h-[100dvh] sm:max-w-[320px] sm:rounded-none">
        <BaseModalTitle className="sr-only">Application navigation</BaseModalTitle>
        <BaseModalDescription className="sr-only">
          Navigate between finance workspace pages.
        </BaseModalDescription>
        <NavigationContent activeItem={activeItem} onNavigate={() => onOpenChange(false)} />
      </BaseModalContent>
    </BaseModal>
  )
}

export function AppTopBar({
  activeItem,
  searchLabel,
  periodLabel,
  periodClassName = 'hidden text-xs text-muted-foreground lg:block',
  periodControl,
}: {
  activeItem: NavigationItem
  searchLabel: string
  periodLabel?: string
  periodClassName?: string
  periodControl?: ReactNode
}) {
  const [navigationOpen, setNavigationOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 lg:ml-56 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <IconButton
            variant="outline"
            aria-label="Open navigation"
            aria-expanded={navigationOpen}
            onClick={() => setNavigationOpen(true)}
          >
            <Menu size={17} strokeWidth={1.75} />
          </IconButton>
          <BrandMark />
        </div>
        <div className="hidden h-9 w-full max-w-md items-center gap-2 rounded-sm border bg-muted px-3 text-xs text-muted-foreground md:flex">
          <Search size={15} strokeWidth={1.75} />
          <span>{searchLabel}</span>
          <kbd className="ml-auto rounded-sm border bg-background px-1.5 py-0.5 font-mono text-[10px]">
            ⌘ K
          </kbd>
        </div>
        <div className="flex items-center gap-3">
          {periodControl ? (
            <div className="hidden lg:block">{periodControl}</div>
          ) : (
            periodLabel && <p className={periodClassName}>{periodLabel}</p>
          )}
          <Link
            to="/profile"
            className="ds-focus-ring grid size-9 place-items-center rounded-full bg-muted text-xs font-semibold no-underline lg:hidden"
            aria-label="Open profile settings"
          >
            MP
          </Link>
        </div>
      </header>

      <MobileNavigation
        activeItem={activeItem}
        open={navigationOpen}
        onOpenChange={setNavigationOpen}
      />
    </>
  )
}

export function AppPageShell({
  activeItem,
  searchLabel,
  periodLabel,
  periodClassName,
  children,
}: {
  activeItem: NavigationItem
  searchLabel: string
  periodLabel: string
  periodClassName?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <AppSidebar activeItem={activeItem} />
      <AppTopBar
        activeItem={activeItem}
        searchLabel={searchLabel}
        periodLabel={periodLabel}
        periodClassName={periodClassName}
      />
      <main className="lg:ml-56">
        <div className="mx-auto w-full max-w-330 px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
