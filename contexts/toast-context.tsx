"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { X, CheckCircle2, AlertCircle, Info, ShoppingCart } from "lucide-react"

type ToastType = "success" | "error" | "info" | "cart"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface AddToastParams {
  message: string
  type?: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (params: AddToastParams) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback(({ message, type = "info", duration = 3000 }: AddToastParams) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} className="text-success" />
      case "error":
        return <AlertCircle size={20} className="text-destructive" />
      case "cart":
        return <ShoppingCart size={20} className="text-primary" />
      default:
        return <Info size={20} className="text-info" />
    }
  }

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-success/10 border-success/20"
      case "error":
        return "bg-destructive/10 border-destructive/20"
      case "cart":
        return "bg-primary/10 border-primary/20"
      default:
        return "bg-info/10 border-info/20"
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 w-full max-w-sm px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-2xl border ${getBgColor(toast.type)} bg-card p-4 shadow-xl animate-fade-in-up backdrop-blur-sm`}
        >
          {getIcon(toast.type)}
          <p className="flex-1 font-body text-sm font-medium text-foreground">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
