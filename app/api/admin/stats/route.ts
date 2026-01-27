import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Admin Dashboard Stats
export async function GET() {
  try {
    // Get date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get stats
    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      weekOrders,
      monthOrders,
      totalRevenue,
      monthRevenue,
      todayRevenue,
      recentOrders,
      statusCounts,
      topProducts,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Pending orders (need attention)
      prisma.order.count({
        where: { status: "pending" },
      }),
      
      // Today's orders
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      
      // This week's orders
      prisma.order.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      
      // This month's orders
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      
      // Total revenue
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: "cancelled" } },
      }),
      
      // Month revenue
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: { gte: startOfMonth },
          status: { not: "cancelled" },
        },
      }),
      
      // Today revenue
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: { gte: startOfToday },
          status: { not: "cancelled" },
        },
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      
      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ["productName"],
        _sum: { quantity: true },
        _count: { productName: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

    // Transform status counts to object
    const statusMap: Record<string, number> = {};
    statusCounts.forEach((s: { status: string; _count: { status: number } }) => {
      statusMap[s.status] = s._count.status;
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        todayOrders,
        weekOrders,
        monthOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        monthRevenue: monthRevenue._sum.totalPrice || 0,
        todayRevenue: todayRevenue._sum.totalPrice || 0,
      },
      ordersByStatus: statusMap,
      recentOrders,
      topProducts: topProducts.map((p: { productName: string; _sum: { quantity: number | null }; _count: { productName: number } }) => ({
        name: p.productName,
        totalSold: p._sum.quantity || 0,
        orderCount: p._count.productName,
      })),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
