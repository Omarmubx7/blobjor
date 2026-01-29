
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'
import { getResetPasswordEmailTemplate } from '@/lib/mail-templates'
// crypto removed

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
        }

        // 1. Find user
        const customer = await prisma.customer.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!customer) {
            // Security: Don't reveal if email exists
            return NextResponse.json({ success: true, message: 'إذا كان البريد الإلكتروني مسجلاً، فسيتم إرسال رابط إعادة التعيين.' })
        }

        // 2. Generate OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

        // 3. Save to DB (using resetToken field to store OTP)
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                resetToken: otp,
                resetTokenExpiry
            }
        })

        // 4. Send Email
        await resend.emails.send({
            from: 'BloB.JO <info@blob.jo>',
            to: customer.email!,
            subject: 'رمز التحقق لإعادة تعيين كلمة المرور - BloB.JO',
            html: getResetPasswordEmailTemplate(otp),
        })

        return NextResponse.json({ success: true, message: 'تم إرسال رابط إعادة التعيين' })

    } catch (error) {
        console.error('Forgot Password Error:', error)
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
    }
}
