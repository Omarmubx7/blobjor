import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Verifying prices...');

    const hoodieCategory = await prisma.category.findUnique({
        where: { slug: 'hoodies' },
    });

    const mugCategory = await prisma.category.findUnique({
        where: { slug: 'mugs' },
    });

    if (hoodieCategory) {
        const hoodies = await prisma.product.findMany({
            where: { categoryId: hoodieCategory.id },
            take: 5,
        });
        console.log('--- Hoodies (Should be 15) ---');
        hoodies.forEach(p => console.log(`${p.name}: ${p.price}`));
    } else {
        console.log('❌ Hoodies category not found');
    }

    if (mugCategory) {
        const mugs = await prisma.product.findMany({
            where: { categoryId: mugCategory.id },
            take: 5,
        });
        console.log('--- Mugs (Should be unchanged) ---');
        mugs.forEach(p => console.log(`${p.name}: ${p.price}`));
    } else {
        console.log('❌ Mugs category not found');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
