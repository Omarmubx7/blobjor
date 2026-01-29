
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const { email, otp, newPassword } = await request.json()

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 })
        }

        // 1. Find user by EMAIL
        const customer = await prisma.customer.findUnique({
            where: { email }
        })

        if (!customer) {
            return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 400 })
        }

        // 2. Validate OTP
        if (customer.resetToken !== otp) {
            return NextResponse.json({ error: 'رمز التحقق غير صحيح' }, { status: 400 })
        }

        // 3. Check Expiry
        if (!customer.resetTokenExpiry || customer.resetTokenExpiry < new Date()) {
            return NextResponse.json({ error: 'انتهت صلاحية الرمز' }, { status: 400 })
        }

        // 4. Update Password & Clear Token
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
