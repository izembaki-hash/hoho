'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mail, Phone, MapPin, Send, CheckCircle, 
  Clock, MessageSquare, User, AtSign 
} from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.')
      }
    } catch {
      setError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">اتصل بنا</h2>
        <p className="text-muted-foreground">تواصل معنا لطرح انشغالاتكم ومقترحاتكم</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">نموذج المراسلة</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {submitSuccess && (
                <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-900">تم إرسال رسالتك بنجاح!</h4>
                    <p className="text-sm text-emerald-700">سنقوم بالرد عليك في أقرب وقت ممكن</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="contact-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="flex items-center gap-2">
                      <AtSign className="h-4 w-4" />
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="example@email.com"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    الموضوع *
                  </Label>
                  <Input
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="موضوع رسالتك"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    الرسالة *
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    className="resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      جاري الإرسال...
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
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">معلومات التواصل</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">البريد الإلكتروني</h4>
                    <p className="text-sm text-muted-foreground" dir="ltr">contact@alta7reer.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">رقم الهاتف</h4>
                    <p className="text-sm text-muted-foreground" dir="ltr">+213 555 123 456</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">العنوان</h4>
                    <p className="text-sm text-muted-foreground">الجزائر العاصمة، الجزائر</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">ساعات العمل</h4>
                    <p className="text-sm text-muted-foreground">الأحد - الخميس: 8:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-bl from-primary to-emerald-800 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">تواصل مباشر</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                يمكنك التواصل مباشرة مع المشرف على الموقع للاستفسار أو طرح أي انشغال. نحن هنا لمساعدتك!
              </p>
              <Button variant="secondary" className="w-full gap-2" onClick={() => window.open('mailto:contact@alta7reer.com')}>
                <Mail className="h-4 w-4" />
                مراسلة المشرف
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
