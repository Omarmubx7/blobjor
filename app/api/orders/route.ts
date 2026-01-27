import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadBase64Image } from "@/lib/cloudinary";

// Generate order ID: ORDER-YYYYMMDD-XXX
async function generateOrderId(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  // Count orders created today
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const todayOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const orderNumber = String(todayOrders + 1).padStart(3, "0");
  return `ORDER-${dateStr}-${orderNumber}`;
}

// Custom design item type
interface CustomDesignItem {
  designImageUrl: string; // Can be base64 or URL
  mockupImageUrl?: string;
  config: {
    position_x: number;
    position_y: number;
    scale: number;
    rotation: number;
    side: "front" | "back";
    canvasJson?: object;
    assetUrls?: string[];
  };
  notes?: string;
  productColor: string;
}

// POST - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity = "عمّان",
      items,
      paymentMethod = "cod",
      notes,
      shippingCost = 0,
    } = body;

    // Validation
    if (!customerName || !customerPhone || !customerAddress || !customerEmail || !items?.length) {
      return NextResponse.json(
        { error: "الرجاء تعبئة جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }

    // Find or create customer first
    let customer = await prisma.customer.findUnique({
      where: { phone: customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail || null,
          phone: customerPhone,
          address: customerAddress,
          city: customerCity,
        },
      });
    }

    // Calculate totals and process custom designs
    let totalPrice = 0;
    const processedItems = [];

    for (const item of items as Array<{
      productType: string;
      productName: string;
      designData?: string;
      color?: string;
      size?: string;
      quantity: number;
      unitPrice: number;
      isCustomDesign?: boolean;
      customDesign?: CustomDesignItem;
    }>) {
      const subtotal = item.quantity * item.unitPrice;
      totalPrice += subtotal;

      let customDesignId: string | null = null;

      // Handle custom design items
      if (item.isCustomDesign && item.customDesign) {
        try {
          let designImageUrl = item.customDesign.designImageUrl;
          let mockupImageUrl = item.customDesign.mockupImageUrl;

          // Try to upload to Cloudinary if configured, otherwise use base64 directly
          const cloudinaryConfigured =
            process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_CLOUD_NAME !== "your-cloud-name" &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_KEY !== "your-api-key";

          if (cloudinaryConfigured) {
            // Upload base64 images to Cloudinary
            if (designImageUrl.startsWith("data:")) {
              try {
                const uploadResult = await uploadBase64Image(designImageUrl, "designs");
                designImageUrl = uploadResult.url;
              } catch (uploadErr) {
                console.error("Cloudinary upload failed, using base64:", uploadErr);
                // Keep base64 data as fallback
              }
            }

            if (mockupImageUrl && mockupImageUrl.startsWith("data:")) {
              try {
                const uploadResult = await uploadBase64Image(mockupImageUrl, "mockups");
                mockupImageUrl = uploadResult.url;
              } catch (uploadErr) {
                console.error("Cloudinary mockup upload failed:", uploadErr);
                // Keep base64 data as fallback
              }
            }
          }
          // If Cloudinary is not configured, designImageUrl will remain as base64
          // This is fine for SQLite/small scale, but should be uploaded for production

          // Create custom design record
          const customDesign = await prisma.customDesign.create({
            data: {
              customerId: customer.id,
              designImageUrl,
              mockupImageUrl: mockupImageUrl || null,
              config: JSON.stringify(item.customDesign.config), // Stringify the config
              notes: item.customDesign.notes || null,
              status: "submitted",
            },
          });

          customDesignId = customDesign.id;
          console.log("✅ Custom design saved:", customDesign.id);
        } catch (designError) {
          console.error("Error processing custom design:", designError);
          // Continue without custom design if save fails
        }
      }

      processedItems.push({
        productType: item.productType,
        productName: item.productName,
        designData: item.designData || null,
        color: item.color || item.customDesign?.productColor || null,
        size: item.size || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal,
        customDesignId,
      });
    }

    // Add shipping to total
    totalPrice += shippingCost;
    let discount = 0;
    let validCouponId = null;

    // Handle Coupon
    if (body.couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: body.couponId },
      });

      if (coupon && coupon.isActive) {
        // Double check validity (expiry, usage)
        const isExpired = coupon.expiresAt && new Date() > coupon.expiresAt;
        const isDepleted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
        const isBelowMin = coupon.minOrderValue && (totalPrice - shippingCost) < coupon.minOrderValue; // Check against subtotal

        if (!isExpired && !isDepleted && !isBelowMin) {
          validCouponId = coupon.id;

          if (coupon.discountType === "percentage") {
            discount = ((totalPrice - shippingCost) * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }

          // Ensure discount doesn't exceed subtotal
          if (discount > (totalPrice - shippingCost)) {
            discount = (totalPrice - shippingCost);
          }

          totalPrice -= discount;

          // Increment usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } }
          });
        }
      }
    }

    // Generate order ID
    const orderId = await generateOrderId();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        id: orderId,
        customerId: customer.id,
        customerName,
        customerEmail: customerEmail || null,
        customerPhone,
        customerAddress,
        customerCity,
        totalPrice,
        shippingCost,
        shippingCost,
        paymentMethod,
        notes: notes || null,
        couponId: validCouponId,
        discount: discount,
        items: {
          create: processedItems,
        },
        statusHistory: {
          create: {
            newStatus: "pending",
            notes: "تم إنشاء الطلب",
          },
        },
      },
      include: {
        items: {
          include: {
            customDesign: true,
          },
        },
        statusHistory: true,
      },
    });

    // Update customer stats
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: totalPrice },
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: "تم إنشاء طلبك بنجاح!",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الطلب" },
      { status: 500 }
    );
  }
}

// GET - List orders (with optional filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const phone = searchParams.get("phone");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: {
      status?: string;
      customerPhone?: string;
    } = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (phone) {
      where.customerPhone = phone;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          statusHistory: {
            orderBy: { changedAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}
