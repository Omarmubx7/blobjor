"use client"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface HeroProps {
  content?: {
    title?: string | null
    subtitle?: string | null
  } | null
}

export function Hero({ content }: HeroProps) {

  const handleScrollToShop = () => {
    const element = document.querySelector("#shop")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image - Lifestyle/Athletic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for text contrast */}
        {/* Placeholder for High-Res Lifestyle Image */}
        <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
          {/* TODO: Replace with actual User Uploaded Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl animate-fade-in-up">

          {/* Main Headline - Massive & Bold */}
          <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.9] tracking-tighter mb-6 text-white text-right" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <span className="block text-4xl md:text-6xl lg:text-7xl mb-2 text-gray-300 font-extrabold">
              DESIGN IT. WEAR IT. OWN IT
            </span>
            BE BOLD. BE YOU.
          </h1>

          {/* Subtitle */}
          <p className="font-body text-xl md:text-2xl text-gray-200 font-medium mb-10 max-w-2xl ml-auto text-right" dir="rtl">
            تصاميمك وهودياتك بتوصل لكل مكان بالأردن. عبر عن حالك بستايلك الخاص.
          </p>

          {/* CTA Buttons - Athletic Style */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end items-end sm:items-center">
            <button
              onClick={() => {
                const element = document.querySelector("#shop")
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
              className="group btn-secondary border-white text-white hover:bg-white hover:text-black py-4 px-10 text-lg uppercase tracking-widest"
            >
              <span>تصفح المنتجات</span>
            </button>
            <button
              onClick={() => window.location.href = "/design-lab"}
              className="group btn-primary bg-white text-black hover:bg-gray-200 hover:text-black hover:scale-105 py-4 px-12 text-xl uppercase tracking-widest flex items-center gap-3"
            >
              <span>ابدأ التصميم</span>
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

