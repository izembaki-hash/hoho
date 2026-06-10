'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, Phone, MapPin, Send, CheckCircle, 
  Clock, MessageSquare, User, AtSign, 
  HelpCircle, BookOpen, Video, Mic 
} from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

const faqs = [
  { q: 'كيف يمكنني التسجيل في الدروس المباشرة؟', a: 'يمكنك التسجيل من خلال صفحة الدروس المباشرة بالضغط على زر "انضمام" بجانب الدرس المراد والقيام بملء بياناتك.' },
  { q: 'هل الدروس المسجلة مجانية؟', a: 'نعم، جميع الدروس المسجلة متاحة مجاناً مع مرفقاتها التعليمية.' },
  { q: 'كيف يمكنني التواصل مع الأستاذ؟', a: 'يمكنك التواصل من خلال نموذج المراسلة في هذه الصفحة أو عبر البريد الإلكتروني المباشر.' },
  { q: 'هل المحتوى مناسب لجميع المستويات؟', a: 'نعم، المحتوى مصمم لثلاث فئات: التلاميذ والطلبة والأساتذة الجامعيين، كل فئة لها محتوى مخصص.' },
]

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">اتصل بنا</h2>
        <p className="text-muted-foreground">تواصل معنا لطرح انشغالاتكم ومقترحاتكم</p>
      </motion.div>

      {/* Quick Help */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => {
            const store = useAppStore
            import('@/lib/store').then(m => m.useAppStore.getState().setActiveSection('live-lessons'))
          }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-110 transition-transform">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">دروس مباشرة</h4>
                <p className="text-xs text-muted-foreground">انضم للدروس الحية</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => {
            import('@/lib/store').then(m => m.useAppStore.getState().setActiveSection('recorded-lessons'))
          }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">دروس مسجلة</h4>
                <p className="text-xs text-muted-foreground">شاهد الدروس مسجلة</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => {
            import('@/lib/store').then(m => m.useAppStore.getState().setActiveSection('oral-expression'))
          }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-110 transition-transform">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">التحرير الشفهي</h4>
                <p className="text-xs text-muted-foreground">تعلّم مهارات العرض</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                >
                  <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-200">تم إرسال رسالتك بنجاح!</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">سنقوم بالرد عليك في أقرب وقت ممكن</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
                >
                  {error}
                </motion.div>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact-message" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      الرسالة *
                    </Label>
                    <span className="text-xs text-muted-foreground">{formData.message.length} حرف</span>
                  </div>
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
                  className="w-full sm:w-auto gap-2 hover:scale-105 transition-transform"
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
        </motion.div>

        {/* Contact Info */}
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">معلومات التواصل</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Mail className="h-5 w-5" />, title: 'البريد الإلكتروني', value: 'contact@alta7reer.com', dir: 'ltr' },
                    { icon: <Phone className="h-5 w-5" />, title: 'رقم الهاتف', value: '+213 555 123 456', dir: 'ltr' },
                    { icon: <MapPin className="h-5 w-5" />, title: 'العنوان', value: 'الجزائر العاصمة، الجزائر', dir: 'rtl' },
                    { icon: <Clock className="h-5 w-5" />, title: 'ساعات العمل', value: 'الأحد - الخميس: 8:00 - 17:00', dir: 'rtl' },
                  ].map((info, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{info.title}</h4>
                        <p className="text-sm text-muted-foreground" dir={info.dir}>{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md bg-gradient-to-bl from-primary to-emerald-800 text-white overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 border border-white rounded-full" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rotate-45" />
              </div>
              <CardContent className="p-6 relative z-10">
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
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">الأسئلة الشائعة</h3>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {idx + 1}
                    </Badge>
                    {faq.q}
                  </h4>
                  <p className="text-sm text-muted-foreground mr-9">{faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
