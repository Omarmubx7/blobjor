"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Printer, 
  ClipboardCheck,
  XCircle,
  Search,
  MapPin,
  Phone,
  Calendar,
  RefreshCw,
  Sparkles,
  Palette,
  Move,
  RotateCw,
  Maximize2
} from "lucide-react"

interface StatusHistoryItem {
  id: string
  oldStatus: string | null
  newStatus: string
  notes: string | null
  changedAt: string
}

interface DesignConfig {
  position_x: number
  position_y: number
  scale: number
  rotation: number
  side: "front" | "back"
}

interface CustomDesign {
  id: string
  designImageUrl: string
  mockupImageUrl: string | null
  config: string | DesignConfig
  notes: string | null
  status: string
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
  id: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  color?: string
  size?: string
  customDesign?: CustomDesign | null
}

interface TrackingOrder {
  id: string
  customerName: string
  status: string
  statusLabel: string
  statusProgress: number
  paymentStatus: string
  totalPrice: number
  shippingCost: number
  createdAt: string
  updatedAt: string
  estimatedDelivery: string | null
  items: OrderItem[]
  statusHistory: StatusHistoryItem[]
}

const statusSteps = [
  { key: "pending", label: "قيد الانتظار", icon: Clock, color: "text-amber-500" },
  { key: "confirmed", label: "تم التأكيد", icon: ClipboardCheck, color: "text-blue-500" },
  { key: "printing", label: "قيد الطباعة", icon: Printer, color: "text-purple-500" },
  { key: "ready", label: "جاهز", icon: Package, color: "text-cyan-500" },
  { key: "shipped", label: "في الطريق", icon: Truck, color: "text-orange-500" },
  { key: "delivered", label: "تم التوصيل", icon: CheckCircle2, color: "text-success" },
]

const getStatusIndex = (status: string) => {
  const index = statusSteps.findIndex(s => s.key === status)
  return index === -1 ? 0 : index
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    printing: "قيد الطباعة",
    ready: "جاهز للتوصيل",
    shipped: "في الطريق",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  }
  return labels[status] || status
}

