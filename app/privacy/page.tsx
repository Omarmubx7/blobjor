import { Container } from "@/components/ui/container"

export default function PrivacyPage() {
    return (
        <Container className="py-12">
            <div className="max-w-3xl mx-auto space-y-8" dir="rtl">
                <h1 className="text-3xl font-bold">سياسة الخصوصية</h1>
                <p className="text-muted-foreground">تاريخ التحديث: 27 يناير 2026</p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">1. المعلومات التي نجمعها</h2>
                    <p>نقوم بجمع اسمك، بريدك الإلكتروني، رقم هاتفك، وعنوان التوصيل لإتمام طلباتك.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">2. كيف نستخدم معلوماتك</h2>
                    <p>نستخدم معلوماتك لمعالجة الطلبات، التواصل معك، وتحسين تجربتك على الموقع.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">3. أمان البيانات</h2>
                    <p>نحن نلتزم بحماية بياناتك ونستخدم تقنيات أمان متقدمة لمنع الوصول غير المصرح به.</p>
                </section>
            </div>
        </Container>
    )
}
