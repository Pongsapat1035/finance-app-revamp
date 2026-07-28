import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string
  hasHydrated: boolean
  setToken: (token: string) => void
  clearToken: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: '',
      hasHydrated: false,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: '' }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export const useIsAuthenticated = () => {
  return useAuthStore((state) => !!state.token)
}

export const useHasHydrated = () => {
  return useAuthStore((state) => state.hasHydrated)
}

export default useAuthStore
