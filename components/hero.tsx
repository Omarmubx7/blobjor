"use client"

import Image from "next/image"
import { Rocket, Sparkles, Truck, BadgePercent, ChevronDown, Star } from "lucide-react"
import { useEffect, useState } from "react"

// Force rebuild

interface HeroProps {
  content?: {
    title?: string | null
    subtitle?: string | null
  } | null
}

export function Hero({ content }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleScrollToShop = () => {
    const element = document.querySelector("#shop")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleScrollToCustom = () => {
    window.location.href = "/design-lab"
  }

  const defaultTitle = (
    <>
      <span className="block text-foreground mb-2">Sports & Anime Hoodies</span>
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
        for fans, gamers, and athletes
      </span>
    </>
  )

  const defaultSubtitle = "Sports & Anime Streetwear for Jordan and the Middle East"

  return (
    <section id="hero" className="relative min-h-[90vh] overflow-hidden bg-background pt-24 lg:pt-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-full max-w-7xl">
          <div className="absolute top-20 right-0 h-[500px] w-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-accent/5 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      </div>

      <div className="container-custom relative flex flex-col items-center justify-center text-center">

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto mb-12 animate-fade-in-up">

          {/* Headlines */}
          <h1 className="font-sans font-black text-4xl md:text-7xl lg:text-8xl leading-tight mb-6">
            {content?.title ? (
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {content.title}
              </span>
            ) : defaultTitle}
          </h1>

          <p className="font-sans text-lg md:text-2xl font-bold uppercase tracking-widest text-muted-foreground mb-10">
            {content?.subtitle || defaultSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleScrollToShop}
              className="btn-primary py-4 px-10 text-lg group w-full sm:w-auto"
            >
              <Rocket size={20} className="group-hover:-translate-y-1 transition-transform" />
              اطلب الآن
            </button>
            <button
              onClick={handleScrollToCustom}
              className="btn-secondary py-4 px-10 text-lg w-full sm:w-auto hover:border-primary hover:text-primary"
            >
              <Sparkles size={20} />
              صمّم هوديتك
            </button>
          </div>

        </div>



      </div>
    </section>
  )
}

