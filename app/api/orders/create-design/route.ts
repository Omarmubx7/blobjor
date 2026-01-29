import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // The client now uploads to Cloudinary and sends URLs
        const previewUrl = formData.get('preview_url') as string
        const printUrl = formData.get('print_url') as string
        // asset_urls is sent as a JSON string
        const assetUrlsString = formData.get('asset_urls') as string
        const assetUrls = assetUrlsString ? JSON.parse(assetUrlsString) : []

        // Get Metadata (if needed for DB in future)
        // const productType = formData.get('product_type')
        // const price = formData.get('price')
        // const designJson = formData.get('design_json')

        return NextResponse.json({
            success: true,
            design_id: `design-${Date.now()}`,
            preview_url: previewUrl,
            print_url: printUrl,
            asset_urls: assetUrls
        })

    } catch (error) {
        console.error('Error creating design:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
