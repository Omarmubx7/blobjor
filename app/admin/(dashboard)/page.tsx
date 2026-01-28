import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import prisma from '@/lib/prisma'
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

async function getStats() {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.count({ where: { status: 'delivered' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Calculate revenue from completed orders
  const orders = await prisma.order.findMany({
    where: { status: { in: ['delivered', 'shipped'] } },
    select: { totalPrice: true },
  })
  const totalRevenue = orders.reduce((sum: number, order: { totalPrice: number }) => sum + order.totalPrice, 0)

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    recentOrders,
  }
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: { value: number; positive: boolean }
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={`flex items-center text-xs mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 ml-1 ${!trend.positive && 'rotate-180'}`} />
            <span>{trend.value}% من الشهر الماضي</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'processing':
      return <Package className="h-4 w-4 text-blue-500" />
    case 'shipped':
      return <Truck className="h-4 w-4 text-purple-500" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'cancelled':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

function getStatusText(status: string) {
  const statuses: Record<string, string> = {
    pending: 'قيد الانتظار',
    processing: 'جارٍ التجهيز',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
  }
  return statuses[status] || status
}

async function DashboardContent() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي المنتجات"
          value={stats.totalProducts}
          icon={Package}
          description="منتج في المتجر"
        />
        <StatCard
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          icon={ShoppingCart}
          description={`${stats.pendingOrders} طلب قيد الانتظار`}
        />
        <StatCard
          title="الإيرادات"
          value={`${stats.totalRevenue.toFixed(2)} د.أ`}
          icon={DollarSign}
          description="من الطلبات المكتملة"
        />
        <StatCard
          title="معدل الإنجاز"
          value={stats.totalOrders > 0
            ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%`
            : '0%'
          }
          icon={TrendingUp}
          description={`${stats.completedOrders} طلب مكتمل`}
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>أحدث الطلبات</CardTitle>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            عرض الكل
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              لا توجد طلبات حتى الآن
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium text-sm">
                        طلب #{order.id.slice(-8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">
                      {order.totalPrice.toFixed(2)} د.أ
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/products/new">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">إضافة منتج</h3>
                <p className="text-sm text-muted-foreground">
                  أضف منتج جديد للمتجر
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">إدارة الطلبات</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingOrders} طلب بانتظار المعالجة
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/homepage">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">تخصيص الصفحة الرئيسية</h3>
                <p className="text-sm text-muted-foreground">
                  عدّل محتوى الصفحة الرئيسية
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">
          مرحباً بك في لوحة تحكم BloB.JO
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
