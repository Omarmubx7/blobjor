
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'

export async function GET() {
    try {
        const admin = await getCurrentAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch pending orders (limit 5 for notifications)
        const recentOrders = await prisma.order.findMany({
            where: {
                status: {
                    in: ['PENDING', 'PROCESSING']
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
            select: {
                id: true,
                totalPrice: true,
                createdAt: true,
                customerName: true
            }
        })

        const unreadCount = await prisma.order.count({
            where: { status: 'PENDING' }
        })

        return NextResponse.json({
            notifications: recentOrders,
            unreadCount
        })

    } catch (error) {
        console.error('Notifications Error:', error)
        return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }
}
