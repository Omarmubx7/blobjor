import React from "react"
import type { Metadata, Viewport } from 'next'
import { Montserrat, Cairo } from 'next/font/google'
import { CartProvider } from '@/contexts/cart-context'
import { ToastProvider } from '@/contexts/toast-context'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import { defaultMetadata, getOrganizationSchema, getWebsiteSchema, getLocalBusinessSchema } from '@/lib/seo-config'
import './globals.css'
import { AuthProvider } from '@/components/providers/session-provider'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  ...defaultMetadata,
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

import { auth } from '@/auth'
import { MainLayout } from '@/components/layout/main-layout'

// ... inside RootLayout
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.user

  // ... schemas
  const organizationSchema = getOrganizationSchema()
  const websiteSchema = getWebsiteSchema()
  const localBusinessSchema = getLocalBusinessSchema()

  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      {/* ... head ... */}
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blobjor.me'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${cairo.variable} font-body antialiased`}>
        <ToastProvider>
          <CartProvider>
            <AuthProvider>
              <MainLayout user={user}>
                {children}
                <SpeedInsights />
                <Analytics />
              </MainLayout>
            </AuthProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
