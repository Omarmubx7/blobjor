
'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const [formData, setFormData] = useState({
        otp: '',
        password: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة')
            return
        }

        if (formData.password.length < 8) {
            setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
            return
        }

        if (!email) {
            setError('البريد الإلكتروني مفقود. يرجى البدء من جديد.')
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp: formData.otp,
                    newPassword: formData.password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'حدث خطأ ما')
            }

            setIsSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!email) {
        return (
            <div className="text-center">
                <div className="rounded-full bg-red-100 p-3 mx-auto w-fit mb-4 dark:bg-red-900/30">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">رابط غير صالح</h2>
                <Link href="/forgot-password">
                    <Button>العودة</Button>
                </Link>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="text-center">
                <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-4 dark:bg-green-900/30">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">تم تغيير كلمة المرور!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    تم تحديث كلمة المرور بنجاح. سيتم تحويلك لصفحة الدخول...
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    تعيين كلمة مرور جديدة
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    أدخل رمز التحقق المرسل إلى {email}
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="otp">رمز التحقق (OTP)</Label>
                        <Input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            className="mt-1 text-center text-lg tracking-widest bg-muted/50 font-mono"
                            placeholder="123456"
                            maxLength={6}
                            value={formData.otp}
                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">كلمة المرور الجديدة</Label>
                        <div className="relative mt-1">
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                disabled={isLoading}
                                className="pr-10"
                                placeholder="••••••••"
                                minLength={8}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                        <div className="relative mt-1">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                disabled={isLoading}
                                className="pr-10"
                                placeholder="••••••••"
                                minLength={8}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="mr-3">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري التحديث...
                        </>
                    ) : (
                        'تحديث كلمة المرور'
                    )}
                </Button>
            </form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-800">
                <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
