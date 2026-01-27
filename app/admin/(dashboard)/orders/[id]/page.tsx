"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import {
  ArrowRight,
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Sparkles,
  Download,
  ExternalLink,
  RefreshCw,
  Palette,
  Move,
  RotateCw,
  Maximize2,
  Eye
} from "lucide-react"

interface DesignConfig {
  position_x: number
  position_y: number
  scale: number
  rotation: number
  side: "front" | "back"
  canvasJson?: object
  assetUrls?: string[]
}

interface CustomDesign {
  id: string
  designImageUrl: string
  mockupImageUrl: string | null
  config: string | DesignConfig // Can be string (from DB) or parsed object
  notes: string | null
  status: string
  createdAt: string
}

// Helper to parse config
function parseDesignConfig(config: string | DesignConfig): DesignConfig {
  if (typeof config === 'string') {
    try {
      return JSON.parse(config)
    } catch {
      return { position_x: 200, position_y: 240, scale: 1, rotation: 0, side: "front" }
    }
  }
  return config
}

interface OrderItem {
  id: number
  productType: string
  productName: string
  designData: string | null
  color: string | null
  size: string | null
  quantity: number
  unitPrice: number
  subtotal: number
  customDesignId: number | null
  customDesign: CustomDesign | null
}

interface StatusHistory {
  id: number
  oldStatus: string | null
  newStatus: string
  notes: string | null
  changedAt: string
}

interface Order {
  id: string
  customerName: string
  customerEmail: string | null
  customerPhone: string
  customerAddress: string
  customerCity: string
  totalPrice: number
  shippingCost: number
  status: string
  paymentMethod: string
  paymentStatus: string
  notes: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  statusHistory: StatusHistory[]
}

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock size={14} /> },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", icon: <CheckCircle size={14} /> },
  processing: { bg: "bg-purple-100", text: "text-purple-800", icon: <RefreshCw size={14} /> },
  shipped: { bg: "bg-indigo-100", text: "text-indigo-800", icon: <Truck size={14} /> },
  delivered: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle size={14} /> },
  cancelled: { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={14} /> },
}

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
}

