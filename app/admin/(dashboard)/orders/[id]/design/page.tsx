"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, Loader2, Package, User, XCircle } from "lucide-react"

interface CustomDesign {
    id: string
    designImageUrl: string
    mockupImageUrl: string | null
    config: string | any
    notes: string | null
    assetUrls?: string[]
}

interface OrderItem {
    id: number
    productName: string
    productType: string
    quantity: number
    customDesignId: number | null
    customDesign: CustomDesign | null
}

interface Order {
    id: string
    customerName: string
    customerPhone: string
    items: OrderItem[]
}

function parseDesignConfig(config: string | any) {
    if (typeof config === 'string') {
        try {
            return JSON.parse(config)
        } catch {
            return {}
        }
    }
    return config || {}
}

export default function OrderDesignPage() {
    const params = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await fetch(`/api/admin/orders/${params.id}`)
                if (!response.ok) throw new Error("فشل في جلب الطلب")
                const data = await response.json()
                setOrder(data.order)
            } catch (err) {
                setError(err instanceof Error ? err.message : "حدث خطأ")
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [params.id])

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    if (error || !order) return <div className="p-8 text-center text-destructive">{error || "الطلب غير موجود"}</div>

    const customItems = order.items.filter(item => item.customDesign)

    return (
        <div className="space-y-6 container mx-auto p-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-2xl font-bold">ملفات التصميم - طلب #{order.id}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><User size={14} /> {order.customerName}</span>
                        <span className="flex items-center gap-1"><Package size={14} /> {customItems.length} تصاميم مخصصة</span>
                    </div>
                </div>
                <Link href={`/admin/orders/${order.id}`} className="btn-secondary flex items-center gap-2">
                    <ArrowLeft size={16} />
                    عودة لتفاصيل الطلب
                </Link>
            </div>

            {/* Designs List */}
            <div className="grid gap-12">
                {customItems.map((item, index) => {
                    const config = parseDesignConfig(item.customDesign!.config)
                    const assetUrls = config.assetUrls || []

                    return (
                        <div key={item.id} className="border rounded-2xl p-6 bg-card shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </span>
                                <h2 className="text-xl font-bold">{item.productName}</h2>
                                <div className="mr-auto grid grid-cols-2 gap-x-4 text-sm text-muted-foreground">
                                    <span>الكمية: {item.quantity}</span>
                                    <span>النوع: {item.productType}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* 1. Print File (Design Only) */}
                                <div className="space-y-3">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        ملف الطباعة (PNG شفاف)
                                    </h3>
                                    <div className="relative aspect-square border-2 border-dashed rounded-xl bg-[url('/checker.png')] bg-center overflow-hidden">
                                        <Image
                                            src={item.customDesign!.designImageUrl}
                                            alt="Print File"
                                            fill
                                            className="object-contain p-4"
                                        />
                                    </div>
                                    <a
                                        href={item.customDesign!.designImageUrl}
                                        download={`print-file-${order.id}-${index + 1}.png`}
                                        className="flex items-center justify-center gap-2 w-full btn-primary py-3"
                                    >
                                        <Download size={18} />
                                        تحميل ملف الطباعة
                                    </a>
                                </div>

                                {/* 2. Original Assets (Uploaded by User) */}
                                <div className="space-y-3">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        الصورة الأصلية المرفوعة
                                    </h3>

                                    {assetUrls.length > 0 ? (
                                        <div className="space-y-4">
                                            {assetUrls.map((url: string, assetIdx: number) => (
                                                <div key={assetIdx} className="space-y-2">
                                                    <div className="relative aspect-square border rounded-xl bg-muted overflow-hidden">
                                                        <Image
                                                            src={url}
                                                            alt="Original Asset"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <a
                                                        href={url}
                                                        download={`original-asset-${order.id}-${index + 1}-${assetIdx + 1}.png`}
                                                        className="flex items-center justify-center gap-2 w-full btn-secondary py-3"
                                                    >
                                                        <Download size={18} />
                                                        تحميل الصورة الأصلية
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border rounded-xl bg-muted/30 p-8 text-center">
                                            <XCircle size={32} className="mb-2 opacity-50" />
                                            <p>لا توجد صورة أصلية منفصلة</p>
                                            <p className="text-xs mt-1">(تم استخدام التصميم المباشر)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-xl text-center text-sm">
                                <div>
                                    <span className="block text-muted-foreground text-xs mb-1">الأبعاد</span>
                                    <span className="font-mono font-bold">
                                        {(config.scale * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-muted-foreground text-xs mb-1">الموقع (X, Y)</span>
                                    <span className="font-mono font-bold">
                                        {Math.round(config.position_x)}, {Math.round(config.position_y)}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-muted-foreground text-xs mb-1">الجهة</span>
                                    <span className="font-bold">
                                        {config.side === 'front' ? 'أمام' : 'خلف'}
                                    </span>
                                </div>
                                {item.customDesign!.notes && (
                                    <div className="col-span-full md:col-span-1 border-t md:border-t-0 md:border-r pt-2 md:pt-0 md:pr-4">
                                        <span className="block text-muted-foreground text-xs mb-1">ملاحظات</span>
                                        <span className="text-yellow-600 font-medium">{item.customDesign!.notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                {customItems.length === 0 && (
                    <div className="text-center py-12 border rounded-xl bg-muted/10">
                        <p>هذا الطلب لا يحتوي على تصاميم مخصصة</p>
                    </div>
                )}
            </div>
        </div>
    )
}
