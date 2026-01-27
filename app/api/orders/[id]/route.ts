import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get single order by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: {
          orderBy: { changedAt: "desc" },
        },
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلب" },
      { status: 500 }
    );
  }
}

// PATCH - Update order (admin)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, adminNotes, changedBy } = body;

    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    const updateData: {
      status?: string;
      paymentStatus?: string;
      adminNotes?: string;
    } = {};

    if (status && status !== currentOrder.status) {
      updateData.status = status;
      
      // Create status history entry
      await prisma.statusHistory.create({
        data: {
          orderId: id,
          oldStatus: currentOrder.status,
          newStatus: status,
          changedBy: changedBy || "Admin",
          notes: getStatusChangeNote(status),
        },
      });
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        statusHistory: {
          orderBy: { changedAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "تم تحديث الطلب بنجاح",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الطلب" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/Delete order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    if (hardDelete) {
      // Permanently delete
      await prisma.order.delete({
        where: { id },
      });
      
      return NextResponse.json({
        success: true,
        message: "تم حذف الطلب نهائياً",
      });
    } else {
      // Soft delete - just mark as cancelled
      await prisma.order.update({
        where: { id },
        data: { status: "cancelled" },
      });

      await prisma.statusHistory.create({
        data: {
          orderId: id,
          oldStatus: order.status,
          newStatus: "cancelled",
          notes: "تم إلغاء الطلب",
        },
      });

      return NextResponse.json({
        success: true,
        message: "تم إلغاء الطلب",
      });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الطلب" },
      { status: 500 }
    );
  }
}

function getStatusChangeNote(status: string): string {
  const notes: Record<string, string> = {
    pending: "الطلب قيد الانتظار",
    confirmed: "تم تأكيد الطلب",
    printing: "الطلب قيد الطباعة",
    ready: "الطلب جاهز للتوصيل",
    shipped: "تم شحن الطلب",
    delivered: "تم توصيل الطلب",
    cancelled: "تم إلغاء الطلب",
  };
  return notes[status] || "تم تحديث حالة الطلب";
}
