import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { deleteImages } from '@/lib/cloudinary'

// Get single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'فشل جلب المنتج' },
      { status: 500 }
    )
  }
}

// Update product
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      )
    }

    // Check if new slug is already used by another product
    if (slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findFirst({
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

    // Delete old images that are not in the new list
    const oldPublicIds = existingProduct.images
      .filter((img: { publicId: string | null }) => img.publicId)
      .map((img: { publicId: string | null }) => img.publicId!)
    
    const newPublicIds = images
      ?.filter((img: { publicId?: string }) => img.publicId)
      .map((img: { publicId: string }) => img.publicId) || []

    const publicIdsToDelete = oldPublicIds.filter(
      (id: string) => !newPublicIds.includes(id)
    )

    if (publicIdsToDelete.length > 0) {
      await deleteImages(publicIdsToDelete)
    }

    // Delete existing images from database
    await prisma.productImage.deleteMany({
      where: { productId: id },
    })

    // Update product with new images
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        compareAtPrice,
        categoryId,
        isActive,
        isFeatured,
        allowCustomDesign,
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

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'فشل تحديث المنتج' },
      { status: 500 }
    )
  }
}

// Delete product
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

    // Get product with images
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary
    const publicIds = product.images
      .filter((img: { publicId: string | null }) => img.publicId)
      .map((img: { publicId: string | null }) => img.publicId!)

    if (publicIds.length > 0) {
      await deleteImages(publicIds)
    }

    // Delete product (cascades to images)
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'فشل حذف المنتج' },
      { status: 500 }
    )
  }
}
