
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'

export async function GET() {
    try {
        const sections = await prisma.homepageSection.findMany({
            where: { isActive: true },
            select: {
                sectionKey: true,
                title: true,
                subtitle: true,
                imageUrl: true,
                content: true
            }
        })
        return NextResponse.json(sections)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const admin = await getCurrentAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { sectionKey, title, subtitle, imageUrl } = body

        if (!sectionKey) {
            return NextResponse.json({ error: 'Section key is required' }, { status: 400 })
        }

        const section = await prisma.homepageSection.upsert({
            where: { sectionKey },
            update: {
                title,
                subtitle,
                imageUrl,
            },
            create: {
                sectionKey,
                title,
                subtitle,
                imageUrl,
                isActive: true
            }
        })

        return NextResponse.json({ success: true, section })
    } catch (error) {
        console.error('Homepage Update Error:', error)
        return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }
}
