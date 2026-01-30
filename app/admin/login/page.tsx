'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول')
      }

      // Redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 opacity-80" />

      <div className="w-full max-w-md bg-black border border-zinc-800 p-8 pt-12 relative z-10 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800" />

        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="font-mono text-zinc-500 text-xs mb-4 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">System Access</span>
          <h1 className="font-heading font-black text-4xl text-white tracking-tight">BLOBJOR ADMIN</h1>
          <p className="font-body text-zinc-500 text-sm mt-2">لوحة التحكم المركزية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-4 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                placeholder="admin@blobjor.me"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-10 py-4 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-500 text-xs font-bold text-center tracking-wide flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
            Restricted Area · Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  )
}
