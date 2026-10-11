import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { lazy, Suspense, useEffect } from 'react'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import RouteErrorPage, { NotFoundPage } from '#/components/RouteFailurePage'
import ToastProvider from '#/components/ui/ToastProvider'
import { useHasHydrated, useIsAuthenticated } from '#/store/authStore'

const DevelopmentTools = import.meta.env.DEV
  ? lazy(() => import('#/components/DevelopmentTools'))
  : null

interface MyRouterContext {
  queryClient: QueryClient
}

const GOOGLE_CALLBACK_PATH = '/auth/google/callback'

function isGuestOnlyPath(pathname: string) {
  return pathname === '/' || (pathname.startsWith('/auth') && pathname !== GOOGLE_CALLBACK_PATH)
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Finance App',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: RouteErrorPage,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()
  const hasHydrated = useHasHydrated()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    if (hasHydrated && isAuthenticated && isGuestOnlyPath(pathname)) {
      void navigate({ to: '/dashboard', replace: true })
    }
  }, [hasHydrated, isAuthenticated, navigate, pathname])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
        {DevelopmentTools ? (
          <Suspense fallback={null}>
            <DevelopmentTools />
          </Suspense>
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
