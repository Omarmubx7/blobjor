"use client"

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'

interface MainLayoutProps {
    children: React.ReactNode
    user: any
}

export function MainLayout({ children, user }: MainLayoutProps) {
    const pathname = usePathname()
    // Check if current path is an admin route
    const isAdmin = pathname?.startsWith('/admin')

    return (
        <>
            {!isAdmin && <Header user={user} />}
            {children}
            {!isAdmin && <Footer />}
            {!isAdmin && <CartDrawer />}
        </>
    )
}
