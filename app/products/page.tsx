import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShoppingCart, Palette, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'المنتجات | BloB.JO',
  description: 'تصفح مجموعتنا من المنتجات عالية الجودة للطباعة حسب الطلب - هوديز، تيشيرتات، أكواب وأكثر',
  openGraph: {
    title: 'المنتجات | BloB.JO',
    description: 'تصفح مجموعتنا من المنتجات عالية الجودة للطباعة حسب الطلب',
    type: 'website',
  },
}

async function getProducts(categorySlug?: string, searchQuery?: string) {
  const whereClause: Record<string, unknown> = {
    isActive: true,
  }

  if (categorySlug) {
    whereClause.category = { slug: categorySlug }
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery } }, // SQLite is case-insensitive by default for LIKE usually, but explicitly: mode: 'insensitive' is safer for Postgres later
      { description: { contains: searchQuery } },
      { nameAr: { contains: searchQuery } },
    ]
  }

  return prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

function ProductCard({ product }: { product: Awaited<ReturnType<typeof getProducts>>[0] }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📦
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge className="bg-primary">مميز</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">خصم</Badge>
            )}
            {product.allowCustomDesign && (
              <Badge variant="secondary" className="gap-1">
                <Palette className="h-3 w-3" />
                قابل للتصميم
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {product.category && (
            <p className="text-xs text-muted-foreground mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                {product.price.toFixed(2)} د.أ
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.compareAtPrice?.toFixed(2)} د.أ
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

async function ProductsGrid({ categorySlug, searchQuery }: { categorySlug?: string, searchQuery?: string }) {
  const products = await getProducts(categorySlug, searchQuery)

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg mb-4">
          لا توجد منتجات مطابقة لبحثك
        </p>
        <Link href="/products">
          <Button variant="outline">مسح البحث</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}


function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-20" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string, search?: string }>
}) {
  const { category, search } = await searchParams
  const categories = await getCategories()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background" dir="rtl">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              منتجاتنا
            </h1>
            <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
              اكتشف مجموعتنا المتنوعة من المنتجات عالية الجودة
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Categories Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Link href="/products">
                  <Badge
                    variant={!category ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    الكل
                  </Badge>
                </Link>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                    <Badge
                      variant={category === cat.slug ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Products Grid */}
            <Suspense fallback={<ProductsSkeleton />}>
              <ProductsGrid categorySlug={category} searchQuery={search} />
            </Suspense>
          </div>
        </section >

        {/* CTA Section */}
        < section className="py-16 bg-muted/50" >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">لديك تصميم خاص؟</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              استخدم أداة التصميم المخصص لإنشاء منتجك الفريد
            </p>
            <Link href="/designer">
              <Button size="lg" className="gap-2">
                <Palette className="h-5 w-5" />
                ابدأ التصميم الآن
              </Button>
            </Link>
          </div>
        </section >
      </main >
      <Footer />
    </>
  )
}
