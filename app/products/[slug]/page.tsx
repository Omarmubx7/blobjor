import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { 
  Palette, 
  Truck, 
  Shield, 
  Star,
  ChevronLeft,
  Package,
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })
}

async function getRelatedProducts(categoryId: string | null, currentId: string) {
  if (!categoryId) return []
  
  return prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: currentId },
    },
    include: {
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
    },
    take: 4,
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'منتج غير موجود | BloB.JO',
    }
  }

  return {
    title: `${product.name} | BloB.JO`,
    description: product.description || `اشترِ ${product.name} من BloB.JO - طباعة حسب الطلب في الأردن`,
    openGraph: {
      title: `${product.name} | BloB.JO`,
      description: product.description || `اشترِ ${product.name} من BloB.JO`,
      type: 'website',
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  }
}

// Generate JSON-LD structured data for product
function generateProductJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img: { url: string }) => img.url),
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'BloB.JO',
    },
    offers: {
      '@type': 'Offer',
      url: `https://blob.jo/products/${product.slug}`,
      priceCurrency: 'JOD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'BloB.JO',
      },
    },
    ...(product.category && {
      category: product.category.name,
    }),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  return (
    <>
      <Header />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductJsonLd(product)),
        }}
      />

      <main className="min-h-screen bg-background" dir="rtl">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                الرئيسية
              </Link>
              <ChevronLeft className="h-4 w-4" />
              <Link href="/products" className="hover:text-foreground transition-colors">
                المنتجات
              </Link>
              {product.category && (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <Link 
                    href={`/products?category=${product.category.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <ChevronLeft className="h-4 w-4" />
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <ProductImageGallery images={product.images} productName={product.name} />

              {/* Product Info */}
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {product.category && (
                    <Badge variant="secondary">{product.category.name}</Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-primary">مميز</Badge>
                  )}
                  {hasDiscount && (
                    <Badge variant="destructive">خصم {discountPercentage}%</Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {product.price.toFixed(2)} د.أ
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.compareAtPrice?.toFixed(2)} د.أ
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <AddToCartButton product={product} className="flex-1" />
                  
                  {product.allowCustomDesign && (
                    <Link href={`/designer?product=${product.slug}`} className="flex-1">
                      <Button variant="outline" size="lg" className="w-full gap-2">
                        <Palette className="h-5 w-5" />
                        صمم خاص بك
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">توصيل سريع</p>
                      <p className="text-xs text-muted-foreground">2-4 أيام عمل</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">جودة مضمونة</p>
                      <p className="text-xs text-muted-foreground">ضمان الجودة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">طباعة احترافية</p>
                      <p className="text-xs text-muted-foreground">ألوان ثابتة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-12">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">الوصف</TabsTrigger>
                  <TabsTrigger value="specifications">المواصفات</TabsTrigger>
                  <TabsTrigger value="shipping">الشحن</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description || 'لا يوجد وصف متاح لهذا المنتج.'}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="specifications" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• خامات عالية الجودة</li>
                        <li>• طباعة رقمية متقدمة</li>
                        <li>• ألوان ثابتة مقاومة للغسيل</li>
                        <li>• مقاسات متعددة متوفرة</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="shipping" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• التوصيل خلال 2-4 أيام عمل داخل عمّان</li>
                        <li>• التوصيل خلال 3-5 أيام عمل لباقي المحافظات</li>
                        <li>• توصيل مجاني للطلبات فوق 50 د.أ</li>
                        <li>• إمكانية الاستلام من الموقع</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">منتجات مشابهة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct: { id: string; name: string; slug: string; price: number; images: { url: string }[] }) => (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square bg-muted">
                        {relatedProduct.images[0] ? (
                          <Image
                            src={relatedProduct.images[0].url}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            📦
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-primary font-bold mt-1">
                          {relatedProduct.price.toFixed(2)} د.أ
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
