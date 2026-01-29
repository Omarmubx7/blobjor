"use client"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingBag, Search, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { UserMenu } from "@/components/auth/user-menu"
import { SearchBar } from "@/components/search-bar"

interface NavLink {
  href: string
  label: string
  isPage?: boolean
}

const navLinks: NavLink[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/#shop", label: "منتجاتنا" },
  { href: "/#how-it-works", label: "كيف يعمل" },
  { href: "/design-lab", label: "صمم منتجك", isPage: true },
]

export function Header({ user }: { user?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { totalItems, setIsCartOpen } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) element.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(href)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
            ? "bg-black border-zinc-800 py-3"
            : "bg-white border-transparent py-5"
          }`}
      >
        <div className="container-custom mx-auto flex items-center justify-between">

          {/* Right Section (Icons) - RTL Left */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative group ${isScrolled ? 'text-white' : 'text-black'}`}
            >
              <ShoppingBag strokeWidth={1.5} size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`hidden md:block ${isScrolled ? 'text-white' : 'text-black'}`}
            >
              <Search strokeWidth={1.5} size={24} />
            </button>

            {/* User */}
            <div className={isScrolled ? 'text-white' : 'text-black'}>
              <UserMenu user={user} iconOnly />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden ${isScrolled ? 'text-white' : 'text-black'}`}
            >
              {isMenuOpen ? <X strokeWidth={1.5} size={24} /> : <Menu strokeWidth={1.5} size={24} />}
            </button>
          </div>


          {/* Center Section (Navigation) - Hidden on Mobile */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-wide transition-colors ${isScrolled
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-black"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Left Section (Logo) - RTL Right */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col items-end">
              <span className={`font-heading font-black text-2xl tracking-tighter uppercase leading-none ${isScrolled ? 'text-white' : 'text-black'}`}>
                BLOBJOR
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                Print On Demand
              </span>
            </div>
            {/* Optional: Add Logo Icon Here if desired */}
          </Link>

        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 shadow-xl animate-fade-in-down">
            <div className="max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </div>
        )}

      </header>

      {/* Mobile Menu Drawer (Black High-Contrast) */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-transform duration-500 md:hidden flex flex-col pt-32 px-8 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <nav className="flex flex-col gap-8 text-right">
          {navLinks.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-black text-white uppercase tracking-tight animate-fade-in-right"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/20 my-4" />
          <Link href="/track-order" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-gray-400">
            تتبع طلبك
          </Link>
          <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-gray-400">
            حسابي
          </Link>
        </nav>
      </div>
    </>
  )
}
