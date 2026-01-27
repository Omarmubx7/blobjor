'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Send, CheckCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const subjects = [
  { value: 'general', label: 'استفسار عام' },
  { value: 'order', label: 'استفسار عن طلب' },
  { value: 'custom', label: 'طلب تصميم مخصص' },
  { value: 'bulk', label: 'طلبات بالجملة' },
  { value: 'complaint', label: 'شكوى' },
  { value: 'other', label: 'أخرى' },
]

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In production, you would send to an API
    console.log('Contact form submitted:', formData)

    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">تم إرسال رسالتك بنجاح!</h3>
          <p className="text-muted-foreground mb-4">
            شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
              })
            }}
          >
            إرسال رسالة أخرى
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أحمد محمد"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
                required
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="079 123 4567"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">الموضوع *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                required
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="اختر الموضوع" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">الرسالة *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="اكتب رسالتك هنا..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                إرسال الرسالة
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
