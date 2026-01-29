"use client"

import { useState, useEffect } from "react"
import { Menu, X, ShoppingBag, Instagram, MessageCircle, Sparkles, Package, Palette } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { UserMenu } from "@/components/auth/user-menu"
import { SearchBar } from "@/components/search-bar"

interface NavLink {
  href: string
  label: string
  labelEn: string
  isPage?: boolean
}

const navLinks: NavLink[] = [
  { href: "#hero", label: "الرئيسية", labelEn: "Home" },
  { href: "#shop", label: "منتجاتنا", labelEn: "Products" },
  { href: "#how-it-works", label: "كيف يعمل", labelEn: "How It Works" },
  { href: "/design-lab", label: "صمم منتجك", labelEn: "Design Lab", isPage: true },
  { href: "#contact", label: "اتصل", labelEn: "Contact" },
]

export function Header({ user }: { user?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#hero")
  const { totalItems, setIsCartOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position (only hash-based links)
      const sections = navLinks.filter(link => link.href.startsWith("#")).map(link => link.href)
      for (const section of sections.reverse()) {
        const element = document.querySelector(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const router = useRouter()
  const pathname = usePathname()

  const handleNavClick = (href: string, isPage?: boolean) => {
    setIsMenuOpen(false)

    if (isPage) {
      if (href.startsWith('http')) {
        window.open(href, '_blank')
      } else {
        router.push(href)
      }
      return
    }

    if (href.startsWith("#")) {
      if (pathname === "/") {
        // We are on home page, scroll to section
        setActiveSection(href)
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // We are not on home page, navigate to home with hash
        router.push(`/${href}`)
      }
    } else {
      router.push(href)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo - Right Side (RTL) */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
          className="flex items-center gap-3 group"
        >
          <Image
            src="/Bloblogo.png"
            alt="BloB Logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
          />
          <div className="flex flex-col">
            <span className={`font-sans text-2xl font-black tracking-tight transition-colors ${isScrolled ? "text-foreground" : "text-foreground"
              }`}>
              blobjor.me
            </span>
            <span className={`text-[10px] font-medium tracking-wider transition-colors ${isScrolled ? "text-muted-foreground" : "text-muted-foreground"
              }`}>
              PRINT ON DEMAND
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.isPage ? (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={`relative flex items-center gap-1 rounded-full px-5 py-2.5 font-body text-sm font-medium transition-all duration-300 ${isScrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-foreground hover:bg-foreground/10"
                  }`}
              >
                <Palette size={14} className="text-accent" />
                {link.label}
              </Link>
            ) : (
              <button
                key={`${link.href}-${link.label}`}
                onClick={() => handleNavClick(link.href)}
                className={`relative rounded-full px-5 py-2.5 font-body text-sm font-medium transition-all duration-300 ${activeSection === link.href
                  ? "bg-primary text-primary-foreground"
                  : isScrolled
                    ? "text-foreground hover:bg-muted"
                    : "text-foreground hover:bg-foreground/10"
                  }`}
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Desktop Actions - Left Side (RTL) */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Search Bar */}
          <SearchBar />

          {/* Track Order Button */}
          <Link
            href="/track-order"
            className={`flex h-10 items-center gap-2 rounded-full px-4 transition-all ${isScrolled
              ? "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
              : "bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
          >
            <Package size={16} />
            <span className="text-sm font-medium">تتبع طلبك</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${isScrolled
              ? "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
              : "bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            aria-label="سلة التسوق"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </button>

          {/* Social Icons */}
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <a
              href="https://wa.me/962787257247"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${isScrolled
                ? "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                : "bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href="https://instagram.com/blob.jor"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${isScrolled
                ? "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                : "bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleNavClick("#shop")}
            className="btn-primary"
          >
            <Sparkles size={16} />
            اطلب الآن
          </button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* User Menu */}
          <UserMenu user={user} />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-xl transition-all lg:hidden ${isMenuOpen
            ? "bg-primary text-primary-foreground"
            : isScrolled
              ? "bg-muted text-foreground"
              : "bg-foreground/10 text-foreground"
            }`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-all duration-500 lg:hidden ${isMenuOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
          }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }} className="flex items-center gap-3">
            <Image src="/Bloblogo.png" alt="BloB Logo" width={48} height={48} className="h-12 w-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-sans text-2xl font-black tracking-tight text-foreground">blobjor.me</span>
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground">PRINT ON DEMAND</span>
            </div>
          </a>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col p-6">
          <div className="mb-6">
            <SearchBar />
          </div>
          {navLinks.map((link, index) =>
            link.isPage ? (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between border-b border-border py-5 transition-all animate-fade-in-up text-foreground"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-sans text-2xl font-bold flex items-center gap-2">
                  <Palette size={20} className="text-accent" />
                  {link.label}
                </span>
                <span className="font-body text-sm text-muted-foreground">{link.labelEn}</span>
              </Link>
            ) : (
              <button
                key={`${link.href}-${link.label}`}
                onClick={() => handleNavClick(link.href)}
                className={`flex items-center justify-between border-b border-border py-5 transition-all animate-fade-in-up ${activeSection === link.href
                  ? "text-primary"
                  : "text-foreground"
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-sans text-2xl font-bold">{link.label}</span>
                <span className="font-body text-sm text-muted-foreground">{link.labelEn}</span>
              </button>
            )
          )}
        </nav>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-muted/50 p-6">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => handleNavClick("#shop")}
              className="flex-1 btn-primary py-4 text-base justify-center"
            >
              <Sparkles size={18} />
              اطلب الآن
            </button>
            <Link
              href="/track-order"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-background border border-border px-4 py-4 text-foreground transition-all hover:bg-muted"
            >
              <Package size={18} />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://wa.me/962787257247"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle size={22} />
            </a>
            <a
              href="https://instagram.com/blob.jor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
// Forced Update
