"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { ArrowLeft, Package, Truck, CreditCard, Check, ShoppingBag, MapPin, Phone, User, Mail, FileText, ChevronDown, Banknote, Building2, Minus, Plus, Trash2, Loader2 } from "lucide-react"

const governorates = [
  "عمّان",
  "إربد",
  "الزرقاء",
  "المفرق",
  "عجلون",
  "جرش",
  "البلقاء",
  "مادبا",
  "الكرك",
  "الطفيلة",
  "معان",
  "العقبة",
]

type PaymentMethod = "cod" | "cliq"

interface FormData {
  name: string
  phone: string
  email: string
  governorate: string
  area: string
  address: string
  notes: string
  paymentMethod: PaymentMethod
}

interface FormErrors {
  name?: string
  phone?: string
  email?: string
  governorate?: string
  area?: string
  address?: string
}

import { useSession } from "next-auth/react"

// ... imports ...

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, subtotal, totalItems, removeItem, updateQuantity, clearCart } = useCart()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    governorate: "",
    area: "",
    address: "",
    notes: "",
    paymentMethod: "cod",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-fill from session
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        phone: session.user.phone || prev.phone,
        address: session.user.address || prev.address,
        governorate: session.user.city || prev.governorate,
      }))
    }
  }, [session])

  // Calculate delivery fee
  const deliveryFee = 0

  // Coupon State
  const [couponCode, setCouponCode] = useState("")
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false)
  const [couponMessage, setCouponMessage] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: string, code: string, discount: number } | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsCheckingCoupon(true);
    setCouponMessage("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, totalAmount: subtotal })
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({ id: data.couponId, code: data.code, discount: data.discount });
        setDiscountAmount(data.discount);
        setCouponMessage(`تم خصم ${data.discount} د.أ بنجاح!`);
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponMessage(data.message || "كود غير صالح");
      }
    } catch (err) {
      setCouponMessage("حدث خطأ أثناء التحقق");
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const total = subtotal + deliveryFee - discountAmount

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب"
    } else if (!/^07[789]\d{7}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم هاتف أردني غير صالح"
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "بريد إلكتروني غير صالح"
    }

    if (!formData.governorate) {
      newErrors.governorate = "المحافظة مطلوبة"
    }

    if (!formData.area.trim()) {
      newErrors.area = "المنطقة مطلوبة"
    }

    if (!formData.address.trim()) {
      newErrors.address = "العنوان مطلوب"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (items.length === 0) return

    setIsSubmitting(true)

    try {
      // Prepare order data with custom design support
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone.replace(/\s/g, ""),
        customerAddress: `${formData.area}, ${formData.address}`,
        customerCity: formData.governorate,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
        shippingCost: deliveryFee,
        couponId: appliedCoupon?.id,
        items: items.map(item => ({
          productType: item.category === "hoodies" ? "hoodie" : "mug",
          productName: item.titleAr,
          designData: JSON.stringify({
            title: item.title,
            image: item.image,
            category: item.category
          }),
          color: item.customDesign?.productColor || null,
          size: item.size || null,
          quantity: item.quantity,
          unitPrice: item.price,
          // Include custom design data if present
          isCustomDesign: item.isCustomDesign || false,
          customDesign: item.isCustomDesign && item.customDesign ? {
            designImageUrl: item.customDesign.designImageUrl,
            mockupImageUrl: item.customDesign.mockupImageUrl,
            config: item.customDesign.config,
            notes: item.customDesign.notes,
            productColor: item.customDesign.productColor,
          } : undefined,
        })),
      }

      // Submit to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء إنشاء الطلب")
      }

      // Clear cart and redirect to confirmation
      clearCart()
      router.push(`/order-confirmation/${data.order.id}`)
    } catch (error) {
      console.error("Order submission error:", error)
      alert(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الطلب")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Empty Cart Screen
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up text-center">
          <div className="rounded-3xl bg-card border border-border p-8 shadow-xl">
            <div className="mx-auto mb-6 rounded-full bg-muted p-6 w-fit">
              <ShoppingBag size={48} className="text-muted-foreground" />
            </div>
            <h1 className="font-sans text-2xl font-bold text-foreground mb-2">
              السلة فارغة
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              لم تضف أي منتجات بعد
            </p>
            <Link
              href="/#shop"
              className="btn-primary w-full justify-center py-4"
            >
              <ArrowLeft size={18} />
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/Bloblogo.png" alt="BloB Logo" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-sans text-xl font-black">blobjor.me</span>
          </Link>
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary" />
            <span className="font-body text-sm font-medium text-foreground">إتمام الطلب</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Link */}
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft size={16} />
          متابعة التسوق
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main Form - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <h1 className="font-sans text-2xl font-bold text-foreground">إتمام الطلب</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <User size={20} className="text-primary" />
                  </div>
                  <h2 className="font-sans text-lg font-bold text-foreground">معلومات العميل</h2>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm font-medium text-foreground">
                      <User size={14} />
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className={`w-full rounded-xl border bg-background py-3 px-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${errors.name
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                        }`}
                    />
                    {errors.name && <p className="mt-1 font-body text-xs text-destructive">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm font-medium text-foreground">
                      <Phone size={14} />
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="07XXXXXXXX"
                      dir="ltr"
                      className={`w-full rounded-xl border bg-background py-3 px-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 text-left ${errors.phone
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                        }`}
                    />
                    {errors.phone && <p className="mt-1 font-body text-xs text-destructive">{errors.phone}</p>}
                  </div>

                  {/* Email - Required */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm font-medium text-foreground">
                      <Mail size={14} />
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@email.com"
                      dir="ltr"
                      className={`w-full rounded-xl border bg-background py-3 px-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 text-left ${errors.email
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                        }`}
                    />
                    {errors.email && <p className="mt-1 font-body text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Truck size={20} className="text-accent" />
                  </div>
                  <h2 className="font-sans text-lg font-bold text-foreground">عنوان التوصيل</h2>
                </div>

                <div className="space-y-4">
                  {/* Governorate */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm font-medium text-foreground">
                      <MapPin size={14} />
                      المحافظة *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.governorate}
                        onChange={(e) => handleInputChange("governorate", e.target.value)}
                        className={`w-full appearance-none rounded-xl border bg-background py-3 px-4 pr-4 font-body text-sm text-foreground focus:outline-none focus:ring-2 ${errors.governorate
                          ? "border-destructive focus:ring-destructive/20"
                          : "border-border focus:border-primary focus:ring-primary/20"
                          }`}
                      >
                        <option value="">اختر المحافظة</option>
                        {governorates.map(gov => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.governorate && <p className="mt-1 font-body text-xs text-destructive">{errors.governorate}</p>}
                    {/* Delivery Fee Info */}
                    <p className="mt-1 font-body text-xs text-muted-foreground">التوصيل مجاني لجميع المحافظات</p>
                  </div>

                  {/* Area */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm font-medium text-foreground">
                      <MapPin size={14} />
                      المنطقة / الحي *
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      placeholder="مثال: الدوار السابع، طبربور"
                      className={`w-full rounded-xl border bg-background py-3 px-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${errors.area
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                        }`}
                    />
                    {errors.area && <p className="mt-1 font-body text-xs text-destructive">{errors.area}</p>}
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm font-medium text-foreground">
                      <MapPin size={14} />
                      العنوان التفصيلي *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="اسم الشارع، رقم البناية، الطابق..."
                      rows={2}
                      className={`w-full resize-none rounded-xl border bg-background py-3 px-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${errors.address
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                        }`}
                    />
                    {errors.address && <p className="mt-1 font-body text-xs text-destructive">{errors.address}</p>}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 font-body text-sm font-medium text-foreground">
                      <FileText size={14} />
                      ملاحظات إضافية (اختياري)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="أي تعليمات خاصة للتوصيل..."
                      rows={2}
                      className="w-full resize-none rounded-xl border border-border bg-background py-3 px-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                    <CreditCard size={20} className="text-success" />
                  </div>
                  <h2 className="font-sans text-lg font-bold text-foreground">طريقة الدفع</h2>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentMethod", "cod")}
                    className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${formData.paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${formData.paymentMethod === "cod" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                      <Banknote size={20} />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-sans text-sm font-bold text-foreground">الدفع عند الاستلام</p>
                      <p className="font-body text-xs text-muted-foreground">ادفع نقداً عند استلام طلبك</p>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${formData.paymentMethod === "cod" ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}>
                      {formData.paymentMethod === "cod" && <Check size={12} className="text-primary-foreground" />}
                    </div>
                  </button>

                  {/* CliQ / Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentMethod", "cliq")}
                    className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${formData.paymentMethod === "cliq"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${formData.paymentMethod === "cliq" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                      <Building2 size={20} />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-sans text-sm font-bold text-foreground">CliQ / تحويل بنكي</p>
                      <p className="font-body text-xs text-muted-foreground">سنرسل لك تفاصيل الحساب عبر واتساب</p>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${formData.paymentMethod === "cliq" ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}>
                      {formData.paymentMethod === "cliq" && <Check size={12} className="text-primary-foreground" />}
                    </div>
                  </button>

                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-200 dark:border-amber-800">
                    <p className="font-body text-sm text-amber-800 dark:text-amber-200">
                      💡 سيتم التواصل معك عبر واتساب (0787257247) لإتمام عملية الدفع قبل شحن الطلب
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button - Mobile */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full btn-primary py-4 text-base justify-center lg:hidden"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    تأكيد الطلب - {total} JD
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary - 2 columns */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Cart Items */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sans text-lg font-bold text-foreground">ملخص الطلب</h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary">
                    {totalItems} منتج
                  </span>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className={`flex gap-3 rounded-xl p-3 ${item.isCustomDesign ? "bg-accent/10 border border-accent/30" : "bg-muted/50"}`}>
                      <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.image}
                          alt={item.titleAr}
                          fill
                          className={item.isCustomDesign ? "object-contain" : "object-cover"}
                        />
                        {item.isCustomDesign && (
                          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                            <span className="text-[10px]">✨</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-sm font-bold text-foreground line-clamp-1">{item.titleAr}</h4>
                        <p className="font-body text-xs text-muted-foreground">
                          {item.size} • {item.category === "hoodies" ? "هودي" : "كوب"}
                          {item.isCustomDesign && item.customDesign && (
                            <> • <span className="text-accent font-semibold">{item.customDesign.config.side === "front" ? "أمام" : "خلف"}</span></>
                          )}
                        </p>
                        {item.isCustomDesign && (
                          <span className="inline-flex items-center gap-1 mt-0.5 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent font-semibold">
                            ✨ تصميم مخصص
                          </span>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg border border-border bg-background">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center font-body text-xs font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-sans text-sm font-bold text-primary">{item.price * item.quantity} JD</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">المجموع الفرعي</span>
                    <span className="font-body text-sm text-foreground">{subtotal} JD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">التوصيل</span>
                    <span className={`font-body text-sm ${Number(deliveryFee) === 0 ? "text-success" : "text-foreground"}`}>
                      {Number(deliveryFee) === 0 ? "مجاني" : `${deliveryFee} JD`}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-success">خصم ({appliedCoupon.code})</span>
                      <span className="font-body text-sm text-success">-{discountAmount.toFixed(2)} JD</span>
                    </div>
                  )}

                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-base font-bold text-foreground">الإجمالي</span>
                      <span className="font-sans text-2xl font-black text-primary">{total} JD</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Desktop */}
                <button
                  type="submit"
                  form="checkout-form"
                  onClick={handleSubmit}
                  disabled={isSubmitting || items.length === 0}
                  className="mt-6 w-full btn-primary py-4 text-base justify-center hidden lg:flex"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      تأكيد الطلب
                    </>
                  )}
                </button>
              </div>

              {/* Coupon Section */}
              <div className="rounded-2xl border border-border bg-card p-6 mt-4">
                <h3 className="font-sans text-sm font-bold text-foreground mb-3">لديك كود خصم؟</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="أدخل الكود هنا"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                        setDiscountAmount(0);
                      }}
                      className="rounded-xl bg-destructive/10 text-destructive px-4 py-2 text-sm font-bold hover:bg-destructive/20 transition-colors"
                    >
                      إزالة
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || isCheckingCoupon}
                      className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isCheckingCoupon ? <Loader2 size={16} className="animate-spin" /> : "تطبيق"}
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <p className={`mt-2 text-xs ${appliedCoupon ? "text-success" : "text-destructive"}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  <span className="font-body text-xs text-muted-foreground">توصيل سريع</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  <span className="font-body text-xs text-muted-foreground">جودة عالية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span className="font-body text-xs text-muted-foreground">دفع آمن</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
