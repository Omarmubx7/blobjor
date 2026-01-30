"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ShieldCheck, Zap, Heart, MapPin, MessageCircle } from "lucide-react"
import Image from "next/image"

const features = [
    {
        icon: MapPin,
        title: "صناعة وجودة أردنية",
        description: "بنستخدم أجود أنواع القطن والأقمشة، ومعاملنا ومشاغلنا كلها في عمّان لدعم الصناعة المحلية.",
    },
    {
        icon: ShieldCheck,
        title: "كفالة ألوان وطباعة",
        description: "طباعة DTF و DTG عالية الجودة، ما بتروح مع الغسيل وبنضمنلك اياها.",
    },
    {
        icon: Zap,
        title: "توصيل لكل المحافظات",
        description: "طلبك عندك خلال 48-72 ساعة، سواء كنت في إربد، الزرقاء، العقبة، أو أي مكان بالأردن.",
    },
    {
        icon: MessageCircle,
        title: "خدمة ما بعد البيع",
        description: "فريقنا معك واتساب 24/7. عندك استفسار عن القياس؟ بدك تبدل؟ احنا جاهزين.",
    },
]

export function WhyBlob() {
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section className="py-20 bg-muted/30 relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                <Image src="/Bloblogo.png" alt="bg" fill className="object-cover opacity-10" />
            </div>

            <div
                ref={ref}
                className={`container-custom relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-sans font-black text-3xl md:text-5xl text-foreground mb-4">
                        ليش تختار <span className="text-primary">BloB</span>؟
                    </h2>
                    <p className="text-lg text-muted-foreground font-body">
                        لأننا مش مجرد متجر، إحنا براند بيفهم جوك وبيهتم بالتفاصيل.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <Icon size={24} />
                                </div>
                                <h3 className="font-bold text-xl mb-2 font-body">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
