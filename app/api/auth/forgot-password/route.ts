import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'
import { getResetPasswordEmailTemplate } from '@/lib/mail-templates'
import { rateLimit } from '@/lib/limit'
import { z } from 'zod'
import crypto from 'crypto'

// Schema for input validation
const forgotPasswordSchema = z.object({
    email: z.string().email('صيغة البريد الإلكتروني غير صحيحة').transform(e => e.toLowerCase()),
})

export async function POST(request: Request) {
    try {
        // 1. DDoS Prevention: Rate Limiting
        const isAllowed = await rateLimit(3, 60 * 60 * 1000) // 3 requests per hour per IP
        if (!isAllowed) {
            return NextResponse.json(
                { error: 'تم تجاوز الحد المسموح به من المحاولات. يرجى المحاولة لاحقاً.' },
                { status: 429 }
            )
        }

        const body = await request.json()

        // 2. Input Validation
        const result = forgotPasswordSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email } = result.data

        // 3. Find user
        const customer = await prisma.customer.findUnique({
            where: { email }
        })

        // Timing attack mitigation: Simulate work if user not found (basic)
        if (!customer) {
            // Wait for a random time between 100-300ms to mimic DB write
            await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
            return NextResponse.json({ success: true, message: 'إذا كان البريد الإلكتروني مسجلاً، فسيتم إرسال رابط إعادة التعيين.' })
        }

        // 4. Secure OTP Generation
        // Generate a cryptographically strong 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString()
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

        // 5. Save to DB
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                resetToken: otp,
                resetTokenExpiry
            }
        })

        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not defined')
            return NextResponse.json({ error: 'خطأ في إعدادات الخادم' }, { status: 500 })
        }

        const resend = new Resend(process.env.RESEND_API_KEY)

        // 6. Send Email
        await resend.emails.send({
            from: 'blobjor.me <info@blobjor.me>',
            to: customer.email!,
            subject: 'رمز التحقق لإعادة تعيين كلمة المرور - blobjor.me',
            html: getResetPasswordEmailTemplate(otp),
        })

        return NextResponse.json({ success: true, message: 'تم إرسال رابط إعادة التعيين' })

    } catch (error) {
        console.error('Forgot Password Error:', error)
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
    }
}
