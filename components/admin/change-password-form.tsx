'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Check, AlertCircle } from 'lucide-react'
import { useToast } from '@/contexts/toast-context'

export function ChangePasswordForm() {
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            addToast({ message: 'كلمات المرور غير متطابقة', type: 'error' })
            return
        }

        if (newPassword.length < 6) {
            addToast({ message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', type: 'error' })
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/admin/profile/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'حدث خطأ ما')
            }

            addToast({ message: 'تم تحديث كلمة المرور بنجاح!', type: 'success' })

            // Reset form
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')

        } catch (error: any) {
            addToast({ message: error.message, type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
                <Label htmlFor="current">كلمة المرور الحالية</Label>
                <Input
                    id="current"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="text-right"
                    placeholder="••••••"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="new">كلمة المرور الجديدة</Label>
                <Input
                    id="new"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="text-right"
                    placeholder="••••••"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirm">تأكيد كلمة المرور الجديدة</Label>
                <Input
                    id="confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="text-right"
                    placeholder="••••••"
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري التحديث...
                    </>
                ) : (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        تحديث كلمة المرور
                    </>
                )}
            </Button>
        </form>
    )
}
