
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { compare } from 'bcryptjs'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const password = searchParams.get('password')
    const secret = searchParams.get('secret')

    // Simple protection so random people don't spam it
    if (secret !== 'blob-debug-123') {
        return NextResponse.json({ error: 'Unauthorized debug access' }, { status: 403 })
    }

    try {
        // 1. Check DB Connection
        const dbUrl = process.env.DATABASE_URL || 'NOT_SET'
        const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':***@') // Mask password

        // 2. Find User
        const user = await prisma.adminUser.findUnique({
            where: { email: email || 'Hassan21@secure.jo' }
        })

        let passwordMatch = false
        let verificationError = null

        if (user && password) {
            try {
                passwordMatch = await compare(password, user.passwordHash)
            } catch (e: any) {
                verificationError = e.message
            }
        }

        return NextResponse.json({
            environment: {
                nodeEnv: process.env.NODE_ENV,
                dbUrl: maskedUrl,
            },
            userCheck: {
                found: !!user,
                email: user?.email,
                id: user?.id,
                isLocked: !!user?.lockedUntil,
                failedAttempts: user?.failedAttempts,
                passwordHashStart: user?.passwordHash?.substring(0, 10) + '...',
            },
            passwordCheck: {
                attempted: password,
                match: passwordMatch,
                error: verificationError
            }
        })

    } catch (error: any) {
        return NextResponse.json({
            error: 'Server Error',
            details: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
