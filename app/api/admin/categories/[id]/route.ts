import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Get single category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'التصنيف غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { error: 'فشل جلب التصنيف' },
      { status: 500 }
    )
  }
}

// Update category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, description, image, isActive, sortOrder } = body

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'التصنيف غير موجود' },
        { status: 404 }
      )
    }

    // Check if new slug is taken
    if (slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'هذا الرابط مستخدم بالفعل' },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
        isActive,
        sortOrder,
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'فشل تحديث التصنيف' },
      { status: 500 }
    )
  }
}

// Delete category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'التصنيف غير موجود' },
        { status: 404 }
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف التصنيف - يحتوي على ${category._count.products} منتج` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'فشل حذف التصنيف' },
      { status: 500 }
    )
  }
}
