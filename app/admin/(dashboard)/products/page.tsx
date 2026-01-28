import { Suspense } from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search, Filter, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function ProductsTable() {
  const products = await getProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">لا توجد منتجات حتى الآن</p>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة أول منتج
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-right font-medium">المنتج</th>
              <th className="p-4 text-right font-medium">التصنيف</th>
              <th className="p-4 text-right font-medium">السعر</th>
              <th className="p-4 text-right font-medium">الحالة</th>
              <th className="p-4 text-right font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          📦
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.description?.slice(0, 50)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {product.category ? (
                    <Badge variant="secondary">{product.category.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="font-medium">{product.price.toFixed(2)} د.أ</span>
                </td>
                <td className="p-4">
                  <Badge
                    variant={product.isActive ? 'default' : 'secondary'}
                    className={product.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                  >
                    {product.isActive ? 'منشور' : 'مسودة'}
                  </Badge>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Eye className="ml-2 h-4 w-4" />
                          معاينة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="ml-2 h-4 w-4" />
                          تعديل
                        </Link>
                      </DropdownMenuItem>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProductsTableSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <p className="text-muted-foreground">إدارة منتجات المتجر</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة منتج
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث في المنتجات..." className="pr-10" />
        </div>
        <Button variant="outline">
          <Filter className="ml-2 h-4 w-4" />
          تصفية
        </Button>
      </div>

      {/* Products Table */}
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable />
      </Suspense>
    </div>
  )
}
