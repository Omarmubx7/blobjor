import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

// GET - Get single custom design
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const customDesign = await prisma.customDesign.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            price: true,
            colors: true,
            sizes: true,
            images: { orderBy: { sortOrder: 'asc' } },
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            order: {
              select: {
                id: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })

    if (!customDesign) {
      return NextResponse.json(
        { error: 'التصميم غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      customDesign: {
        ...customDesign,
        config: JSON.parse(customDesign.config),
      },
    })
  } catch (error) {
    console.error('Get custom design error:', error)
    return NextResponse.json(
      { error: 'فشل جلب التصميم' },
      { status: 500 }
    )
  }
}

// PUT - Update custom design
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()

    const existing = await prisma.customDesign.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'التصميم غير موجود' },
        { status: 404 }
      )
    }

    const configJson = formData.get('config') as string | null
    const notes = formData.get('notes') as string | null
    const status = formData.get('status') as string | null
    const designFile = formData.get('designImage') as File | null

    const updateData: Record<string, unknown> = {}

    // Update config if provided
    if (configJson) {
      try {
        const config = JSON.parse(configJson)
        updateData.config = JSON.stringify({
          position_x: config.position_x ?? 0.5,
          position_y: config.position_y ?? 0.3,
          scale: config.scale ?? 1,
          rotation: config.rotation ?? 0,
          side: config.side ?? 'front',
        })
      } catch {
        return NextResponse.json(
          { error: 'صيغة الإعدادات غير صالحة' },
          { status: 400 }
        )
      }
    }

    // Update notes if provided
    if (notes !== null) {
      updateData.notes = notes
    }

    // Update status if provided
    if (status) {
      if (!['draft', 'submitted', 'approved', 'rejected'].includes(status)) {
        return NextResponse.json(
          { error: 'حالة غير صالحة' },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    // Handle new design image
    if (designFile) {
      // Delete old image if exists
      if (existing.designPublicId) {
        await deleteImage(existing.designPublicId)
      }

      // Upload new image
      const buffer = Buffer.from(await designFile.arrayBuffer())
      const base64 = `data:${designFile.type};base64,${buffer.toString('base64')}`
      
      const uploadResult = await uploadImage(base64, {
        folder: 'blob-jo/custom-designs',
      })
      
      updateData.designImageUrl = uploadResult.url
      updateData.designPublicId = uploadResult.publicId
    }

    const customDesign = await prisma.customDesign.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            price: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      customDesign: {
        ...customDesign,
        config: JSON.parse(customDesign.config),
      },
    })
  } catch (error) {
    console.error('Update custom design error:', error)
    return NextResponse.json(
      { error: 'فشل تحديث التصميم' },
      { status: 500 }
    )
  }
}

// DELETE - Delete custom design
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.customDesign.findUnique({
      where: { id },
      include: { orderItems: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'التصميم غير موجود' },
        { status: 404 }
      )
    }

    // Don't delete if linked to orders
    if (existing.orderItems.length > 0) {
      return NextResponse.json(
        { error: 'لا يمكن حذف تصميم مرتبط بطلبات' },
        { status: 400 }
      )
    }

    // Delete images from Cloudinary
    if (existing.designPublicId) {
      await deleteImage(existing.designPublicId)
    }
    if (existing.mockupPublicId) {
      await deleteImage(existing.mockupPublicId)
    }

    await prisma.customDesign.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete custom design error:', error)
    return NextResponse.json(
      { error: 'فشل حذف التصميم' },
      { status: 500 }
    )
  }
}
