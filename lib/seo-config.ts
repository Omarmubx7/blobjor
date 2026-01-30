import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blobjor.me'

export const siteConfig = {
  name: 'BLOBJOR',
  nameAr: 'BLOBJOR',
  tagline: 'DESIGN IT. WEAR IT. OWN IT.',
  taglineAr: 'صمّمها، البسها، عيشها.',
  description: 'BLOBJOR (بلوب) - المتجر الأول للطباعة حسب الطلب في الأردن. هوديات، تيشيرتات، وأكواب بتصاميم أنمي، ألعاب، ومسلسلات. صمم هوديك الخاص الآن! توصيل لجميع المحافظات.',
  descriptionEn: 'BLOBJOR is Jordan\'s #1 Print on Demand store. Custom hoodies, anime t-shirts, mugs & stickers in Amman. Create your own design or shop our exclusive streetwear collection. Fast delivery.',
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
    // Brand
    'blob', 'blobjor', 'blob jordan', 'بلوب', 'بلوب جور', 'blob shop',
    // Core Services
    'print on demand jordan', 'طباعة حسب الطلب', 'طباعة هوديات عمان', 'طباعة تيشيرتات الاردن',
    // Products (Arabic)
    'هوديات', 'تيشيرتات', 'اكواب', 'ستيكرات', 'هودي انمي', 'تيشيرت اوفر سايز',
    // Products (English)
    'custom hoodies amman', 'anime hoodies jordan', 'graphic tees jordan', 'custom mugs amman',
    // Intent/Location
    'gift ideas jordan', 'online shopping jordan', 'توصيل هدايا الاردن', 'متجر ملابس انمي',
    // Specific Niches
    'naruto hoodie jordan', 'one piece merch jordan', 'islamic design hoodies', 'jordanian streetwear',
  ],
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BLOBJOR | طباعة حسب الطلب في الأردن - هوديات وتيشيرتات مخصصة',
    template: '%s | BLOBJOR الأردن',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'BLOBJOR Team', url: siteUrl }],
  creator: 'BLOBJOR',
  publisher: 'BLOBJOR',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'ar-JO': siteUrl,
      'en-JO': `${siteUrl}/en`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_JO',
    url: siteUrl,
    siteName: 'BLOBJOR - Print on Demand Jordan',
    title: 'BLOBJOR | متجر الهوديات والطباعة الأول في الأردن',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'BLOBJOR - Custom Hoodies & T-Shirts in Jordan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLOBJOR | Custom Hoodies & Streetwear Jordan',
    description: siteConfig.descriptionEn,
    images: [siteConfig.ogImage],
    creator: '@blobjor',
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
    name: 'blobjor.me',
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
    name: 'blobjor.me',
    alternateName: 'blobjor.me - طباعة حسب الطلب',
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
      name: 'blobjor.me',
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
    name: 'BLOBJOR',
    alternateName: 'بلوب للطباعة',
    image: siteConfig.ogImage,
    url: siteUrl,
    telephone: siteConfig.contact.phone,
    email: 'support@blobjor.me',
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Amman',
      addressRegion: 'Amman Governorate',
      addressCountry: 'JO',
      streetAddress: 'Seventh Circle, Amman', // Generic central location or specific if known
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.9539, // Amman Coords
      longitude: 35.9106,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '22:00',
      },
    ],
    priceRange: 'JOD',
    sameAs: [
      siteConfig.links.instagram,
      `https://wa.me/${siteConfig.links.whatsapp.replace('+', '')}`,
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Jordan',
    },
    paymentAccepted: ['Cash on Delivery', 'CliQ', 'Zain Cash'],
  }
}
