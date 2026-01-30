'use client'

import { useState } from 'react'
import { signupAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Loader2 } from 'lucide-react'

export default function SignupPage() {
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError('')

        // Simple client-side validation (optional, as server does it too)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('كلمات المرور غير متطابقة')
            setIsPending(false)
            return
        }

        try {
            const result = await signupAction(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                router.push('/login?success=1') // Redirect to login
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 pt-12 relative z-10 transition-all duration-500 hover:border-zinc-700">

                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="font-heading font-black text-4xl text-white tracking-tighter mb-2 hover:scale-105 transition-transform">BLOBJOR</Link>
                    <h1 className="font-body text-zinc-400 text-xs font-bold uppercase tracking-widest text-center mt-2">
                        JOIN THE MOVEMENT
                    </h1>
                </div>

                <form action={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">الاسم الكامل</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                            placeholder="الاسم"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">رقم الهاتف</label>
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                            placeholder="079xxxxxxx"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">كلمة المرور</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">تأكيد كلمة المرور</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-black border border-zinc-800 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-right font-mono text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-500 text-xs font-bold text-center tracking-wide">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                    >
                        {isPending && <Loader2 className="animate-spin" size={16} />}
                        <span>إنشاء الحساب</span>
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                    <p className="text-xs text-zinc-500 font-medium">
                        عندك حساب؟ {' '}
                        <Link href="/login" className="text-white font-bold underline decoration-zinc-700 underline-offset-4 hover:decoration-white transition-all">
                            سجل دخولك
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
