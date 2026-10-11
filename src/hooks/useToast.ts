import { createContext, useContext } from 'react'
import type { ToastTone } from '#/components/ui/Toast'

export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  duration?: number
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => void
  dismissToast: () => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