const paymentLabels: Record<string, string> = {
  cod: "الدفع عند الاستلام",
  cliq: "CliQ / تحويل بنكي",
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<CustomDesign | null>(null)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`)
      if (!response.ok) {
        throw new Error("فشل في جلب تفاصيل الطلب")
      }
      const data = await response.json()
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!order) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("فشل في تحديث الحالة")
      }

      await fetchOrder()
    } catch (err) {
      alert(err instanceof Error ? err.message : "حدث خطأ")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">خطأ</h2>
        <p className="text-muted-foreground mb-4">{error || "الطلب غير موجود"}</p>
        <Link href="/admin/orders" className="btn-primary">
          العودة للطلبات
        </Link>
      </div>
    )
  }

  const statusStyle = statusColors[order.status] || statusColors.pending

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h1 className="font-sans text-2xl font-bold text-foreground">
              طلب #{order.id}
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              {format(new Date(order.createdAt), "PPpp", { locale: ar })}
            </p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.icon}
          <span className="font-body text-sm font-semibold">{statusLabels[order.status]}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              منتجات الطلب ({order.items.length})
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 ${item.customDesign ? "border-accent/50 bg-accent/5" : "border-border"
                    }`}
                >
                  <div className="flex gap-4">
                    {/* Product Image/Design */}
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.customDesign ? (
                        <Image
                          src={item.customDesign.designImageUrl}
                          alt="تصميم مخصص"
                          fill
                          className="object-contain cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedDesign(item.customDesign)}
                        />
                      ) : item.designData ? (
                        <Image
                          src={JSON.parse(item.designData).image || "/placeholder.png"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package size={24} className="text-muted-foreground" />
                        </div>
                      )}
                      {/* Custom Design Badge */}
                      {item.customDesign && (
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow-lg">
                          <Sparkles size={12} />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-sans text-sm font-bold text-foreground">
                        {item.productName}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-body text-xs">
                          {item.productType === "hoodie" ? "هودي" : "كوب"}
                        </span>
                        {item.size && (
                          <span className="rounded-md bg-muted px-2 py-0.5 font-body text-xs">
                            {item.size}
                          </span>
                        )}
                        {item.color && (
                          <div className="flex items-center gap-1">
                            <span
                              className="h-4 w-4 rounded-full border border-border"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-body text-xs text-muted-foreground">{item.color}</span>
                          </div>
                        )}
                        {item.customDesign && (
                          <span className="rounded-md bg-accent/20 px-2 py-0.5 font-body text-xs text-accent font-semibold">
                            تصميم مخصص
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-body text-sm text-muted-foreground">
                          {item.quantity} × {item.unitPrice} JD
                        </span>
                        <span className="font-sans text-base font-bold text-primary">
                          {item.subtotal} JD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Design Details */}
                  {item.customDesign && (() => {
                    const config = parseDesignConfig(item.customDesign.config);
                    // Use mockupImageUrl (Mockup) if available, otherwise fallback to designImageUrl (Print File)
                    const displayImage = item.customDesign.mockupImageUrl || item.customDesign.designImageUrl;

                    return (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="mb-4 bg-muted/30 p-4 rounded-xl border border-border">
                          <h4 className="font-sans text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                            <Eye size={16} className="text-primary" />
                            معاينة "مثال واقعي" (Mockup)
                          </h4>
                          <div className="relative aspect-[3/4] w-full max-w-[300px] mx-auto overflow-hidden rounded-lg bg-white shadow-sm border border-border">
                            <Image
                              src={displayImage}
                              alt="معاينة واقعية"
                              fill
                              className="object-contain"
                            />
                            <div className="absolute bottom-2 right-2 flex gap-2">
                              <button
                                onClick={() => setSelectedDesign(item.customDesign)}
                                className="p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                                title="تكبير"
                              >
                                <Maximize2 size={16} />
                              </button>
                              <a
                                href={displayImage}
                                download={`mockup-${item.customDesign.id}.png`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 bg-primary/90 text-white rounded-full hover:bg-primary transition-colors"
                                title="تحميل المعاينة"
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-sans text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                          <Sparkles size={14} className="text-accent" />
                          تفاصيل التصميم التقنية
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <Move size={16} className="mx-auto mb-1 text-muted-foreground" />
                            <p className="font-body text-xs text-muted-foreground">الموضع</p>
                            <p className="font-mono text-xs font-semibold">
                              ({Math.round(config.position_x)}, {Math.round(config.position_y)})
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <Maximize2 size={16} className="mx-auto mb-1 text-muted-foreground" />
                            <p className="font-body text-xs text-muted-foreground">الحجم</p>
                            <p className="font-mono text-xs font-semibold">
                              {(config.scale * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <RotateCw size={16} className="mx-auto mb-1 text-muted-foreground" />
                            <p className="font-body text-xs text-muted-foreground">الدوران</p>
                            <p className="font-mono text-xs font-semibold">
                              {Math.round(config.rotation)}°
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <Palette size={16} className="mx-auto mb-1 text-muted-foreground" />
                            <p className="font-body text-xs text-muted-foreground">الجهة</p>
                            <p className="font-body text-xs font-semibold">
                              {config.side === "front" ? "أمامي" : "خلفي"}
                            </p>
                          </div>
                        </div>

                        {item.customDesign.notes && (
                          <div className="mt-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3 border border-yellow-200 dark:border-yellow-800">
                            <p className="font-body text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>ملاحظات العميل:</strong> {item.customDesign.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 grid gap-2">
                          <div className="flex gap-2">
                            <a
                              href={item.customDesign.designImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={`design-${item.customDesign.id}.png`}
                              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2 font-body text-xs text-primary hover:bg-primary/20 transition-colors"
                            >
                              <Download size={14} />
                              تحميل التصميم
                            </a>
                            <button
                              onClick={() => setSelectedDesign(item.customDesign)}
                              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-3 py-2 font-body text-xs text-accent hover:bg-accent/20 transition-colors"
                            >
                              <ExternalLink size={14} />
                              عرض كبير
                            </button>
                          </div>

                          {config.assetUrls && config.assetUrls.length > 0 && (
                            <div className="grid gap-2">
                              {config.assetUrls.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={`asset-${idx + 1}-${item.customDesign!.id}.png`}
                                  className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-body text-xs text-slate-700 hover:bg-slate-200 transition-colors"
                                >
                                  <Download size={14} />
                                  تحميل الصورة الأصلية {config.assetUrls && config.assetUrls.length > 1 ? `(${idx + 1})` : ''}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between">
                <span className="font-body text-muted-foreground">المجموع الفرعي</span>
                <span className="font-body">{order.totalPrice - order.shippingCost} JD</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-muted-foreground">التوصيل</span>
                <span className="font-body">
                  {order.shippingCost === 0 ? "مجاني" : `${order.shippingCost} JD`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-sans font-bold">الإجمالي</span>
                <span className="font-sans text-xl font-bold text-primary">{order.totalPrice} JD</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              سجل الحالات
            </h2>

            <div className="space-y-3">
              {order.statusHistory.map((history, index) => (
                <div
                  key={history.id}
                  className={`flex items-start gap-3 ${index !== 0 ? "pt-3 border-t border-border" : ""}`}
                >
                  <div className={`mt-0.5 rounded-full p-1.5 ${statusColors[history.newStatus]?.bg || "bg-muted"}`}>
                    {statusColors[history.newStatus]?.icon || <Clock size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-foreground">
                      {statusLabels[history.newStatus]}
                    </p>
                    {history.notes && (
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {history.notes}
                      </p>
                    )}
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {format(new Date(history.changedAt), "PPpp", { locale: ar })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              معلومات العميل
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User size={16} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{order.customerName}</p>
                  {order.customerEmail && (
                    <p className="font-body text-xs text-muted-foreground">{order.customerEmail}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-muted-foreground" />
                <a
                  href={`tel:${order.customerPhone}`}
                  className="font-body text-sm text-primary hover:underline"
                  dir="ltr"
                >
                  {order.customerPhone}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-body text-sm text-foreground">{order.customerCity}</p>
                  <p className="font-body text-xs text-muted-foreground">{order.customerAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              الدفع
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-body text-sm text-muted-foreground">طريقة الدفع</span>
                <span className="font-body text-sm font-semibold">{paymentLabels[order.paymentMethod]}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-sm text-muted-foreground">حالة الدفع</span>
                <span className={`rounded-full px-2 py-0.5 font-body text-xs font-semibold ${order.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {order.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                ملاحظات
              </h2>
              <p className="font-body text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          {/* Update Status */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-sans text-lg font-bold text-foreground mb-4">تحديث الحالة</h2>

            <div className="space-y-2">
              {Object.entries(statusLabels).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating || order.status === status}
                  className={`w-full flex items-center gap-2 rounded-lg px-4 py-2.5 font-body text-sm transition-all ${order.status === status
                    ? `${statusColors[status]?.bg} ${statusColors[status]?.text} cursor-not-allowed`
                    : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                >
                  {statusColors[status]?.icon}
                  {label}
                  {order.status === status && (
                    <CheckCircle size={14} className="mr-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Design Preview Modal */}
      {selectedDesign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDesign(null)}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <XCircle size={20} />
            </button>

            <Image
              src={selectedDesign.designImageUrl}
              alt="تصميم مخصص"
              width={800}
              height={960}
              className="max-w-full h-auto"
            />

            {(() => {
              const modalConfig = parseDesignConfig(selectedDesign.config);
              return (
                <div className="mt-4 space-y-4">

                  {/* Asset Downloads (From Config) */}
                  {modalConfig.assetUrls && modalConfig.assetUrls.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-sans text-sm font-bold mb-2">الملفات المرفقة (Original Assets)</h4>
                      <div className="flex flex-wrap gap-2">
                        {modalConfig.assetUrls.map((url: string, idx: number) => (
                          <a
                            key={idx}
                            href={url}
                            download={`asset-${idx + 1}-${selectedDesign.id}.png`}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-xs font-medium hover:bg-slate-200 text-slate-700"
                          >
                            <Download size={14} />
                            ملف {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Config Details */}
                  <div className="grid grid-cols-4 gap-2 text-center text-slate-800">
                    <div className="rounded-lg bg-muted p-2">
                      {/* ... existing inner logic ... */}
                      <p className="font-body text-xs text-muted-foreground">الموضع</p>
                      <p className="font-mono text-sm font-bold">
                        ({Math.round(modalConfig.position_x)}, {Math.round(modalConfig.position_y)})
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="font-body text-xs text-muted-foreground">الحجم</p>
                      <p className="font-mono text-sm font-bold">
                        {(modalConfig.scale * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="font-body text-xs text-muted-foreground">الدوران</p>
                      <p className="font-mono text-sm font-bold">
                        {Math.round(modalConfig.rotation)}°
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="font-body text-xs text-muted-foreground">الجهة</p>
                      <p className="font-body text-sm font-bold">
                        {modalConfig.side === "front" ? "أمامي" : "خلفي"}
                      </p>
                    </div>
                  </div>
                </div>

              );
            })()}

            <a
              href={selectedDesign.designImageUrl}
              download={`design-${selectedDesign.id}.png`}
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg bg-primary py-3 font-body text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Download size={16} />
              تحميل التصميم بجودة عالية
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
