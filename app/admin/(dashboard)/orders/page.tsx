"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles,
  Eye
} from "lucide-react"

interface OrderItem {
  id: number
  productName: string
  quantity: number
  customDesignId: number | null
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerCity: string
  totalPrice: number
  status: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, currentPage])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      params.append("page", currentPage.toString())
      params.append("limit", "20")

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      setOrders(data.orders || [])
      setPagination(data.pagination || null)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query)
    )
  })

  const hasCustomDesigns = (items: OrderItem[]) => {
    return items.some(item => item.customDesignId !== null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-foreground">الطلبات</h1>
          <p className="font-body text-sm text-muted-foreground">
            إدارة ومتابعة جميع الطلبات
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث برقم الطلب أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-4 font-body text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-lg border border-border bg-background py-2.5 px-4 font-body text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">جميع الحالات</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-sans text-lg font-bold text-foreground mb-2">لا توجد طلبات</h3>
            <p className="font-body text-sm text-muted-foreground">
              {searchQuery ? "لم يتم العثور على نتائج" : "لم يتم تسجيل أي طلبات بعد"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-right font-body text-xs font-semibold text-muted-foreground">رقم الطلب</th>
                    <th className="px-4 py-3 text-right font-body text-xs font-semibold text-muted-foreground">العميل</th>
                    <th className="px-4 py-3 text-right font-body text-xs font-semibold text-muted-foreground">المنتجات</th>
                    <th className="px-4 py-3 text-right font-body text-xs font-semibold text-muted-foreground">المبلغ</th>
                    <th className="px-4 py-3 text-right font-body text-xs font-semibold text-muted-foreground">الحالة</th>
                    <th className="px-4 py-3 text-right font-body text-xs font-semibold text-muted-foreground">التاريخ</th>
                    <th className="px-4 py-3 text-center font-body text-xs font-semibold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => {
                    const statusStyle = statusColors[order.status] || statusColors.pending
                    const hasCustom = hasCustomDesigns(order.items)

                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-foreground">
                              {order.id}
                            </span>
                            {hasCustom && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white" title="يحتوي تصميم مخصص">
                                <Sparkles size={10} />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-body text-sm font-semibold text-foreground">{order.customerName}</p>
                          <p className="font-body text-xs text-muted-foreground">{order.customerCity}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-body text-sm text-foreground">
                            {order.items.length} منتج
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-sans text-sm font-bold text-primary">
                            {order.totalPrice} JD
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                            <span className="font-body text-xs font-semibold">{statusLabels[order.status]}</span>
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-body text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), "PP", { locale: ar })}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 font-body text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                            >
                              <Eye size={14} />
                              عرض
                            </Link>
                            {hasCustom && (
                              <Link
                                href={`/admin/orders/${order.id}/design`}
                                className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 font-body text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                                title="ملفات التصميم"
                              >
                                <Sparkles size={14} />
                                ملفات
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-border">
              {filteredOrders.map((order) => {
                const statusStyle = statusColors[order.status] || statusColors.pending
                const hasCustom = hasCustomDesigns(order.items)

                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {order.id}
                        </span>
                        {hasCustom && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                            <Sparkles size={10} />
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon}
                        <span className="font-body text-xs font-semibold">{statusLabels[order.status]}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground">{order.customerName}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {order.items.length} منتج • {order.customerCity}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-sans text-sm font-bold text-primary">{order.totalPrice} JD</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {format(new Date(order.createdAt), "PP", { locale: ar })}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-muted-foreground">
            عرض {(currentPage - 1) * pagination.limit + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} من {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            <span className="font-body text-sm">
              {currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage === pagination.totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
