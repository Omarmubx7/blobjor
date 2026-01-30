"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Palette, Ruler, Truck, Smile, ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    id: "01",
    titleAr: "اختر التصميم",
    titleEn: "CHOOSE DESIGN",
    descriptionAr: "اختر من تصاميمنا الحصرية (أنمي، رياضة، مسلسلات) أو ارفع تصميمك الخاص.",
    icon: Palette,
  },
  {
    id: "02",
    titleAr: "اختر المقاس واللون",
    titleEn: "SIZE & COLOR",
    descriptionAr: "حدد المقاس واللون اللي بيناسب ستايلك من تشكيلتنا الواسعة.",
    icon: Ruler,
  },
  {
    id: "03",
    titleAr: "نطبع ونشحن",
    titleEn: "PRINT & SHIP",
    descriptionAr: "بنطبع طلبك بجودة عالية وبنشحنه إلك وين ما كنت بالأردن.",
    icon: Truck,
  },
  {
    id: "04",
    titleAr: "استلم طلبك",
    titleEn: "RECEIVE ORDER",
    descriptionAr: "الدفع عند الاستلام. استلم طلبك وعيش جوّك!",
    icon: Smile,
  },
]

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="how-it-works" className="relative bg-black py-20 border-t border-zinc-800">

      <div
        ref={ref}
        className={`relative mx-auto max-w-[1400px] px-4 transition-all duration-700 lg:px-8 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
      >
        {/* Section Header */}
        <div className="mb-20 grid lg:grid-cols-2 gap-8 items-end border-b border-zinc-800 pb-8">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase italic">
              HOW IT WORKS
            </h2>
            <p className="mt-4 text-xl text-zinc-400 font-medium">
              4 خطوات بسيطة تفصلك عن الستايل الجديد
            </p>
          </div>
          <div className="lg:text-left rtl:lg:text-left">
            <span className="inline-block px-4 py-2 border border-white text-white font-bold uppercase tracking-widest text-xs">
              SIMPLE PROCESS
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="absolute top-10 left-0 w-full h-px bg-zinc-800 hidden lg:block -z-0" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`group relative`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-black p-4 lg:p-0"> {/* Wrapper to cover line */}
                    {/* Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 group-hover:bg-white group-hover:text-black transition-all duration-300 flex items-center justify-center rounded-sm">
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      <span className="text-5xl font-black text-zinc-900 group-hover:text-white/20 transition-colors select-none italic">
                        {step.id}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">
                        {step.titleAr}
                      </h3>
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                        {step.titleEn}
                      </p>
                      <p className="text-sm text-zinc-400 leading-relaxed max-w-[250px]">
                        {step.descriptionAr}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/design-lab"
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black text-lg uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-sm"
          >
            <span>START DESIGNING</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
