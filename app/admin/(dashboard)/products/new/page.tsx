import { ProductForm } from '@/components/admin/product-form'
import prisma from '@/lib/prisma'

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إضافة منتج جديد</h1>
        <p className="text-muted-foreground">أضف منتج جديد إلى المتجر</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
