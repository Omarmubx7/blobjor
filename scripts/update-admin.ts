
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
    const currentEmail = process.argv[2]
    const newEmail = process.argv[3]
    const newPassword = process.argv[4]

    if (!currentEmail || !newEmail || !newPassword) {
        console.error('Usage: npx tsx scripts/update-admin.ts <current-email> <new-email> <new-password>')
        process.exit(1)
    }

    console.log(`Finding admin: ${currentEmail}...`)

    const admin = await prisma.adminUser.findUnique({
        where: { email: currentEmail },
    })

    if (!admin) {
        console.error(`❌ Admin user with email "${currentEmail}" not found.`)
        process.exit(1)
    }

    console.log(`Updating credentials...`)
    console.log(`New Email: ${newEmail}`)

    const passwordHash = await hash(newPassword, 12)

    await prisma.adminUser.update({
        where: { email: currentEmail },
        data: {
            email: newEmail,
            passwordHash,
        },
    })

    console.log(`✅ Admin credentials successfully updated!`)
    console.log(`Login with: ${newEmail}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
