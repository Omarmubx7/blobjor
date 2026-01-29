import { NextResponse } from 'next/server'
import { getCurrentAdmin, verifyPassword, hashPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(request: Request) {
    try {
        // 1. Authenticate
        const admin = await getCurrentAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Parse Body
        const body = await request.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'جميع الحقول مطلوبة' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
                { status: 400 }
            )
        }

        // 3. Get fresh user data (for password hash)
        const user = await prisma.adminUser.findUnique({
            where: { id: admin.id }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // 4. Verify Current Password
        const isValid = await verifyPassword(currentPassword, user.passwordHash)
        if (!isValid) {
            return NextResponse.json(
                { error: 'كلمة المرور الحالية غير صحيحة' },
                { status: 400 }
            )
        }

        // 5. Update Password
        const newHash = await hashPassword(newPassword)
        await prisma.adminUser.update({
            where: { id: admin.id },
            data: {
                passwordHash: newHash,
                failedAttempts: 0,
                lockedUntil: null
            }
        })

        return NextResponse.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' })

    } catch (error) {
        console.error('Password update error:', error)
        return NextResponse.json(
            { error: 'حدث خطأ في الخادم' },
            { status: 500 }
        )
    }
}
