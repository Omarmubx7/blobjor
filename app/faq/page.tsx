import { Metadata } from 'next'
import { Plus, Minus, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'FAQ - الأسئلة الشائعة | blobjor.me',
    description: 'إجابات على جميع استفساراتك حول الطلب، الشحن، والاسترجاع.',
}

export default function FAQPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-black mb-4 uppercase italic tracking-tighter">
                        HELP CENTER
                    </h1>
                    <p className="text-zinc-500 font-medium text-lg">
                        كيف نقدر نساعدك اليوم؟
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="grid gap-8">
                    <FAQSection
                        title="الطلبات والشحن"
                        items={[
                            { q: "كم يستغرق توصيل الطلب؟", a: "يتم تجهيز الطلب خلال 24-48 ساعة، والتوصيل يستغرق 2-4 أيام عمل حسب منطقتك." },
                            { q: "هل يوجد دفع عند الاستلام؟", a: "نعم، نوفر خدمة الدفع عند الاستلام لجميع محافظات المملكة." },
                            { q: "كيف أتتبع طلبي؟", a: "بمجرد شحن طلبك، ستصلك رسالة نصية برقم التتبع يمكنك استخدامه في صفحة 'تتبع الطلب'." }
                        ]}
                    />

                    <FAQSection
                        title="الاسترجاع والاستبدال"
                        items={[
                            { q: "هل يمكنني إرجاع المنتج؟", a: "نعم، يمكنك إرجاع أو استبدال المنتج خلال 14 يوم من تاريخ الاستلام بشرط أن يكون بحالته الأصلية." },
                            { q: "ماذا لو وصلني منتج خاطئ؟", a: "نعتذر عن ذلك! تواصل معنا فوراً وسنقوم باستبداله مجاناً دون أي تكاليف إضافية." }
                        ]}
                    />

                    <FAQSection
                        title="التصميم والطباعة"
                        items={[
                            { q: "كيف أحافظ على جودة الطباعة؟", a: "ننصح بغسل الملابس بماء بارد ومقلوبة للخارج، وتجنب استخدام المبيضات أو الكوي المباشر على الطباعة." },
                            { q: "هل التصاميم ديجيتال أم تطريز؟", a: "نستخدم أحدث تقنيات الطباعة الرقمية (DTF) لضمان دقة عالية وألوان زاهية تدوم طويلاً." }
                        ]}
                    />
                </div>

            </div>
        </div>
    )
}

function FAQSection({ title, items }: { title: string, items: { q: string, a: string }[] }) {
    return (
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className="bg-zinc-50 p-6 border-b border-zinc-200">
                <h2 className="font-bold text-xl text-black flex items-center gap-2">
                    <HelpCircle className="text-black" size={20} />
                    {title}
                </h2>
            </div>
            <div className="divide-y divide-zinc-100">
                {items.map((item, i) => (
                    <details key={i} className="group p-6 cursor-pointer bg-white open:bg-zinc-50 transition-all">
                        <summary className="flex items-center justify-between font-bold text-zinc-800 list-none select-none">
                            <span>{item.q}</span>
                            <span className="bg-zinc-100 rounded-full p-1 text-zinc-400 group-open:text-black group-open:bg-white transition-all">
                                <Plus size={16} className="block group-open:hidden" />
                                <Minus size={16} className="hidden group-open:block" />
                            </span>
                        </summary>
                        <p className="mt-4 text-zinc-500 leading-relaxed text-sm">
                            {item.a}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    )
}
