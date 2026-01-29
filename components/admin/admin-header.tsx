'use client'

import { Bell, Search, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import type { AdminPayload } from '@/lib/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AdminHeaderProps {
  admin: AdminPayload
}

interface OrderNotification {
  id: string
  totalPrice: number
  createdAt: string
  customerName: string | null
}

export function AdminHeader({ admin }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  // Helper to format time diff (simple version to avoid heavy lib for now or use date-fns if preferred)
  const getTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000)
    if (diff < 1) return 'الآن'
    if (diff < 60) return `منذ ${diff} دقيقة`
    const hours = Math.floor(diff / 60)
    if (hours < 24) return `منذ ${hours} ساعة`
    return new Date(dateStr).toLocaleDateString('ar-JO')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 lg:px-6">
      <div className="w-10 lg:hidden" />

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث..."
            className="pr-10 bg-muted/50 border-0"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">تبديل الوضع</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>فاتح</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>داكن</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>النظام</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '+9' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-semibold text-sm">الإشعارات</span>
              <span className="text-xs text-muted-foreground">{unreadCount} طلبات معلقة</span>
            </div>
            <div className="py-2 max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  لا توجد إشعارات جديدة
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="px-4 py-3 cursor-pointer flex flex-col items-start gap-1 focus:bg-muted/50">
                    <div className="flex w-full justify-between items-center">
                      <span className="font-medium text-sm">طلب جديد #{n.id.slice(-6)}</span>
                      <span className="text-[10px] text-muted-foreground">{getTimeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      من {n.customerName || 'عميل'} • {n.totalPrice} د.أ
                    </p>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary" asChild>
                <a href="/admin/orders">عرض كل الطلبات</a>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
