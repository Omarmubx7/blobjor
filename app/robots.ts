import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blob.jo'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/order-confirmation/', '/track-order/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
