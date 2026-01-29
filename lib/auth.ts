import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'
import prisma from './prisma'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

export const COOKIE_NAME = 'blob-admin-session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

export interface AdminPayload {
  id: string
  email: string
  name: string
  role: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create JWT token
export async function createToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload } as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AdminPayload
  } catch {
    return null
  }
}

// Login admin
export async function loginAdmin(email: string, password: string): Promise<{
  success: boolean
  error?: string
  admin?: AdminPayload
}> {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!admin) {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }

    if (!admin.isActive) {
      return { success: false, error: 'الحساب غير مفعل' }
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000)
      return {
        success: false,
        error: `الحساب مقفل مؤقتاً بسبب تكرار محاولات الدخول الخاطئة. يرجى المحاولة بعد ${minutesLeft} دقيقة.`
      }
    }

    const isValid = await verifyPassword(password, admin.passwordHash)

    if (!isValid) {
      // Increment failed attempts
      const failedAttempts = admin.failedAttempts + 1
      let lockedUntil = null

      // Lock if 5 attempts reached
      if (failedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }

      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          failedAttempts,
          lockedUntil
        },
      })

      if (lockedUntil) {
        return { success: false, error: 'تم قفل الحساب لمدة 15 دقيقة بسبب تكرار المحاولات الخاطئة' }
      }

      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }

    // Reset failed attempts and update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        failedAttempts: 0,
        lockedUntil: null
      },
    })

    const payload: AdminPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    }

    const token = await createToken(payload)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
      path: '/',
    })

    return { success: true, admin: payload }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' }
  }
}

// Logout admin
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// Get current admin from session
export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    return await verifyToken(token)
  } catch {
    return null
  }
}

// Check if admin is authenticated (for middleware/API routes)
export async function isAuthenticated(): Promise<boolean> {
  const admin = await getCurrentAdmin()
  return admin !== null
}

// Check if admin has specific role
export async function hasRole(requiredRole: string): Promise<boolean> {
  const admin = await getCurrentAdmin()
  if (!admin) return false

  if (admin.role === 'super_admin') return true
  return admin.role === requiredRole
}

// Verify session from middleware request
export async function verifySession(request: NextRequest): Promise<AdminPayload | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    return await verifyToken(token)
  } catch {
    return null
  }
}

// Alias for backwards compatibility
export const getAdminFromSession = getCurrentAdmin

// Create initial admin (for seeding)
export async function createInitialAdmin() {
  const existingAdmin = await prisma.adminUser.findFirst()
  if (existingAdmin) {
    console.log('Admin already exists')
    return
  }

  const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'
  const passwordHash = await hashPassword(password)

  await prisma.adminUser.create({
    data: {
      email: 'admin@blob.jo',
      passwordHash,
      name: 'مدير النظام',
      role: 'super_admin',
      isActive: true,
    },
  })

  console.log('Initial admin created: admin@blob.jo')
}
