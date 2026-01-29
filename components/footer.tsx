"use client"

import { Instagram, MessageCircle, Mail, MapPin, Phone, ArrowUp, Heart } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  quickLinks: [
    { href: "#hero", label: "الرئيسية", labelEn: "Home" },
    { href: "#shop", label: "منتجاتنا", labelEn: "Products" },
    { href: "/design-lab", label: "تصميم مخصص", labelEn: "Custom Design" },
    { href: "/size-charts", label: "جدول المقاسات", labelEn: "Size Guide" },
    { href: "#faq", label: "الأسئلة الشائعة", labelEn: "FAQ" },
  ],
  products: [
    { href: "#shop", label: "هوديز", labelEn: "Hoodies" },
    { href: "#shop", label: "أكواب", labelEn: "Mugs" },
    { href: "/design-lab", label: "تصميم خاص", labelEn: "Custom" },
  ],
  legal: [
    { href: "#", label: "سياسة الخصوصية" },
    { href: "#", label: "الشروط والأحكام" },
    { href: "#", label: "سياسة الاسترجاع" },
  ],
}

export function Footer() {
  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-foreground text-primary-foreground">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-[1400px] px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }} className="inline-flex items-center gap-3 group">
              <Image
                src="/Bloblogo.png"
                alt="BloB Logo"
                width={56}
                height={56}
                className="h-14 w-14 object-contain transition-transform group-hover:scale-110"
              />
              <div className="flex flex-col">
                <span className="font-sans text-3xl font-black text-primary-foreground">
                  blobjor.me
                </span>
                <span className="text-xs font-medium tracking-wider text-primary-foreground/60">
                  PRINT ON DEMAND
                </span>
              </div>
            </a>
            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-primary-foreground/70">
              طباعة حسب الطلب - حول أفكارك لواقع. جودة عالية، توصيل سريع، أسعار مناسبة.
            </p>
            <p className="mt-2 font-body text-sm font-semibold text-accent">
              BE BOLD. BE YOU. BE BLOBJOR.ME
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com/blob.jor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground transition-all hover:bg-primary hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/962787257247"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground transition-all hover:bg-green-500 hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground">
              روابط سريعة
            </h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="group flex items-center gap-2 font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <span className="h-px w-0 bg-accent transition-all group-hover:w-4" />
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-6 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground">
              منتجاتنا
            </h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.products.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="group flex items-center gap-2 font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <span className="h-px w-0 bg-accent transition-all group-hover:w-4" />
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground">
              تواصل معنا
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/962787257247"
                className="flex items-center gap-3 font-body text-sm text-primary-foreground/70 transition-colors hover:text-accent"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Phone size={18} />
                </div>
                <span dir="ltr">+962 78 725 7247</span>
              </a>

              <div className="flex items-center gap-3 font-body text-sm text-primary-foreground/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <MapPin size={18} />
                </div>
                عمّان، الأردن
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://instagram.com/blob.jor"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
            >
              <Instagram size={18} />
              تابعنا على Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-6 lg:flex-row lg:px-8">
          <p className="flex items-center gap-1 font-body text-xs text-primary-foreground/50">
            صُنع بـ <Heart size={14} className="text-destructive fill-destructive" /> في الأردن © 2025 blobjor.me
          </p>

          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-xs text-primary-foreground/50 transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all hover:bg-accent hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  )
}
