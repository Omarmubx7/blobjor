import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

export interface CloudinaryUploadOptions {
  folder?: string
  transformation?: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
  }
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
}

// Upload image from base64 or URL
export async function uploadImage(
  source: string,
  options: CloudinaryUploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = 'blob-jo/products',
    transformation,
    resourceType = 'image',
  } = options

  const uploadOptions: Record<string, unknown> = {
    folder,
    resource_type: resourceType,
    overwrite: true,
    unique_filename: true,
  }

  if (transformation) {
    uploadOptions.transformation = transformation
  }

  const result = await cloudinary.uploader.upload(source, uploadOptions)

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  }
}

// Upload base64 image with folder specification
export async function uploadBase64Image(
  base64Data: string,
  folderName: string = 'designs'
): Promise<UploadResult> {
  const folder = `blob-jo/${folderName}`
  
  const uploadOptions: Record<string, unknown> = {
    folder,
    resource_type: 'image',
    overwrite: true,
    unique_filename: true,
    transformation: [
      { quality: 'auto:best' },
      { fetch_format: 'auto' }
    ]
  }

  const result = await cloudinary.uploader.upload(base64Data, uploadOptions)

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  }
}

// Upload multiple images
export async function uploadImages(
  sources: string[],
  options: CloudinaryUploadOptions = {}
): Promise<UploadResult[]> {
  return Promise.all(sources.map(source => uploadImage(source, options)))
}

// Delete image by public ID
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

// Delete multiple images
export async function deleteImages(publicIds: string[]): Promise<{
  deleted: string[]
  failed: string[]
}> {
  const results = await Promise.allSettled(
    publicIds.map(id => deleteImage(id))
  )

  const deleted: string[] = []
  const failed: string[] = []

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      deleted.push(publicIds[index])
    } else {
      failed.push(publicIds[index])
    }
  })

  return { deleted, failed }
}

// Get optimized image URL with transformations
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
  } = {}
): string {
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options

  const transformations: string[] = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)

  const transformation = transformations.join(',')

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`
}

// Generate placeholder/blur hash URL
export function getPlaceholderUrl(publicId: string): string {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/w_50,h_50,c_fill,q_30,e_blur:1000/${publicId}`
}

export default cloudinary
