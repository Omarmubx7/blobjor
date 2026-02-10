
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { rateLimit } from '@/lib/limit'
import { z } from 'zod'

const resetPasswordSchema = z.object({
    email: z.string().email().transform(e => e.toLowerCase()),
    otp: z.string().length(6, 'رمز التحقق يجب أن يكون 6 أرقام').regex(/^\d{6}$/, 'رمز التحقق يجب أن يحتوي على أرقام فقط'),
    newPassword: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
})

export async function POST(request: Request) {
    try {
        // Rate limiting: 5 attempts per 15 minutes per IP
        const isAllowed = await rateLimit(5, 15 * 60 * 1000)
        if (!isAllowed) {
            return NextResponse.json(
                { error: 'تم تجاوز الحد المسموح به من المحاولات. يرجى المحاولة لاحقاً.' },
                { status: 429 }
            )
        }

        const body = await request.json()
        const result = resetPasswordSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, otp, newPassword } = result.data

        // 1. Find user by EMAIL
        const customer = await prisma.customer.findUnique({
            where: { email }
        })

        if (!customer) {
            // Don't reveal if user exists
            return NextResponse.json({ error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' }, { status: 400 })
        }

        // 2. Validate OTP (constant-time comparison concept: check both conditions)
        const isOtpValid = customer.resetToken === otp
        const isNotExpired = customer.resetTokenExpiry && customer.resetTokenExpiry > new Date()

        if (!isOtpValid || !isNotExpired) {
            // Clear token after too many wrong attempts to prevent further brute-force
            // We can't track per-user attempts without a field, so we rely on rate limiting
            return NextResponse.json({ error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' }, { status: 400 })
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
