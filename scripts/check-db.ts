
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const adminCount = await prisma.adminUser.count();

        if (adminCount > 0) {
            console.log("VERIFICATION_SUCCESS: Admin User Found");
        } else {
            console.log("VERIFICATION_FAILURE: No Admin User");
        }
    } catch (e) {
        console.error("VERIFICATION_ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
