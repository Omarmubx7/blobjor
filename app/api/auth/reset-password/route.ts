
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json()

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'الرموز والبيانات مفقودة' }, { status: 400 })
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 })
        }

        // 1. Find user with valid token
        const customer = await prisma.customer.findUnique({
            where: { resetToken: token }
        })

        if (!customer) {
            return NextResponse.json({ error: 'الرابط غير صالح أو منتهي الصلاحية' }, { status: 400 })
        }

        // 2. Check Expiry
        if (!customer.resetTokenExpiry || customer.resetTokenExpiry < new Date()) {
            return NextResponse.json({ error: 'انتهت صلاحية الرابط' }, { status: 400 })
        }

        // 3. Update Password & Clear Token
        const passwordHash = await hash(newPassword, 12)

        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

        return NextResponse.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' })

    } catch (error) {
        console.error('Reset Password Error:', error)
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
    }
}
