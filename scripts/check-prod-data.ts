
import prisma from '../lib/prisma'

async function main() {
    console.log('Checking production database...')
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()
    const products = await prisma.product.findMany({
        take: 3,
        select: { name: true, slug: true }
    })

    console.log(`Products: ${productCount}`)
    console.log(`Categories: ${categoryCount}`)
    console.log('Sample Products:', products)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
