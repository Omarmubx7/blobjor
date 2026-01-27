
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { code, totalAmount } = body

        if (!code) {
            return NextResponse.json(
                { valid: false, message: "الرجاء إدخال كود الخصم" },
                { status: 400 }
            )
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code },
        })

        if (!coupon) {
            return NextResponse.json(
                { valid: false, message: "كود الخصم غير صالح" },
                { status: 404 }
            )
        }

        if (!coupon.isActive) {
            return NextResponse.json(
                { valid: false, message: "كود الخصم غير فعال" },
                { status: 400 }
            )
        }

        // Check expiry
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json(
                { valid: false, message: "لقد انتهت صلاحية كود الخصم" },
                { status: 400 }
            )
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json(
                { valid: false, message: "تم تجاوز الحد المسموح لاستخدام هذا الكود" },
                { status: 400 }
            )
        }

        // Check min order value
        if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
            return NextResponse.json(
                {
                    valid: false,
                    message: `يجب أن يكون مجموع الطلب ${coupon.minOrderValue} د.أ على الأقل لاستخدام هذا الكود`
                },
                { status: 400 }
            )
        }

        // Calculate discount
        let discount = 0
        if (coupon.discountType === "percentage") {
            discount = (totalAmount * coupon.discountValue) / 100
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount
            }
        } else {
            discount = coupon.discountValue
        }

        // Ensure discount doesn't exceed total amount
        if (discount > totalAmount) {
            discount = totalAmount
        }

        return NextResponse.json({
            valid: true,
            discount,
            couponId: coupon.id,
            code: coupon.code,
            message: "تم تطبيق الخصم بنجاح"
        })

    } catch (error) {
        console.error("Coupon validation error:", error)
        return NextResponse.json(
            { valid: false, message: "حدث خطأ أثناء التحقق من الكود" },
            { status: 500 }
        )
    }
}
