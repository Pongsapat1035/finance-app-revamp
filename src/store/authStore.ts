import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string
  setToken: (token: string) => void
  clearToken: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: '',
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: '' }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export const useIsAuthenticated = () => {
  return useAuthStore((state) => !!state.token)
}

export default useAuthStore
