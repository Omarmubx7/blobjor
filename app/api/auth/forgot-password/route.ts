
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'
import { getResetPasswordEmailTemplate } from '@/lib/mail-templates'
import crypto from 'crypto'

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

        // 2. Generate Token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

        // 3. Save to DB
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        })

        // 4. Send Email
        const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}`

        await resend.emails.send({
            from: 'BloB.JO <info@blob.jo>',
            to: customer.email!,
            subject: 'إعادة تعيين كلمة المرور - BloB.JO',
            html: getResetPasswordEmailTemplate(resetLink),
        })

        return NextResponse.json({ success: true, message: 'تم إرسال رابط إعادة التعيين' })

    } catch (error) {
        console.error('Forgot Password Error:', error)
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
    }
}
