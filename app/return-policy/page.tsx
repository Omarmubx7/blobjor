import { Container } from "@/components/ui/container"

export default function ReturnPolicyPage() {
    return (
        <Container className="py-12">
            <div className="max-w-3xl mx-auto space-y-8" dir="rtl">
                <h1 className="text-3xl font-bold">سياسة الاسترجاع</h1>
                <p className="text-muted-foreground">تاريخ التحديث: 27 يناير 2026</p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">1. المنتجات المخصصة</h2>
                    <p>نظراً لطبيعة المنتجات المخصصة (حسب الطلب)، لا يمكن إرجاعها أو استبدالها إلا في حالة وجود عيب تصنيعي أو تلف أثناء الشحن.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">2. عملية الاسترجاع</h2>
                    <p>إذا وصلك منتج معيب، يرجى التواصل معنا عبر واتساب خلال 3 أيام من الاستلام مع إرفاق صور للمنتج.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">3. الاسترداد المالي</h2>
                    <p>يتم استرداد المبلغ بنفس طريقة الدفع الأصلية أو كرصيد في المتجر حسب رغبتك، وذلك بعد التحقق من حالة المنتج.</p>
                </section>
            </div>
        </Container>
    )
}
