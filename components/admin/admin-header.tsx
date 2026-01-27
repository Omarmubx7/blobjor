'use client'

import { Bell, Search, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
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

export function AdminHeader({ admin }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 lg:px-6">
      {/* Spacer for mobile menu button */}
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
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">تبديل الوضع</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              فاتح
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              داكن
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              النظام
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-semibold text-sm">الإشعارات</span>
              <span className="text-xs text-muted-foreground">3 غير مقروءة</span>
            </div>
            <div className="py-2">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="px-4 py-3 cursor-pointer flex flex-col items-start gap-1">
                  <div className="flex w-full justify-between items-center">
                    <span className="font-medium text-sm">طلب جديد #ORDER-{2024000 + i}</span>
                    <span className="text-[10px] text-muted-foreground">منذ {i * 5} دقيقة</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    تم استلام طلب جديد بقيمة {10 + i * 5} د.أ
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary">
                عرض كل الإشعارات
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
