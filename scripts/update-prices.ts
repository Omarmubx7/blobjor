import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting price update for Hoodies...');

    const hoodieCategory = await prisma.category.findUnique({
        where: { slug: 'hoodies' },
    });

    if (!hoodieCategory) {
        console.error('❌ Hoodies category not found!');
        return;
    }

    const result = await prisma.product.updateMany({
        where: {
            categoryId: hoodieCategory.id,
        },
        data: {
            price: 15,
        },
    });

    console.log(`✅ Updated ${result.count} hoodie products to 15 JOD.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
