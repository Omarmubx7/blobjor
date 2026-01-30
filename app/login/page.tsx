'use client'

import { useState } from 'react'
// import { signIn } from '@/auth' // We can't use server action directly in client component easily without wrapping
import { loginAction } from '@/lib/actions' // We will create this
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError('')

        try {
            const result = await loginAction(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                router.push('/') // Redirect on success
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 pt-12 relative z-10 transition-all duration-500 hover:border-zinc-700">

                {/* Logo Area */}
                <div className="flex flex-col items-center mb-12">
                    <Link href="/" className="font-heading font-black text-5xl text-white tracking-tighter mb-2 hover:scale-105 transition-transform">BLOBJOR</Link>
                    <p className="font-body text-zinc-500 text-[10px] tracking-[0.4em] uppercase">BE BOLD. BE YOU.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-4 bg-black border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center px-1">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">كلمة المرور</label>
                            <Link
                                href="/forgot-password"
                                className="text-[10px] text-zinc-500 hover:text-white transition-colors"
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-4 bg-black border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-500 text-xs font-bold text-center tracking-wide">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                    >
                        {isPending && <Loader2 className="animate-spin" size={16} />}
                        <span>تسجيل الدخول</span>
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                    <p className="text-xs text-zinc-500 font-medium">
                        لسه ما عندك حساب؟ {' '}
                        <Link href="/signup" className="text-white font-bold underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all">
                            انضم للعائلة
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
