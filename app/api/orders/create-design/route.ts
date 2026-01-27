import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // Prepare directory
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'designs')
        await mkdir(uploadDir, { recursive: true })

        // Save Preview Image (Mockup)
        const previewFile = formData.get('preview_image') as File
        let previewPath = ''

        if (previewFile) {
            const buffer = Buffer.from(await previewFile.arrayBuffer())
            const filename = previewFile.name || `preview-${Date.now()}.png`
            await writeFile(join(uploadDir, filename), buffer)
            previewPath = `/uploads/designs/${filename}`
        }

        // Save Print Image (High-Res Design Only)
        const printFile = formData.get('print_image') as File
        let printPath = ''

        if (printFile) {
            const buffer = Buffer.from(await printFile.arrayBuffer())
            const filename = printFile.name || `print-${Date.now()}.png`
            await writeFile(join(uploadDir, filename), buffer)
            printPath = `/uploads/designs/${filename}`
        }

        // Save Uploaded Images (Assets)
        const uploadedImagesPaths: string[] = []
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('uploaded_image_') && value instanceof File) {
                const buffer = Buffer.from(await value.arrayBuffer())
                const filename = value.name || `asset-${Date.now()}-${Math.random().toString(36).slice(7)}.png`
                await writeFile(join(uploadDir, filename), buffer)
                uploadedImagesPaths.push(`/uploads/designs/${filename}`)
            }
        }

        // Get Metadata
        const designJson = formData.get('design_json')
        const productType = formData.get('product_type')
        const price = formData.get('price')

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
