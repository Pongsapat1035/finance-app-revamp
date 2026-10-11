import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import Toast from '#/components/ui/Toast'
import { ToastContext, type ToastOptions } from '#/hooks/useToast'

interface ActiveToast extends ToastOptions {
  id: number
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ActiveToast | null>(null)
  const nextId = useRef(0)

  const showToast = useCallback((options: ToastOptions) => {
    nextId.current += 1
    setToast({ ...options, id: nextId.current })
  }, [])
  const dismissToast = useCallback(() => setToast(null), [])
  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          tone={toast.tone}
          duration={toast.duration}
          onClose={() => setToast((current) => (current?.id === toast.id ? null : current))}
        />
      )}
    </ToastContext.Provider>
  )
}
