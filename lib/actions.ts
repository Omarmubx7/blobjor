'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { rateLimit } from '@/lib/limit'

export async function loginAction(formData: FormData) {
    const isAllowed = await rateLimit(5, 60 * 1000) // 5 attempts per minute
    if (!isAllowed) {
        return { error: 'Too many attempts. Please try again later.' }
    }

    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirectTo: '/',
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' }
                default:
                    return { error: 'Something went wrong.' }
            }
        }
        throw error // Re-throw redirect errors
    }
}

// Signup action
const signupSchema = z.object({
    name: z.string()
        .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
        .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'الاسم يجب أن يحتوي على أحرف فقط') // Allow Arabic, English, spaces
        .refine((val) => !/[<>/]/.test(val), { message: 'الاسم يحتوي على رموز غير مسموحة' }), // Anti-XSS
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    phone: z.string()
        .min(10, 'رقم الهاتف يجب أن يتكون من 10 أرقام')
        .max(15, 'رقم الهاتف طويل جداً')
        .regex(/^[0-9]+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط'), // Anti-SQLi
    password: z.string()
        .min(8, 'كلمة المرور يجب أن تكون 8 خانات على الأقل')
        .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
        .regex(/[0-9!@#$%^&*]/, 'يجب أن تحتوي كلمة المرور على رقم أو رمز خاص'),
})

export async function signupAction(formData: FormData) {
    const isAllowed = await rateLimit(3, 60 * 60 * 1000) // 3 signups per hour per IP (prevent spam)
    if (!isAllowed) {
        return { error: 'Too many signup attempts. Please try again later.' }
    }

    const data = Object.fromEntries(formData.entries())

    // Validate
    const result = signupSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.errors[0].message }
    }

    // Sanitize inputs
    const { name, email, phone, password } = result.data
    const sanitizedName = name.trim()
    const sanitizedEmail = email.toLowerCase().trim()
    const sanitizedPhone = phone.trim()

    try {
        // Check existing
        const existing = await prisma.customer.findFirst({
            where: { OR: [{ email: sanitizedEmail }, { phone: sanitizedPhone }] }
        })

        if (existing) {
            return { error: 'المستخدم موجود بالفعل (البريد الإلكتروني أو الهاتف مستخدم)' }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create
        // Create user
        const newUser = await prisma.customer.create({
            data: {
                name: sanitizedName,
                email: sanitizedEmail,
                phone: sanitizedPhone,
                passwordHash,
                role: 'customer'
            },
        })

        // Send Welcome Email
        if (newUser.email) {
            const { getWelcomeEmailTemplate } = await import('@/lib/mail-templates');
            const { sendEmail } = await import('@/lib/mail');

            await sendEmail({
                to: newUser.email,
                subject: 'أهلاً بك في BloB.JO! 🎨',
                html: getWelcomeEmailTemplate(newUser.name),
            });
        }

        return { success: true, message: 'تم إنشاء الحساب بنجاح' }
    } catch (error) {
        console.error('Signup error:', error)
        return { error: 'Failed to create account.' }
    }
}
