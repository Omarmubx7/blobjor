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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/20">
                        <ShoppingBag size={32} className="text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">مرحباً بعودتك</h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">أدخل بياناتك للدخول إلى حسابك</p>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">البريد الإلكتروني</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase">كلمة المرور</label>
                            <a href="#" className="text-xs text-cyan-500 hover:text-cyan-600">نسيت كلمة المرور؟</a>
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isPending && <Loader2 className="animate-spin" size={18} />}
                        تسجيل الدخول
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    ليس لديك حساب؟ {' '}
                    <Link href="/signup" className="text-cyan-500 font-bold hover:underline">
                        إنشاء حساب جديد
                    </Link>
                </div>
            </div>
        </div>
    )
}
