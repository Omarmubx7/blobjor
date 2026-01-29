"use client"
import { Instagram, MessageCircle, ArrowUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-zinc-900">
      <div className="container-custom mx-auto px-6">

        {/* Top Section with Logo & Tagline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-heading font-black text-4xl uppercase tracking-tighter text-white">
              BLOBJOR.ME
            </Link>
            <p className="font-heading font-bold text-sm tracking-[0.2em] text-zinc-500 uppercase">
              BE BOLD. BE YOU. BE BLOBJOR.
            </p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/blob.jor" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a href="https://wa.me/962787257247" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
              <MessageCircle size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-zinc-900 pt-12">

          {/* Column 1: Products */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">المنتجات</h4>
            <div className="flex flex-col gap-3">
              <Link href="/#shop" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">هوديز</Link>
              <Link href="/#shop" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">أكواب</Link>
              <Link href="/#shop" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">تيشيرتات</Link>
              <Link href="/design-lab" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">تصميم خاص</Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">روابط سريعة</h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">الرئيسية</Link>
              <Link href="/track-order" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">تتبع الطلب</Link>
              <Link href="/size-charts" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">جدول المقاسات</Link>
              <Link href="/faq" className="text-sm font-bold text-white hover:text-zinc-400 transition-colors">الأسئلة الشائعة</Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">تواصل معنا</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-zinc-300">عمّان، الأردن</span>
              <span className="text-sm font-medium text-zinc-300" dir="ltr">+962 78 725 7247</span>
              <span className="text-sm font-medium text-zinc-300">info@blobjor.me</span>
            </div>
          </div>

          {/* Column 4: Newsletter (Simplified) */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">النشرة البريدية</h4>
            <p className="text-sm text-zinc-400">اشترك للحصول على آخر العروض والتصاميم الحصرية.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="بريدك الإلكتروني" className="bg-zinc-900 border-none text-white text-sm px-4 py-3 w-full focus:ring-1 focus:ring-white" />
              <button className="bg-white text-black text-sm font-bold uppercase px-4 py-3 hover:bg-gray-200">اشترك</button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-zinc-900">
          <p className="text-xs text-zinc-600 font-medium">
            © 2025 blobjor.me · صُنع في الأردن 🇯🇴
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">الشروط والأحكام</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
