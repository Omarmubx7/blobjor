import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blob.jo'

export const siteConfig = {
  name: 'BloB.JO',
  nameAr: 'بلوب',
  tagline: 'BE BOLD. BE YOU. BE BLOB.',
  taglineAr: 'كن جريئاً. كن أنت. كن بلوب.',
  description: 'طباعة حسب الطلب في الأردن - هوديات، أكواب، وتصاميم مخصصة بجودة عالية. توصيل سريع لكل المملكة، أسعار مناسبة.',
  descriptionEn: 'Print on demand in Jordan - Premium hoodies, mugs, and custom designs. Fast delivery across Jordan.',
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.jpg`,
  links: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '+962787257247',
    instagram: 'https://instagram.com/blob.jor',
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_WHATSAPP || '+962787257247',
    address: 'عمّان، الأردن',
    addressEn: 'Amman, Jordan',
  },
  keywords: [
    'طباعة حسب الطلب',
    'طباعة حسب الطلب الأردن',
    'هوديات مخصصة',
    'أكواب مخصصة',
    'تصميم مخصص',
    'طباعة هوديات',
    'طباعة أكواب',
    'الأردن',
    'عمّان',
    'print on demand',
    'custom hoodies jordan',
    'custom mugs jordan',
    'print on demand jordan',
    'BloB',
    'بلوب',
  ],
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BloB.JO | طباعة حسب الطلب في الأردن - حول أفكارك لواقع',
    template: '%s | BloB.JO',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'BloB.JO', url: siteUrl }],
  creator: 'BloB.JO',
  publisher: 'BloB.JO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'ar-JO': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_JO',
    url: siteUrl,
    siteName: 'BloB.JO',
    title: 'BloB.JO | طباعة حسب الطلب في الأردن',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'BloB.JO - طباعة حسب الطلب في الأردن',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BloB.JO | طباعة حسب الطلب في الأردن',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@blobjo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/Bloblogo.png',
    apple: '/Bloblogo.png',
  },
}

// Organization JSON-LD Schema
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'BloB.JO',
    alternateName: 'بلوب',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/Bloblogo.png`,
      width: 512,
      height: 512,
    },
    image: siteConfig.ogImage,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'عمّان',
      addressCountry: 'JO',
    },
    sameAs: [
      siteConfig.links.instagram,
      `https://wa.me/${siteConfig.links.whatsapp.replace('+', '')}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      areaServed: 'JO',
      availableLanguage: ['Arabic', 'English'],
    },
  }
}

// Website JSON-LD Schema
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'BloB.JO',
    alternateName: 'بلوب - طباعة حسب الطلب',
    description: siteConfig.description,
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    inLanguage: 'ar-JO',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Product JSON-LD Schema
export function getProductSchema(product: {
  name: string
  nameAr: string
  description: string
  slug: string
  price: number
  image: string
  inStock?: boolean
  category?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}/products/${product.slug}#product`,
    name: product.nameAr,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`,
    url: `${siteUrl}/products/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'BloB.JO',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'JOD',
      price: product.price,
      availability: product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@id': `${siteUrl}/#organization`,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'JO',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
    },
    category: product.category,
  }
}

// Breadcrumb JSON-LD Schema
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  }
}

// FAQ JSON-LD Schema
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Local Business JSON-LD Schema
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: 'BloB.JO',
    alternateName: 'بلوب',
    image: siteConfig.ogImage,
    url: siteUrl,
    telephone: siteConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'عمّان',
      addressRegion: 'Amman',
      addressCountry: 'JO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.9454,
      longitude: 35.9284,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Jordan',
    },
  }
}
