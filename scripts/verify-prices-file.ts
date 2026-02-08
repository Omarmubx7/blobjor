import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    let output = '🔍 Verifying prices...\n';

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
        output += '\n--- Hoodies (Should be 15) ---\n';
        hoodies.forEach(p => output += `${p.name}: ${p.price}\n`);
    } else {
        output += '❌ Hoodies category not found\n';
    }

    if (mugCategory) {
        const mugs = await prisma.product.findMany({
            where: { categoryId: mugCategory.id },
            take: 5,
        });
        output += '\n--- Mugs (Should be unchanged) ---\n';
        mugs.forEach(p => output += `${p.name}: ${p.price}\n`);
    } else {
        output += '❌ Mugs category not found\n';
    }

    fs.writeFileSync('verification.txt', output);
    console.log('Verification written to verification.txt');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
