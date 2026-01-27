"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const featuredCollections = [
    {
        title: "No Days Off",
        titleAr: "مافي أيام راحة",
        image: "/images/8.png", // Using existing hoodie image as placeholder for specific designs
        color: "bg-blue-600",
    },
    {
        title: "Game On",
        titleAr: "اللعب جد",
        image: "/images/8.png",
        color: "bg-green-600",
    },
    {
        title: "Legend",
        titleAr: "أسطورة الحارة",
        image: "/images/8.png",
        color: "bg-purple-600",
    },
    {
        title: "Training Arc",
        titleAr: "فترة التدريب",
        image: "/images/8.png",
        color: "bg-orange-600",
    },
]

export function FeaturedStrip() {
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section className="py-12 bg-muted/30 border-y border-border/50 overflow-hidden">
            <div
                ref={ref}
                className={`container-custom transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h2 className="text-2xl font-black font-sans uppercase tracking-tighter">
                        Featured Collections <span className="text-primary">///</span>
                    </h2>
                    <a href="#shop" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-1 group">
                        View All Collections <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredCollections.map((collection, idx) => (
                        <div
                            key={idx}
                            className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer"
                        >
                            {/* Background Overlay */}
                            <div className={`absolute inset-0 ${collection.color} opacity-90 transition-opacity group-hover:opacity-100`} />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                                <div>
                                    <span className="text-xs font-bold opacity-75 uppercase tracking-wider">{collection.title}</span>
                                    <h3 className="text-2xl font-black font-body leading-none mt-1">{collection.titleAr}</h3>
                                </div>
                                <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                    <span className="text-xs font-bold bg-white text-black px-3 py-1 rounded-full">تصفح</span>
                                </div>
                            </div>

                            {/* Image (Parallax/Positioned) */}
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                <Image
                                    src={collection.image}
                                    alt={collection.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
