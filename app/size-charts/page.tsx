import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
    title: 'جدول المقاسات | BloB.JO',
    description: 'دليل المقاسات الكامل لمنتجات BloB.JO. تأكد من اختيار المقاس المناسب للهوديز والتيشيرتات.',
}

const HOODIE_SIZE_CHART = {
    title: "HOODIES SIZES 2026",
    columns: [
        { key: 'size', label: 'الحجم', labelEn: 'Size' },
        { key: 'length', label: 'الطول', labelEn: 'Length' },
        { key: 'chest', label: 'العرض', labelEn: 'Chest' }
    ],
    sizes: [
        { size: '22', length: '37', chest: '28' },
        { size: '26', length: '41', chest: '33' },
        { size: '30', length: '48', chest: '36' },
        { size: '34', length: '51', chest: '39' },
        { size: '36', length: '54', chest: '39' },
        { size: 'XS', length: '62', chest: '42' },
        { size: 'S', length: '64', chest: '49' },
        { size: 'M', length: '66', chest: '51' },
        { size: 'L', length: '68', chest: '54' },
        { size: 'XL', length: '69', chest: '56' },
        { size: '2XL', length: '70', chest: '58' },
        { size: '3XL', length: '72', chest: '60' },
        { size: '4XL', length: '74', chest: '64' },
        { size: '5XL', length: '77', chest: '67' }
    ]
}

export default function SizeChartsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 lg:py-24" dir="rtl">
                <div className="container mx-auto px-4">

                    {/* Header Section */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            دليل المقاسات
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            عشان تضمن إن القطعة تطلع عليك "فت"، راجع جدول المقاسات وتأكد من قياساتك.
                        </p>
                    </div>

                    {/* Size Chart Card */}
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

                        <div className="p-8 md:p-12">
                            {/* Product Type Header */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-5xl">🧥</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-1">
                                            {HOODIE_SIZE_CHART.title}
                                        </h2>
                                        <p className="text-slate-500 font-medium">قصة مريحة وعصرية (Regular Fit)</p>
                                    </div>
                                </div>

                                {/* Measurement Guide Box */}
                                <div className="bg-slate-50 rounded-2xl p-4 md:min-w-[300px] border border-slate-100">
                                    <div className="flex items-center justify-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="text-slate-900 font-bold mb-1">📏 الطول / Length</div>
                                            <div className="text-slate-500">من أعلى الكتف للأسفل</div>
                                        </div>
                                        <div className="w-px h-10 bg-slate-300"></div>
                                        <div className="text-center">
                                            <div className="text-slate-900 font-bold mb-1">📐 العرض / Chest</div>
                                            <div className="text-slate-500">من الإبط للإبط</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-900 text-white">
                                            {HOODIE_SIZE_CHART.columns.map((col) => (
                                                <th key={col.key} className="px-6 py-5 text-center font-bold text-lg">
                                                    <div className="flex flex-col">
                                                        <span>{col.label}</span>
                                                        <span className="text-xs opacity-70 font-normal uppercase tracking-wider">{col.labelEn}</span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {HOODIE_SIZE_CHART.sizes.map((sizeData, index) => (
                                            <tr
                                                key={sizeData.size}
                                                className={`
                                    transition-colors hover:bg-blue-50/50
                                    ${index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}
                                `}
                                            >
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white font-bold shadow-sm">
                                                        {sizeData.size}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-slate-700 font-medium text-lg">
                                                        {sizeData.length} <span className="text-sm text-slate-400">سم</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-slate-700 font-medium text-lg">
                                                        {sizeData.chest} <span className="text-sm text-slate-400">سم</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-sm">
                                <span className="text-xl">💡</span>
                                <p className="leading-relaxed">
                                    <strong>ملاحظة:</strong> القياسات قد تختلف بمقدار بسيط (1-2 سم) بسبب طبيعة القماش والعملية الإنتاجية. إذا كنت محتار بين مقاسين، ننصحك باختيار المقاس الأكبر لراحة أكثر.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
