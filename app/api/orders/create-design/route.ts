import { NextRequest, NextResponse } from 'next/server'
import { uploadBase64Image } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // Helper to upload file to Cloudinary
        const uploadFile = async (file: File, folder: string = 'designs') => {
            const buffer = Buffer.from(await file.arrayBuffer())
            const base64 = buffer.toString('base64')
            const mimeType = file.type || 'image/png'
            const dataURI = `data:${mimeType};base64,${base64}`
            return await uploadBase64Image(dataURI, folder)
        }

        // Save Preview Image (Mockup)
        const previewFile = formData.get('preview_image') as File
        let previewPath = ''

        if (previewFile) {
            const result = await uploadFile(previewFile, 'designs/previews')
            previewPath = result.url
        }

        // Save Print Image (High-Res Design Only)
        const printFile = formData.get('print_image') as File
        let printPath = ''

        if (printFile) {
            const result = await uploadFile(printFile, 'designs/prints')
            printPath = result.url
        }

        // Save Uploaded Images (Assets)
        const uploadedImagesPaths: string[] = []
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('uploaded_image_') && value instanceof File) {
                const result = await uploadFile(value, 'designs/assets')
                uploadedImagesPaths.push(result.url)
            }
        }

        // Get Metadata
        // const designJson = formData.get('design_json')
        // const productType = formData.get('product_type')
        // const price = formData.get('price')

        return NextResponse.json({
            success: true,
            design_id: `design-${Date.now()}`,
            preview_url: previewPath,
            print_url: printPath,
            asset_urls: uploadedImagesPaths
        })

    } catch (error) {
        console.error('Error creating design:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
