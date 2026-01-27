"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Printer,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  MoreVertical,
  ShoppingBag,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Home
} from "lucide-react"

interface Stats {
  totalOrders: number
  pendingOrders: number
  todayOrders: number
  weekOrders: number
  monthOrders: number
  totalRevenue: number
  monthRevenue: number
  todayRevenue: number
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
  items: Array<{
    id: string
    productName: string
    quantity: number
  }>
}

interface TopProduct {
  name: string
  totalSold: number
  orderCount: number
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  printing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  ready: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  shipped: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  printing: "قيد الطباعة",
  ready: "جاهز",
  shipped: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
}

const paymentLabels: Record<string, string> = {
  cod: "عند الاستلام",
  cliq: "CliQ",
  bank: "تحويل بنكي",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({})
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    setRefreshing(true)
    try {
      // Fetch stats
      const statsRes = await fetch("/api/admin/stats")
      const statsData = await statsRes.json()
      setStats(statsData.stats)
      setOrdersByStatus(statsData.ordersByStatus || {})
      setTopProducts(statsData.topProducts || [])

      // Fetch orders
      const ordersRes = await fetch(`/api/orders?status=${statusFilter}&limit=50`)
      const ordersData = await ordersRes.json()
      setOrders(ordersData.orders || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus,
          changedBy: "Admin"
        }),
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.includes(query)
      )
    }
    return true
  })

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} JD`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-JO", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="font-sans text-xl font-bold text-foreground">لوحة التحكم</h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              BloB Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              تحديث
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <Home size={16} />
              الموقع
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <span className="flex items-center gap-1 text-xs text-success">
                <ArrowUp size={12} />
                +{stats?.todayOrders || 0} اليوم
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.totalOrders || 0}</p>
            <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-amber-500/10 p-3">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              {(stats?.pendingOrders || 0) > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  تحتاج اهتمام
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.pendingOrders || 0}</p>
            <p className="text-sm text-muted-foreground">طلبات معلقة</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-success/10 p-3">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <span className="flex items-center gap-1 text-xs text-success">
                <ArrowUp size={12} />
                +{formatCurrency(stats?.todayRevenue || 0)}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.totalRevenue || 0)}</p>
            <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-accent/10 p-3">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.monthRevenue || 0)}</p>
            <p className="text-sm text-muted-foreground">إيرادات هذا الشهر</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Orders Table */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card">
              {/* Table Header */}
              <div className="border-b border-border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="font-sans text-lg font-bold text-foreground">الطلبات</h2>
                  
                  <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="بحث..."
                        className="w-48 rounded-lg border border-border bg-background py-2 pr-9 pl-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="all">كل الحالات</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="printing">قيد الطباعة</option>
                      <option value="ready">جاهز</option>
                      <option value="shipped">في الطريق</option>
                      <option value="delivered">تم التوصيل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">رقم الطلب</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">العميل</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">المنتجات</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">الإجمالي</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">الحالة</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">التاريخ</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                          لا توجد طلبات
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-primary" dir="ltr">{order.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground" dir="ltr">{order.customerPhone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-foreground">
                              {order.items.slice(0, 2).map(i => `${i.productName} (${i.quantity})`).join(", ")}
                              {order.items.length > 2 && ` +${order.items.length - 2}`}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-foreground">{formatCurrency(order.totalPrice)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`rounded-lg px-2 py-1 text-xs font-medium ${statusColors[order.status]} border-0 focus:outline-none focus:ring-2 focus:ring-primary/20`}
                            >
                              <option value="pending">قيد الانتظار</option>
                              <option value="confirmed">مؤكد</option>
                              <option value="printing">قيد الطباعة</option>
                              <option value="ready">جاهز</option>
                              <option value="shipped">في الطريق</option>
                              <option value="delivered">تم التوصيل</option>
                              <option value="cancelled">ملغي</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/track-order/${order.id}`}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Eye size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Orders by Status */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-sans text-lg font-bold text-foreground mb-4">الطلبات حسب الحالة</h3>
              <div className="space-y-3">
                {Object.entries(ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className={`rounded-lg px-2 py-1 text-xs font-medium ${statusColors[status]}`}>
                      {statusLabels[status]}
                    </span>
                    <span className="font-bold text-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-sans text-lg font-bold text-foreground mb-4">الأكثر مبيعاً</h3>
              {topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-3">
                      <span className={`
                        flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                        ${index === 0 ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"}
                      `}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.orderCount} طلب</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{product.totalSold}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-sans text-lg font-bold text-foreground mb-4">إحصائيات سريعة</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">طلبات اليوم</span>
                  <span className="font-bold text-foreground">{stats?.todayOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">هذا الأسبوع</span>
                  <span className="font-bold text-foreground">{stats?.weekOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">هذا الشهر</span>
                  <span className="font-bold text-foreground">{stats?.monthOrders || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
