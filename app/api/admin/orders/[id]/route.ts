import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch single order with all details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            customDesign: true,
          },
        },
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

// PATCH - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, notes } = body;

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      status?: string;
      paymentStatus?: string;
      notes?: string;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (status && status !== currentOrder.status) {
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Update order and create status history if status changed
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        ...(status && status !== currentOrder.status
          ? {
              statusHistory: {
                create: {
                  oldStatus: currentOrder.status,
                  newStatus: status,
                  notes: getStatusChangeNote(status),
                },
              },
            }
          : {}),
      },
      include: {
        items: {
          include: {
            customDesign: true,
          },
        },
        statusHistory: {
          orderBy: { changedAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order,
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

// DELETE - Cancel/delete order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    // Soft delete - just update status to cancelled
    await prisma.order.update({
      where: { id },
      data: {
        status: "cancelled",
        statusHistory: {
          create: {
            oldStatus: order.status,
            newStatus: "cancelled",
            notes: "تم إلغاء الطلب",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إلغاء الطلب بنجاح",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إلغاء الطلب" },
      { status: 500 }
    );
  }
}

// Helper to generate status change notes
function getStatusChangeNote(status: string): string {
  const notes: Record<string, string> = {
    pending: "الطلب قيد الانتظار",
    confirmed: "تم تأكيد الطلب",
    processing: "الطلب قيد التجهيز",
    shipped: "تم شحن الطلب",
    delivered: "تم تسليم الطلب",
    cancelled: "تم إلغاء الطلب",
  };
  return notes[status] || "تم تحديث حالة الطلب";
}
