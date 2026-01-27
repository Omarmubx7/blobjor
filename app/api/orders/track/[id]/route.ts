import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Track order by ID (public - no auth required)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        customerName: true,
        status: true,
        paymentStatus: true,
        totalPrice: true,
        shippingCost: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            unitPrice: true,
            subtotal: true,
            color: true,
            size: true,
            customDesign: {
              select: {
                id: true,
                designImageUrl: true,
                mockupImageUrl: true,
                config: true,
                notes: true,
                status: true,
              },
            },
          },
        },
        statusHistory: {
          orderBy: { changedAt: "desc" },
          select: {
            id: true,
            oldStatus: true,
            newStatus: true,
            notes: true,
            changedAt: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "الطلب غير موجود. تأكد من رقم الطلب." },
        { status: 404 }
      );
    }

    // Calculate estimated delivery based on status
    const estimatedDelivery = getEstimatedDelivery(order.status, order.createdAt);

    return NextResponse.json({
      order: {
        ...order,
        estimatedDelivery,
        statusLabel: getStatusLabel(order.status),
        statusProgress: getStatusProgress(order.status),
      },
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تتبع الطلب" },
      { status: 500 }
    );
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    printing: "قيد الطباعة",
    ready: "جاهز للتوصيل",
    shipped: "في الطريق",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };
  return labels[status] || status;
}

function getStatusProgress(status: string): number {
  const progress: Record<string, number> = {
    pending: 10,
    confirmed: 25,
    printing: 50,
    ready: 70,
    shipped: 85,
    delivered: 100,
    cancelled: 0,
  };
  return progress[status] || 0;
}

function getEstimatedDelivery(status: string, createdAt: Date): string | null {
  if (status === "delivered" || status === "cancelled") {
    return null;
  }

  // Estimate 3-5 business days from order creation
  const orderDate = new Date(createdAt);
  const minDays = status === "shipped" ? 1 : 3;
  const maxDays = status === "shipped" ? 2 : 5;

  const minDate = new Date(orderDate);
  minDate.setDate(minDate.getDate() + minDays);

  const maxDate = new Date(orderDate);
  maxDate.setDate(maxDate.getDate() + maxDays);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ar-JO", { month: "short", day: "numeric" });

  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
}
