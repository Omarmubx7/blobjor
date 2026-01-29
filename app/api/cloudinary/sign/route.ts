import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { paramsToSign } = body

        if (!process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: 'Missing Cloudinary Secret' }, { status: 500 })
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        )

        return NextResponse.json({
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME
        })
    } catch (error) {
        return NextResponse.json({ error: 'Signing failed' }, { status: 500 })
    }
}
