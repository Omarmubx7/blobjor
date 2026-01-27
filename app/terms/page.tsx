import { Container } from "@/components/ui/container"

export default function TermsPage() {
    return (
        <Container className="py-12">
            <div className="max-w-3xl mx-auto space-y-8" dir="rtl">
                <h1 className="text-3xl font-bold">الشروط والأحكام</h1>
                <p className="text-muted-foreground">تاريخ التحديث: 27 يناير 2026</p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">1. مقدمة</h2>
                    <p>أهلاً بك في منصة BloB.JO. باستخامك لموقعنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">2. المنتجات والطلبات</h2>
                    <p>جميع المنتجات المعروضة مخصصة حسب الطلب. نحتفظ بحق رفض أي طلب يحتوي على محتوى مخالف.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">3. الملكية الفكرية</h2>
                    <p>جميع التصاميم والمحتوى على الموقع هي ملك لـ BloB.JO أو مرخصيها.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">4. التعديلات</h2>
                    <p>نحتفظ بحق تعديل هذه الشروط في أي وقت. استمرارك في استخدام الموقع يعني موافقتك على التعديلات.</p>
                </section>
            </div>
        </Container>
    )
}
