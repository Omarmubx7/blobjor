"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

// BloB Logo Component
function BlobLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="currentColor">
      <path d="M20 2 L23 8 L30 6 L27 12 L35 15 L28 18 L32 25 L25 23 L24 30 L20 24 L16 30 L15 23 L8 25 L12 18 L5 15 L13 12 L10 6 L17 8 Z" />
      <circle cx="15" cy="18" r="2" fill="white" />
      <circle cx="25" cy="18" r="2" fill="white" />
    </svg>
  )
}

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem("blob_visited")
      const savedName = localStorage.getItem("blob_username")
      if (!hasVisited && !savedName) {
        const timer = setTimeout(() => setIsOpen(true), 1500)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      console.warn("Failed to access storage:", e)
    }
  }, [])

  const handleContinue = () => {
    try {
      if (name.trim()) {
        localStorage.setItem("blob_username", name.trim())
      }
      localStorage.setItem("blob_visited", "true")
    } catch (e) {
      console.warn("Failed to save to storage:", e)
    }
    setIsOpen(false)
  }

  const handleSkip = () => {
    try {
      localStorage.setItem("blob_visited", "true")
    } catch (e) {
      console.warn("Failed to save to storage:", e)
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <BlobLogo className="mb-4 h-16 w-16 text-foreground" />
          <h2 className="font-sans text-2xl font-black text-foreground">
            WELCOME TO BLOB!
          </h2>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            !BloB أهلاً بك في
          </p>
        </div>

        {/* Content */}
        <div className="mb-6 text-center">
          <p className="font-body text-sm text-muted-foreground">
            Tell us your name to personalize your experience
          </p>
          <p className="font-body text-sm text-muted-foreground">
            أخبرنا باسمك لتخصيص تجربتك
          </p>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="...Enter your name اكتب اسمك"
            className="w-full rounded-xl border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
          <p className="mt-2 font-body text-[10px] text-muted-foreground/60 text-center">
            Your name is stored locally and never shared
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleContinue}
            className="w-full rounded-full bg-primary py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
          >
            Continue | متابعة
          </button>
          <button
            onClick={handleSkip}
            className="font-body text-xs text-muted-foreground underline transition-colors hover:text-foreground"
          >
            Skip | تخطي
          </button>
        </div>

        <p className="mt-4 text-center font-body text-[10px] text-muted-foreground/50">
          You can always change this later in settings
        </p>
      </div>
    </div>
  )
}
