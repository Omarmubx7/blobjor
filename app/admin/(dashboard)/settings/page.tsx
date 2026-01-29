
import { Metadata } from "next"
import { ChangePasswordForm } from "@/components/admin/change-password-form"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "الإعدادات | BloB.JO",
    description: "إعدادات المسؤول",
}

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
                <p className="text-muted-foreground">
                    إدارة إعدادات حسابك والملف الشخصي
                </p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">تغيير كلمة المرور</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        قم بتحديث كلمة المرور الخاصة بحسابك. يجب أن تكون كلمة المرور الجديدة قوية ومكونة من 6 خانات على الأقل.
                    </p>

                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    )
}