export default function TrackOrderPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<TrackingOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchId, setSearchId] = useState(orderId || "")
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrder = async (id: string) => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/orders/track/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "لم يتم العثور على الطلب")
      }
      
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ")
      setOrder(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    } else {
      setLoading(false)
    }
  }, [orderId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      router.push(`/track-order/${searchId.trim()}`)
    }
  }

  const handleRefresh = () => {
    if (orderId) {
      setRefreshing(true)
      fetchOrder(orderId)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-JO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={18} />
            الرئيسية
          </Link>
          <h1 className="font-sans text-lg font-bold text-foreground">تتبع الطلب</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="أدخل رقم الطلب (مثال: ORDER-20240122-001)"
                className="w-full rounded-xl border border-border bg-background py-3 pr-12 pl-4 font-body text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-6"
            >
              بحث
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="font-body text-muted-foreground">جاري البحث عن الطلب...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16">
            <div className="mx-auto mb-6 rounded-full bg-destructive/10 p-6 w-fit">
              <XCircle size={48} className="text-destructive" />
            </div>
            <h2 className="font-sans text-xl font-bold text-foreground mb-2">
              لم يتم العثور على الطلب
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              {error}
            </p>
            <p className="font-body text-sm text-muted-foreground">
              تأكد من رقم الطلب وحاول مرة أخرى
            </p>
          </div>
        )}

        {/* No Order ID */}
        {!loading && !error && !order && !orderId && (
          <div className="text-center py-16">
            <div className="mx-auto mb-6 rounded-full bg-muted p-6 w-fit">
              <Search size={48} className="text-muted-foreground" />
            </div>
            <h2 className="font-sans text-xl font-bold text-foreground mb-2">
              تتبع طلبك
            </h2>
            <p className="font-body text-muted-foreground">
              أدخل رقم الطلب في الأعلى لمعرفة حالة طلبك
            </p>
          </div>
        )}

        {/* Order Found */}
        {!loading && order && (
          <div className="space-y-6 animate-fade-in">
            {/* Order Header */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground">رقم الطلب</p>
                  <p className="font-sans text-lg font-bold text-primary" dir="ltr">{order.id}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                >
                  <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                  تحديث
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            {/* Status Progress */}
            {order.status !== "cancelled" ? (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-sans text-lg font-bold text-foreground mb-6">حالة الطلب</h2>
                
                {/* Progress Bar */}
                <div className="relative mb-8">
                  <div className="absolute top-4 right-4 left-4 h-1 bg-muted rounded-full">
                    <div 
                      className="absolute top-0 right-0 h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${order.statusProgress}%` }}
                    />
                  </div>
                  
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getStatusIndex(order.status)
                      const isCompleted = index <= currentIndex
                      const isCurrent = index === currentIndex
                      const Icon = step.icon
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                            ${isCurrent ? "ring-4 ring-primary/20" : ""}
                            transition-all duration-300
                          `}>
                            <Icon size={16} />
                          </div>
                          <span className={`
                            mt-2 text-xs font-body text-center
                            ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}
                          `}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Current Status */}
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <p className="font-sans text-sm font-bold text-primary mb-1">
                    {order.statusLabel}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="font-body text-sm text-muted-foreground">
                      التوصيل المتوقع: {order.estimatedDelivery}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
                <XCircle size={48} className="mx-auto text-destructive mb-4" />
                <h2 className="font-sans text-xl font-bold text-destructive mb-2">تم إلغاء الطلب</h2>
                <p className="font-body text-sm text-muted-foreground">
                  للاستفسار، تواصل معنا عبر واتساب
                </p>
              </div>
            )}

            {/* Order Items */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Package size={20} className="text-primary" />
                تفاصيل الطلب
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`rounded-xl border p-4 ${
                      item.customDesign ? "border-accent/50 bg-accent/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        {/* Design Image */}
                        {item.customDesign && (
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                            <Image
                              src={item.customDesign.designImageUrl}
                              alt="تصميمك"
                              fill
                              className="object-contain"
                            />
                            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                              <Sparkles size={10} />
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="font-sans text-sm font-medium text-foreground">{item.productName}</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            {item.size && `${item.size}`}
                            {item.size && item.color && " • "}
                            {item.color && item.color}
                            {" × "}{item.quantity}
                          </p>
                          {item.customDesign && (
                            <span className="inline-flex items-center gap-1 mt-1 rounded-md bg-accent/20 px-2 py-0.5 font-body text-xs text-accent font-semibold">
                              <Sparkles size={10} />
                              تصميم مخصص
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-sans text-sm font-bold text-foreground">{item.subtotal} JD</p>
                    </div>

                    {/* Custom Design Details */}
                    {item.customDesign && (() => {
                      const config = parseDesignConfig(item.customDesign.config);
                      return (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="font-body text-xs text-muted-foreground mb-2">تفاصيل التصميم:</p>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="rounded-md bg-muted/50 p-2 text-center">
                              <Move size={12} className="mx-auto mb-0.5 text-muted-foreground" />
                              <p className="font-mono text-[10px]">
                                ({Math.round(config.position_x)}, {Math.round(config.position_y)})
                              </p>
                            </div>
                            <div className="rounded-md bg-muted/50 p-2 text-center">
                              <Maximize2 size={12} className="mx-auto mb-0.5 text-muted-foreground" />
                              <p className="font-mono text-[10px]">{(config.scale * 100).toFixed(0)}%</p>
                            </div>
                            <div className="rounded-md bg-muted/50 p-2 text-center">
                              <RotateCw size={12} className="mx-auto mb-0.5 text-muted-foreground" />
                              <p className="font-mono text-[10px]">{Math.round(config.rotation)}°</p>
                            </div>
                            <div className="rounded-md bg-muted/50 p-2 text-center">
                              <Palette size={12} className="mx-auto mb-0.5 text-muted-foreground" />
                              <p className="font-body text-[10px]">{config.side === "front" ? "أمام" : "خلف"}</p>
                            </div>
                          </div>
                          {item.customDesign.notes && (
                            <p className="mt-2 font-body text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 rounded-md p-2">
                              💬 {item.customDesign.notes}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))}

                <div className="pt-3 flex justify-between text-lg font-bold border-t border-border">
                  <span className="font-sans">الإجمالي</span>
                  <span className="font-sans text-primary">{order.totalPrice} JD</span>
                </div>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-accent" />
                  سجل التحديثات
                </h2>
                
                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => (
                    <div key={history.id} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`
                          w-3 h-3 rounded-full
                          ${index === 0 ? "bg-primary" : "bg-muted"}
                        `} />
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-0.5 flex-1 bg-muted mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-sans text-sm font-medium text-foreground">
                          {getStatusLabel(history.newStatus)}
                        </p>
                        {history.notes && (
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            {history.notes}
                          </p>
                        )}
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          {formatDate(history.changedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="rounded-2xl border border-border bg-muted/50 p-6 text-center">
              <p className="font-body text-sm text-muted-foreground mb-4">
                هل لديك سؤال عن طلبك؟
              </p>
              <a
                href={`https://wa.me/962791234567?text=استفسار عن الطلب رقم: ${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Phone size={18} />
                تواصل معنا عبر واتساب
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
