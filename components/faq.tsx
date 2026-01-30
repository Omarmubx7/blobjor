"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react"
import { useState } from "react"

const faqs = [
    {
        question: "كم يستغرق وقت التوصيل؟",
        answer: "التوصيل داخل عمّان: 24-48 ساعة. باقي المحافظات: 48-72 ساعة. بنحاول نوصلك أسرع شي!",
    },
    {
        question: "ما هي طرق الدفع المتاحة؟",
        answer: "الدفع عند الاستلام (الكاش)، محافظ زين كاش (Zain Cash)، CliQ، أو التحويل البنكي.",
    },
    {
        question: "سياسة الإرجاع والتبديل؟",
        answer: "المنتجات الجاهزة: يمكن استبدالها خلال 3 أيام شرط عدم الاستخدام. المنتجات المصممة (Custom): لا يمكن إرجاعها إلا في حال وجود خطأ مصنعي.",
    },
    {
        question: "كيف أقدر أتتبع طلبي؟",
        answer: "من صفحة 'تتبع الطلب' بالموقع، أو تواصل معنا واتساب وبنحكيلك وين صارت شحنتك.",
    },
    {
        question: "هل عندكم محل أقدر أجي عليه؟",
        answer: "حالياً إحنا متجر إلكتروني فقط، بس توصيلنا بيغطي كل الأردن لباب بيتك.",
    },
]

export function FAQ() {
    const { ref, isVisible } = useScrollAnimation()
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section id="faq" className="section-white py-16 lg:py-24">
            <div
                ref={ref}
                className={`mx-auto max-w-3xl px-4 transition-all duration-700 lg:px-8 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    }`}
            >
                <div className="text-center mb-12">
                    <span className="badge badge-accent mb-4">
                        <HelpCircle size={12} />
                        FAQ
                    </span>
                    <h2 className="font-sans text-3xl font-black tracking-tight text-foreground lg:text-4xl">
                        الأسئلة الشائعة
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        إجابات على أكثر الأسئلة تكراراً
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${openIndex === index
                                ? "border-primary/50 bg-primary/5 shadow-md"
                                : "border-border bg-card hover:border-primary/20"
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(prev => prev === index ? null : index)}
                                className="flex w-full items-center justify-between p-5 text-start"
                            >
                                <span className={`font-sans text-lg font-bold ${openIndex === index ? "text-primary" : "text-foreground"
                                    }`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    size={20}
                                    className={`text-muted-foreground transition-transform duration-300 ${openIndex === index ? "rotate-180 text-primary" : ""
                                        }`}
                                />
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="p-5 pt-0">
                                        <p className="font-body text-base leading-relaxed text-muted-foreground">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <p className="mb-4 font-body text-sm text-muted-foreground">
                        Need Help? محتاج مساعدة؟
                    </p>
                    <a
                        href="https://wa.me/962787257247"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2"
                    >
                        <MessageCircle size={18} />
                        تواصل معنا عبر واتساب
                    </a>
                </div>
            </div>
        </section>
    )
}
