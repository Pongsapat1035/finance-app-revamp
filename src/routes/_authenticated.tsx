import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIsAuthenticated, useHasHydrated } from '../store/authStore'

export const Route = createFileRoute('/_authenticated')({
  component: () => <AuthenticatedLayout />,
})

export const AuthenticatedLayout = () => {
  const navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()
  const hasHydrated = useHasHydrated()

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      navigate({ to: '/auth', search: { redirect: window.location.href } })
    }
  }, [hasHydrated, isAuthenticated, navigate])

  if (!hasHydrated || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background-dark text-slate-100 font-display selection:bg-primary selection:text-white">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
