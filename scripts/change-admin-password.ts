
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
    const email = process.argv[2]
    const newPassword = process.argv[3]

    if (!email || !newPassword) {
        console.error('Usage: npx tsx scripts/change-admin-password.ts <email> <new-password>')
        process.exit(1)
    }

    console.log(`Updating password for admin: ${email}...`)

    // 1. Check if user exists
    const admin = await prisma.adminUser.findUnique({
        where: { email },
    })

    if (!admin) {
        console.error(`❌ Admin user with email "${email}" not found.`)
        process.exit(1)
    }

    // 2. Hash new password
    const passwordHash = await hash(newPassword, 12)

    // 3. Update password
    await prisma.adminUser.update({
        where: { email },
        data: { passwordHash },
    })

    console.log(`✅ Password successfully changed for ${email}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
