'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { AdminPayload } from '@/lib/auth'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  FileImage,
  Settings,
  Home,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminSidebarProps {
  admin: AdminPayload
}

const navigation = [
  // Admin Navigation Links
  { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { name: 'المنتجات', href: '/admin/products', icon: Package },
  { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCart },
  // { name: 'الصفحة الرئيسية', href: '/admin/homepage', icon: Home }, // TODO: Create this page
  // { name: 'الإعدادات', href: '/admin/settings', icon: Settings }, // TODO: Create this page
]

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-border/50 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">BloB</span>
          <span className="text-sm text-muted-foreground">لوحة التحكم</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{admin.name}</p>
            <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </Button>

        {/* Back to Store */}
        <Link
          href="/"
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          العودة للمتجر
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 right-3 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-40 flex w-64 flex-col bg-card border-l border-border transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 right-0 hidden w-64 flex-col bg-card border-l border-border lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
