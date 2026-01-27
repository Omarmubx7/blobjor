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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
            <div className="w-full max-w-md bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/20">
                        <ShoppingBag size={32} className="text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">إنشاء حساب جديد</h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">انضم إلينا لتبدأ التصميم والتسوق</p>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">الاسم الكامل</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="الاسم"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">رقم الهاتف</label>
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="079xxxxxxx"
                        />
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">كلمة المرور</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">تأكيد كلمة المرور</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
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
                        إنشاء الحساب
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    لديك حساب بالفعل؟ {' '}
                    <Link href="/login" className="text-cyan-500 font-bold hover:underline">
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        </div>
    )
}
