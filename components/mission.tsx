"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Instagram, MessageCircle, Mail } from "lucide-react"

export function Mission() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="contact" className="relative section-light py-16 lg:py-24 section-divider-top">
      <div
        ref={ref}
        className={`mx-auto max-w-[1400px] px-4 transition-all duration-700 lg:px-8 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Mission Content */}
          <div>
            <span className="mb-2 block font-body text-sm font-medium text-accent">
              OUR MISSION
            </span>
            <h2 className="mb-6 font-sans text-3xl font-black tracking-tight text-foreground lg:text-4xl">
              رسالتنا
            </h2>
            <p className="mb-6 font-body text-lg leading-relaxed text-foreground">
              مهمتنا بسيطة: نخلي أفكارك حقيقة.
            </p>
            <p className="font-body text-base leading-relaxed text-muted-foreground">
              نؤمن إنو كل شخص عنده قصة يحكيها وستايل يعبر فيه عن نفسه. We believe everyone has a story to tell and a unique style to express.
            </p>

            {/* Brand Voice */}
            <div className="mt-8 rounded-xl bg-foreground p-6">
              <p className="font-sans text-xl font-black text-primary-foreground lg:text-2xl">
                BE BOLD. BE YOU. BE BLOB.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col justify-center">
            <span className="mb-2 font-body text-xs font-medium text-accent uppercase tracking-widest">
              CONTACT US
            </span>
            <h3 className="mb-6 font-sans text-2xl font-bold text-foreground">
              تواصل معنا
            </h3>

            <div className="space-y-4">
              <a
                href="https://instagram.com/blob.jor"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-pink-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 transition-transform group-hover:scale-110">
                  <Instagram size={22} className="text-white" />
                </div>
                <div>
                  <span className="block font-sans text-base font-bold text-foreground">Instagram</span>
                  <span className="font-body text-sm text-muted-foreground">@blob.jor</span>
                </div>
              </a>

              <a
                href="https://wa.me/962787257247"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-green-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 transition-transform group-hover:scale-110">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <span className="block font-sans text-base font-bold text-foreground">WhatsApp</span>
                  <span className="font-body text-sm text-muted-foreground">+962 78 725 7247</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
