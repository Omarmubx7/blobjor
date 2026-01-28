
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Fetching all products...");
        const products = await prisma.product.findMany({
            where: { isActive: true },
            include: {
                category: true,
            },
            orderBy: { categoryId: 'asc' }
        })

        console.log(`\n✅ Total Products Found: ${products.length}\n`);

        const byCategory: Record<string, string[]> = {};

        products.forEach(p => {
            const cat = p.category?.name || 'Uncategorized';
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(p.name);
        });

        for (const [cat, names] of Object.entries(byCategory)) {
            console.log(`📂 ${cat} (${names.length}):`);
            names.forEach(n => console.log(`   - ${n}`));
            console.log("");
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
