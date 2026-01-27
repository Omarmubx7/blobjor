"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Check,
  Phone,
  Truck,
  ArrowLeft,
  Copy,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  CreditCard,
  Share2,
  MessageCircle
} from "lucide-react"

interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  color?: string
  size?: string
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  totalPrice: number
  shippingCost: number
  status: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "لم يتم العثور على الطلب")
        }

        setOrder(data.order)
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnWhatsApp = () => {
    const text = `تم إنشاء طلبي في BloB.JO 🎉\nرقم الطلب: ${orderId}\nتتبع الطلب: ${window.location.origin}/track-order/${orderId}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xl">
            <div className="mx-auto mb-6 rounded-full bg-destructive/10 p-6 w-fit">
              <Package size={48} className="text-destructive" />
            </div>
            <h1 className="font-sans text-2xl font-bold text-foreground mb-2">
              الطلب غير موجود
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              {error || "لم نتمكن من العثور على هذا الطلب"}
            </p>
            <Link href="/" className="btn-primary w-full justify-center py-4">
              <ArrowLeft size={18} />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground animate-bounce-once">
              <Check size={40} strokeWidth={3} />
            </div>
          </div>

          <h1 className="font-sans text-3xl font-bold text-foreground mb-2">
            🎉 تم استلام طلبك!
          </h1>
          <p className="font-body text-lg text-muted-foreground">
            شكراً لك {order.customerName.split(" ")[0]}، سنتواصل معك قريباً
          </p>
        </div>

        {/* Order Number Card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="font-body text-sm text-muted-foreground">رقم الطلب</span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyOrderId}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? "تم النسخ!" : "نسخ"}
              </button>
            </div>
          </div>
          <p className="font-sans text-2xl font-black text-primary text-center py-4 bg-primary/5 rounded-xl">
            {order.id}
          </p>
          <p className="font-body text-xs text-center text-muted-foreground mt-3">
            احتفظ بهذا الرقم لتتبع طلبك
          </p>
        </div>

        {/* Order Details */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Package size={20} className="text-primary" />
            تفاصيل الطلب
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">{item.productName}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {item.size && `${item.size}`}
                    {item.size && item.color && " • "}
                    {item.color && item.color}
                    {" × "}{item.quantity}
                  </p>
                </div>
                <p className="font-sans text-sm font-bold text-foreground">{item.subtotal} JD</p>
              </div>
            ))}

            <div className="pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-body text-muted-foreground">المجموع الفرعي</span>
                <span className="font-body">{(order.totalPrice - order.shippingCost).toFixed(2)} JD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-body text-muted-foreground">التوصيل</span>
                <span className={`font-body ${order.shippingCost === 0 ? "text-success" : ""}`}>
                  {order.shippingCost === 0 ? "مجاني" : `${order.shippingCost} JD`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span className="font-sans">الإجمالي</span>
                <span className="font-sans text-primary">{order.totalPrice} JD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-accent" />
            عنوان التوصيل
          </h2>
          <div className="space-y-2 font-body text-sm">
            <p className="text-foreground">{order.customerName}</p>
            <p className="text-muted-foreground">{order.customerPhone}</p>
            <p className="text-muted-foreground">{order.customerAddress}</p>
            <p className="text-muted-foreground">{order.customerCity}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-sans text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-success" />
            طريقة الدفع
          </h2>
          <p className="font-body text-sm text-foreground">
            {order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "CliQ / تحويل بنكي"}
          </p>
          {order.paymentMethod === "cliq" && (
            <p className="font-body text-xs text-amber-600 mt-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              💡 سيتم التواصل معك عبر واتساب (0787257247) لإتمام عملية الدفع
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-sans text-lg font-bold text-foreground mb-4">الخطوات التالية</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 flex-shrink-0">
                <Phone size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-foreground">تأكيد الطلب</p>
                <p className="font-body text-xs text-muted-foreground">سنتصل بك خلال 24 ساعة لتأكيد الطلب</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                <Clock size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-foreground">تجهيز الطلب</p>
                <p className="font-body text-xs text-muted-foreground">سيتم طباعة وتجهيز طلبك خلال 2-3 أيام</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 flex-shrink-0">
                <Truck size={20} className="text-success" />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-foreground">التوصيل</p>
                <p className="font-body text-xs text-muted-foreground">
                  {order.customerCity === "عمّان"
                    ? "التوصيل خلال 2-3 أيام عمل داخل عمّان"
                    : "التوصيل خلال 3-5 أيام عمل"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/track-order/${order.id}`}
            className="btn-primary w-full justify-center py-4"
          >
            <Package size={18} />
            تتبع الطلب
          </Link>

          <button
            onClick={shareOnWhatsApp}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background py-4 font-sans text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <MessageCircle size={18} className="text-green-600" />
            مشاركة عبر واتساب
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            متابعة التسوق
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.5s ease-in-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}
