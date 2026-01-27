"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search, Package } from "lucide-react"

export default function TrackOrderSearchPage() {
  const router = useRouter()
  const [searchId, setSearchId] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      router.push(`/track-order/${searchId.trim()}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} />
          العودة للرئيسية
        </Link>

        <div className="rounded-3xl bg-card border border-border p-8 shadow-xl text-center">
          <div className="mx-auto mb-6 rounded-full bg-primary/10 p-6 w-fit">
            <Package size={48} className="text-primary" />
          </div>
          
          <h1 className="font-sans text-2xl font-bold text-foreground mb-2">
            تتبع طلبك
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            أدخل رقم الطلب لمعرفة حالته الحالية
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="ORDER-XXXXXXXX-XXX"
                className="w-full rounded-xl border border-border bg-background py-4 pr-12 pl-4 font-mono text-center placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                dir="ltr"
              />
            </div>
            
            <button
              type="submit"
              disabled={!searchId.trim()}
              className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={18} />
              تتبع الطلب
            </button>
          </form>

          <p className="font-body text-xs text-muted-foreground mt-6">
            ستجد رقم الطلب في رسالة التأكيد أو في صفحة تأكيد الطلب
          </p>
        </div>
      </div>
    </main>
  )
}
