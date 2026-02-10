import { NextResponse } from 'next/server'
import { loginAdmin } from '@/lib/auth'
import { rateLimit } from '@/lib/limit'

export async function POST(request: Request) {
  try {
    // IP-based rate limiting: 10 attempts per 15 minutes
    const isAllowed = await rateLimit(10, 15 * 60 * 1000)
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'تم تجاوز الحد المسموح به من المحاولات. يرجى المحاولة لاحقاً.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    const result = await loginAdmin(email, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: result.admin,
    })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
