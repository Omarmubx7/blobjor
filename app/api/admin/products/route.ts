import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'فشل جلب المنتجات' },
      { status: 500 }
    )
  }
}

// Create new product
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
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      categoryId,
      isActive,
      isFeatured,
      allowCustomDesign,
      images,
    } = body

    // Validate required fields
    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: 'الاسم والرابط والسعر مطلوبون' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'هذا الرابط مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // Create product with images
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        compareAtPrice,
        categoryId,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        allowCustomDesign: allowCustomDesign ?? false,
        images: images?.length > 0 ? {
          create: images.map((img: { url: string; publicId?: string; altText?: string; sortOrder: number }) => ({
            url: img.url,
            publicId: img.publicId,
            altText: img.altText || name,
            sortOrder: img.sortOrder,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء المنتج' },
      { status: 500 }
    )
  }
}
