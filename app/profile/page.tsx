import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, User, LogOut, ShoppingBag } from "lucide-react"
import Link from "next/link"

// Logout Action
async function logoutAction() {
    "use server"
    await signOut({ redirectTo: "/" })
}

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login?callbackUrl=/profile")
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
        where: {
            // @ts-ignore - session.user.id is added via callback
            customerId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            // orderItems: true, // Deprecated in schema
        },
    })

    return (
        <Container className="py-12">
            <div className="grid gap-8 md:grid-cols-[300px_1fr]" dir="rtl">
                {/* Sidebar / User Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                معلومات الحساب
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">الاسم</p>
                                <p className="font-medium">{session.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                                <p className="font-medium">{session.user.email}</p>
                            </div>
                            <Separator />
                            <form action={logoutAction}>
                                <Button variant="destructive" className="w-full gap-2" type="submit">
                                    <LogOut className="h-4 w-4" />
                                    تسجيل الخروج
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content / Orders */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Package className="h-6 w-6 text-primary" />
                            طلباتي
                        </h1>
                    </div>

                    {orders.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">لا توجد طلبات بعد</h3>
                                <p className="text-muted-foreground mb-4">لم تقم بإجراء أي طلب حتى الآن.</p>
                                <Link href="/products">
                                    <Button>تصفح المنتجات</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="overflow-hidden">
                                    <CardHeader className="bg-muted/50 py-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="font-medium">طلب #{order.id}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString("ar-JO", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {order.status}
                                                </span>
                                                <p className="font-bold text-primary">
                                                    {order.totalPrice.toFixed(2)} د.أ
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="py-4">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">المنتجات:</p>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                                {order.items.map((item) => (
                                                    <li key={item.id}>
                                                        {item.quantity}x {item.product ? item.product.name : item.productName || "منتج مخصص"}
                                                        {item.size ? ` (${item.size})` : ""}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-4 pt-4 border-t flex justify-end">
                                                <Link href={`/track-order?orderId=${order.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        تتبع الطلب
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}
