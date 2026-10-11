import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from '#/api/user/current-user.api'
import useAuthStore from '#/store/authStore'

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  return useQuery({
    queryKey: ['current-user', token],
    queryFn: getCurrentUser,
    enabled: hasHydrated && Boolean(token),
    retry: false,
    staleTime: 60_000,
  })
}
