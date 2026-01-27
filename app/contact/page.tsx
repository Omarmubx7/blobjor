import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContactForm } from '@/components/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'اتصل بنا | BloB.JO',
  description: 'تواصل مع فريق BloB.JO - نحن هنا لمساعدتك. راسلنا أو اتصل بنا للاستفسارات والطلبات الخاصة',
  openGraph: {
    title: 'اتصل بنا | BloB.JO',
    description: 'تواصل مع فريق BloB.JO - نحن هنا لمساعدتك',
    type: 'website',
  },
}

const contactInfo = [
  {
    icon: Phone,
    title: 'الهاتف',
    value: '+962 78 725 7247',
    href: 'tel:+962787257247',
  },
  {
    icon: MapPin,
    title: 'العنوان',
    value: 'عمّان، الأردن',
    href: 'https://maps.google.com/?q=Amman,Jordan',
  },
  {
    icon: Clock,
    title: 'ساعات العمل',
    value: 'السبت - الخميس: 9 ص - 6 م',
    href: null,
  },
]

const socialLinks = [
  {
    icon: Instagram,
    name: 'Instagram',
    href: 'https://instagram.com/blob.jor',
    username: '@blob.jor',
  },
  {
    icon: MessageCircle,
    name: 'WhatsApp',
    href: 'https://wa.me/962787257247',
    username: '+962 78 725 7247',
  },
]

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background" dir="rtl">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              تواصل معنا
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نحن هنا لمساعدتك! راسلنا أو اتصل بنا وسنرد عليك في أقرب وقت
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">معلومات التواصل</h2>
                  <div className="grid gap-4">
                    {contactInfo.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          {item.href ? (
                            <a
                              href={item.href}
                              target={item.href.startsWith('http') ? '_blank' : undefined}
                              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="flex items-center gap-4 hover:text-primary transition-colors"
                            >
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <item.icon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">{item.title}</p>
                                <p className="font-medium">{item.value}</p>
                              </div>
                            </a>
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <item.icon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">{item.title}</p>
                                <p className="font-medium">{item.value}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-xl font-bold mb-4">تابعنا على</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        title={social.name}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div>
                  <h3 className="text-xl font-bold mb-4">موقعنا</h3>
                  <div className="aspect-video rounded-2xl bg-muted overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108703.09857064578!2d35.83873395820312!3d31.95314990000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca0f54f8a6d2f%3A0x9b9d5c39e9c4b1e!2sAmman%2C%20Jordan!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
