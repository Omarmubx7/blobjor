'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, LogOut, User as UserIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface UserMenuProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    iconOnly?: boolean
}

export function UserMenu({ user, iconOnly }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!user) {
        if (iconOnly) {
            return (
                <Link href="/login" className="hover:opacity-70 transition-opacity">
                    <UserIcon size={22} strokeWidth={1.5} />
                </Link>
            )
        }
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/login"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                    دخول
                </Link>
                <span className="text-muted-foreground/30">|</span>
                <Link
                    href="/signup"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                    جديد
                </Link>
            </div>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center transition-all ${iconOnly
                        ? 'hover:opacity-70'
                        : 'h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
            >
                {iconOnly ? (
                    <UserIcon size={22} strokeWidth={1.5} />
                ) : (
                    <span className="font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-border z-50 overflow-hidden text-right animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 border-b border-border bg-muted/30">
                            <p className="text-sm font-bold truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>

                        <div className="p-1">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 w-full p-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <UserIcon size={16} />
                                <span>حسابي</span>
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blobjor.me' })}
                                className="flex items-center gap-2 w-full p-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                <span>تسجيل خروج</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
