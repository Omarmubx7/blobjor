
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'
import prisma from '@/lib/prisma'

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
        },
    })

    if (!product) {
        return null
    }

    return product
}

async function getCategories() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' },
    })
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [product, categories] = await Promise.all([
        getProduct(id),
        getCategories(),
    ])

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">تعديل المنتج</h1>
                <p className="text-muted-foreground">تعديل بيانات المنتج: {product.name}</p>
            </div>

            <ProductForm
                categories={categories}
                product={product}
            />
        </div>
    )
}
