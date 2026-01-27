import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Heart,
  Target,
  Users,
  Sparkles,
  Leaf,
  Award,
  ArrowLeft,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'من نحن | BloB.JO',
  description: 'تعرف على قصة BloB.JO - منصة الطباعة حسب الطلب الرائدة في الأردن. نحول أفكارك إلى منتجات حقيقية بجودة عالية',
  openGraph: {
    title: 'من نحن | BloB.JO',
    description: 'تعرف على قصة BloB.JO - منصة الطباعة حسب الطلب الرائدة في الأردن',
    type: 'website',
  },
}

const values = [
  {
    icon: Heart,
    title: 'الشغف',
    description: 'نحب ما نفعله ونسعى دائماً لتقديم الأفضل لعملائنا',
  },
  {
    icon: Target,
    title: 'الجودة',
    description: 'نلتزم بأعلى معايير الجودة في كل منتج نقدمه',
  },
  {
    icon: Users,
    title: 'العملاء أولاً',
    description: 'رضا عملائنا هو هدفنا الأول والأخير',
  },
  {
    icon: Sparkles,
    title: 'الإبداع',
    description: 'نشجع التفكير الإبداعي ونساعدك على تحقيق رؤيتك',
  },
  {
    icon: Leaf,
    title: 'الاستدامة',
    description: 'نحرص على استخدام مواد صديقة للبيئة قدر الإمكان',
  },
  {
    icon: Award,
    title: 'التميز',
    description: 'نسعى للتميز في كل ما نقدمه من خدمات ومنتجات',
  },
]

const stats = [
  { value: '10,000+', label: 'طلب منفذ' },
  { value: '5,000+', label: 'عميل سعيد' },
  { value: '50+', label: 'منتج مختلف' },
  { value: '2024', label: 'سنة التأسيس' },
]

const team = [
  {
    name: 'أحمد محمد',
    role: 'المؤسس والرئيس التنفيذي',
    image: '/images/team/ceo.jpg',
  },
  {
    name: 'سارة أحمد',
    role: 'مديرة التصميم',
    image: '/images/team/designer.jpg',
  },
  {
    name: 'محمد علي',
    role: 'مدير العمليات',
    image: '/images/team/operations.jpg',
  },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background" dir="rtl">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                نحوّل أفكارك إلى <span className="text-primary">واقع</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                BloB.JO هي منصة الطباعة حسب الطلب الرائدة في الأردن. نساعدك على تحويل إبداعاتك إلى منتجات حقيقية بجودة عالية.
              </p>
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  اكتشف منتجاتنا
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    بدأت فكرة BloB.JO في عام 2024 من شغف حقيقي بالتصميم والإبداع. أردنا إنشاء منصة تمكّن كل شخص من تحويل أفكاره الإبداعية إلى منتجات ملموسة.
                  </p>
                  <p>
                    اليوم، نفخر بخدمة آلاف العملاء في جميع أنحاء الأردن، ونسعى باستمرار لتوسيع نطاق خدماتنا وتحسين جودة منتجاتنا.
                  </p>
                  <p>
                    نؤمن بأن كل شخص لديه قصة يريد أن يرويها، ونحن هنا لمساعدتك على رواية قصتك من خلال منتجات فريدة تعبر عنك.
                  </p>
                </div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">🎨</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-primary-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-background">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">رسالتنا</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                نسعى لتمكين كل شخص من التعبير عن إبداعه وهويته من خلال منتجات مخصصة عالية الجودة. نؤمن بأن كل فكرة تستحق أن تُرى، وكل تصميم يستحق أن يُطبع بأفضل صورة ممكنة.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              انضم إلى آلاف العملاء الذين يثقون بنا لتحويل أفكارهم إلى منتجات حقيقية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg">تصفح المنتجات</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">تواصل معنا</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
