import { NextResponse } from 'next/server'
import { getAdminFromSession } from '@/lib/auth'

export async function GET() {
  try {
    const admin = await getAdminFromSession()
    
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Get admin error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    )
  }
}
