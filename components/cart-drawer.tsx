"use client"

import { useCart } from "@/contexts/cart-context"
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowLeft, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalItems, subtotal } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm animate-fade-in-up"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-[70] w-full max-w-md bg-background shadow-2xl animate-slide-in-right">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShoppingBag size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-bold text-foreground">سلة التسوق</h2>
                <p className="font-body text-sm text-muted-foreground">{totalItems} منتج</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <ShoppingBag size={40} className="text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-sans text-xl font-bold text-foreground">السلة فارغة</h3>
                <p className="mb-6 font-body text-muted-foreground">لم تضف أي منتجات بعد</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary"
                >
                  <ArrowLeft size={18} />
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className={`flex gap-4 rounded-2xl border bg-card p-4 transition-all hover:shadow-md ${item.isCustomDesign ? "border-accent/50 bg-accent/5" : "border-border"
                      }`}
                  >
                    {/* Product Image */}
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={item.image}
                        alt={item.titleAr}
                        fill
                        className="object-cover"
                      />
                      {/* Custom Design Badge */}
                      {item.isCustomDesign && (
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow-lg">
                          <Sparkles size={12} />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-sans text-sm font-bold text-foreground line-clamp-1">
                          {item.titleAr}
                        </h4>
                        <p className="font-body text-xs text-muted-foreground">{item.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-muted px-2 py-0.5 font-body text-xs text-foreground">
                            {item.size}
                          </span>
                          <span className="font-body text-xs text-muted-foreground">
                            {item.category === "hoodies" ? "هودي" : "كوب"}
                          </span>
                          {item.isCustomDesign && (
                            <span className="rounded-md bg-accent/20 px-2 py-0.5 font-body text-xs text-accent font-semibold">
                              تصميم مخصص
                            </span>
                          )}
                          {item.customDesign?.productColor && (
                            <span
                              className="h-4 w-4 rounded-full border border-border"
                              style={{ backgroundColor: item.customDesign.productColor }}
                              title={`اللون: ${item.customDesign.productColor}`}
                            />
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 rounded-lg border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-body text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-base font-bold text-primary">
                            {item.price * item.quantity} JD
                          </span>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border bg-muted/50 p-6">
              {/* Subtotal */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-body text-muted-foreground">الإجمالي الفرعي</span>
                <span className="font-sans text-xl font-bold text-foreground">{subtotal} JD</span>
              </div>

              {/* Free Shipping Note */}


              {/* CTAs */}
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary w-full justify-center py-4 text-base"
                >
                  إتمام الطلب
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-secondary w-full justify-center py-3"
                >
                  متابعة التسوق
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
