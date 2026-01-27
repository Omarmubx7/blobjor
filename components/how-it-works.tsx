"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Palette, Package, CheckCircle2, Ruler, Truck, Smile, Sparkles } from "lucide-react"

const steps = [
  {
    id: "01",
    titleAr: "اختر التصميم",
    titleEn: "Choose Design",
    descriptionAr: "تصفح مجموعتنا المميزة من تصاميم الأنمي والرياضة أو صمم الخاص بك.",
    features: ["مئات التصاميم", "فن أصلي"],
    icon: Palette,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    iconBg: "bg-blue-500",
  },
  {
    id: "02",
    titleAr: "اختر المقاس واللون",
    titleEn: "Size & Color",
    descriptionAr: "حدد المقاس المناسب واللون اللي يعجبك من خياراتنا المتنوعة.",
    features: ["جميع المقاسات", "ألوان متعددة"],
    icon: Ruler,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    iconBg: "bg-purple-500",
  },
  {
    id: "03",
    titleAr: "نطبع ونشحن",
    titleEn: "Print & Ship",
    descriptionAr: "بنطبع طلبك بأحدث التقنيات وبنشحنه إلك بأسرع وقت.",
    features: ["جودة عالية", "شحن سريع"],
    icon: Truck,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-500/10",
    iconBg: "bg-orange-500",
  },
  {
    id: "04",
    titleAr: "استلم طلبك",
    titleEn: "Receive Order",
    descriptionAr: "استلم شحنتك واستمتع بمنتجك الجديد المميز من BloB.",
    features: ["تغليف مميز", "دفع عند الاستلام"],
    icon: Smile,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    iconBg: "bg-green-500",
  },
]

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`relative mx-auto max-w-[1400px] px-4 transition-all duration-700 lg:px-8 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
      >
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="badge badge-accent mb-4">
            <Sparkles size={12} />
            HOW IT WORKS
          </span>
          <h2 className="font-sans text-3xl font-black tracking-tight text-foreground lg:text-5xl">
            كيف تطلب؟
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-muted-foreground">
            4 خطوات بسيطة تفصلك عن هوديك الجديد
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="absolute top-12 left-[10%] right-[10%] hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20 lg:block z-0" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`group relative animate-fade-in-up`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Card */}
                  <div className="relative h-full rounded-2xl bg-card border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">

                    {/* Icon */}
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${step.iconBg} text-white shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon className="h-7 w-7" />
                    </div>

                    {/* Step Number */}
                    <span className="absolute top-6 left-6 text-4xl font-black text-muted/20 select-none">
                      {step.id}
                    </span>

                    {/* Content */}
                    <h3 className="mb-1 font-sans text-xl font-bold text-foreground">
                      {step.titleAr}
                    </h3>
                    <p className="mb-3 font-sans text-xs font-bold text-primary uppercase tracking-wider">
                      {step.titleEn}
                    </p>
                    <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">
                      {step.descriptionAr}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <p className="font-body text-lg text-muted-foreground">
            جاهز تبدأ؟ صمم هوديتك الآن أو اختر من تصاميمنا الجاهزة!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const element = document.querySelector("#custom")
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
              className="btn-primary py-4 px-8"
            >
              <Palette size={18} />
              صمم هوديتك
            </button>
            <button
              onClick={() => {
                const element = document.querySelector("#shop")
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
              className="btn-secondary py-4 px-8"
            >
              تصفح المنتجات
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
