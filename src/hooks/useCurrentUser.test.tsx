// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentUser } from '#/api/user/current-user.api'
import useAuthStore from '#/store/authStore'
import { useCurrentUser } from './useCurrentUser'

vi.mock('#/api/user/current-user.api', () => ({ getCurrentUser: vi.fn() }))

const user = {
  id: 7,
  email: 'user@example.com',
  name: 'Example User',
  status: 'VERIFIED' as const,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

beforeEach(() => {
  useAuthStore.setState({ token: '', hasHydrated: true })
  vi.mocked(getCurrentUser).mockResolvedValue(user)
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  useAuthStore.setState({ token: '', hasHydrated: true })
})

describe('useCurrentUser', () => {
  it('loads /me when a token becomes available and clears visible data after sign-out', async () => {
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() })
    expect(getCurrentUser).not.toHaveBeenCalled()

    act(() => useAuthStore.getState().setToken('session-token'))
    await waitFor(() => expect(result.current.data?.email).toBe('user@example.com'))
    expect(getCurrentUser).toHaveBeenCalledOnce()

    act(() => useAuthStore.getState().clearToken())
    expect(result.current.data).toBeUndefined()
  })

  it('loads /me for a token restored on page reload', async () => {
    useAuthStore.setState({ token: 'restored-token', hasHydrated: true })
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.data?.name).toBe('Example User'))
    expect(getCurrentUser).toHaveBeenCalledOnce()
  })

  it('does not reuse one account identity for a later sign-in', async () => {
    vi.mocked(getCurrentUser)
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce({ ...user, id: 8, email: 'other@example.com' })
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() })

    act(() => useAuthStore.getState().setToken('first-token'))
    await waitFor(() => expect(result.current.data?.email).toBe('user@example.com'))

    act(() => useAuthStore.getState().setToken('second-token'))
    expect(result.current.data).toBeUndefined()
    await waitFor(() => expect(result.current.data?.email).toBe('other@example.com'))
  })
})
