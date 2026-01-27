import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'فشل جلب التصنيفات' },
      { status: 500 }
    )
  }
}

// Create new category
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, slug, description, image, isActive, sortOrder } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'الاسم والرابط مطلوبان' },
        { status: 400 }
      )
    }

    // Check if slug exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'هذا الرابط مستخدم بالفعل' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء التصنيف' },
      { status: 500 }
    )
  }
}
