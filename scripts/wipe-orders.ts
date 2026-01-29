
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.order.count()
    console.log(`Found ${count} orders. Deleting...`)

    await prisma.order.deleteMany({})

    console.log('✅ All orders deleted.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
