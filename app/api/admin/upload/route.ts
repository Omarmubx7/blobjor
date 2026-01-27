import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { uploadImage, uploadImages, deleteImage, deleteImages } from '@/lib/cloudinary'

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Upload single image
export async function POST(request: Request) {
  try {
    // Check authentication
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || 'blob-jo/products'

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'الرجاء اختيار ملف واحد على الأقل' },
        { status: 400 }
      )
    }

    // Validate files
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `نوع الملف غير مدعوم: ${file.type}` },
          { status: 400 }
        )
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'حجم الملف يتجاوز الحد المسموح (10MB)' },
          { status: 400 }
        )
      }
    }

    // Convert files to base64 and upload
    const base64Files = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        return `data:${file.type};base64,${buffer.toString('base64')}`
      })
    )

    if (base64Files.length === 1) {
      // Single file upload
      const result = await uploadImage(base64Files[0], { folder })
      return NextResponse.json({
        success: true,
        image: result,
      })
    } else {
      // Multiple files upload
      const results = await uploadImages(base64Files, { folder })
      return NextResponse.json({
        success: true,
        images: results,
      })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    )
  }
}

// Delete image(s)
export async function DELETE(request: Request) {
  try {
    // Check authentication
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const { publicIds } = await request.json()

    if (!publicIds || (Array.isArray(publicIds) && publicIds.length === 0)) {
      return NextResponse.json(
        { error: 'الرجاء تحديد معرف الصورة' },
        { status: 400 }
      )
    }

    if (Array.isArray(publicIds)) {
      // Delete multiple images
      const result = await deleteImages(publicIds)
      return NextResponse.json({
        success: true,
        ...result,
      })
    } else {
      // Delete single image
      const success = await deleteImage(publicIds)
      return NextResponse.json({
        success,
        message: success ? 'تم حذف الصورة بنجاح' : 'فشل حذف الصورة',
      })
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الصورة' },
      { status: 500 }
    )
  }
}
