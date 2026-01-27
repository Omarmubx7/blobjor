import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'
import { v4 as uuidv4 } from 'uuid'

// Design config interface
export interface DesignConfig {
  position_x: number  // 0-1, horizontal position (0.5 = center)
  position_y: number  // 0-1, vertical position (0.25 = top quarter)
  scale: number       // 0.1-2, size multiplier
  rotation: number    // degrees
  side: 'front' | 'back' | 'left' | 'right'
}

// GET - List custom designs (for admin or by session)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')
    const productId = searchParams.get('productId')

    const where: Record<string, unknown> = {}
    
    if (sessionId) where.sessionId = sessionId
    if (customerId) where.customerId = customerId
    if (status) where.status = status
    if (productId) where.productId = productId

    const designs = await prisma.customDesign.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            price: true,
            images: { take: 1, orderBy: { sortOrder: 'asc' } },
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ designs })
  } catch (error) {
    console.error('Get custom designs error:', error)
    return NextResponse.json(
      { error: 'فشل جلب التصاميم' },
      { status: 500 }
    )
  }
}

// POST - Create a new custom design
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const productId = formData.get('productId') as string
    const sessionId = formData.get('sessionId') as string | null
    const customerId = formData.get('customerId') as string | null
    const configJson = formData.get('config') as string
    const notes = formData.get('notes') as string | null
    const designFile = formData.get('designImage') as File | null
    const designImageUrl = formData.get('designImageUrl') as string | null // Already uploaded URL

    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { error: 'معرف المنتج مطلوب' },
        { status: 400 }
      )
    }

    // Verify product exists and allows custom design
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      )
    }

    if (!product.allowCustomDesign) {
      return NextResponse.json(
        { error: 'هذا المنتج لا يدعم التصميم المخصص' },
        { status: 400 }
      )
    }

    // Parse and validate config
    let config: DesignConfig
    try {
      config = JSON.parse(configJson || '{}')
      
      // Set defaults
      config = {
        position_x: config.position_x ?? 0.5,
        position_y: config.position_y ?? 0.3,
        scale: config.scale ?? 1,
        rotation: config.rotation ?? 0,
        side: config.side ?? 'front',
      }
    } catch {
      return NextResponse.json(
        { error: 'صيغة الإعدادات غير صالحة' },
        { status: 400 }
      )
    }

    // Handle design image
    let finalDesignImageUrl = designImageUrl
    let designPublicId: string | null = null

    if (designFile) {
      // Upload to Cloudinary
      const buffer = Buffer.from(await designFile.arrayBuffer())
      const base64 = `data:${designFile.type};base64,${buffer.toString('base64')}`
      
      const uploadResult = await uploadImage(base64, {
        folder: 'blob-jo/custom-designs',
      })
      
      finalDesignImageUrl = uploadResult.url
      designPublicId = uploadResult.publicId
    }

    if (!finalDesignImageUrl) {
      return NextResponse.json(
        { error: 'صورة التصميم مطلوبة' },
        { status: 400 }
      )
    }

    // Generate session ID if not provided (for guest users)
    const finalSessionId = sessionId || uuidv4()

    // Create custom design
    const customDesign = await prisma.customDesign.create({
      data: {
        productId,
        sessionId: finalSessionId,
        customerId: customerId || null,
        designImageUrl: finalDesignImageUrl,
        designPublicId,
        config: JSON.stringify(config),
        notes: notes || null,
        status: 'draft',
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            price: true,
            images: { take: 1 },
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
      sessionId: finalSessionId,
    }, { status: 201 })
  } catch (error) {
    console.error('Create custom design error:', error)
    return NextResponse.json(
      { error: 'فشل حفظ التصميم' },
      { status: 500 }
    )
  }
}
