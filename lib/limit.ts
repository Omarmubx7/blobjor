import { headers } from 'next/headers'

const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export async function rateLimit(limit: number = 5, windowMs: number = 60 * 1000) {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'

    if (ip === 'unknown') return true // Skip if IP can't be determined (dev env sometimes)

    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (!record) {
        rateLimitMap.set(ip, { count: 1, lastReset: now })
        return true
    }

    if (now - record.lastReset > windowMs) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, lastReset: now })
        return true
    }

    if (record.count >= limit) {
        return false // Rate limit exceeded
    }

    record.count += 1
    return true
}
