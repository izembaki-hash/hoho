'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  Mail, Phone, MapPin, Send, CheckCircle, 
  Clock, MessageSquare, User, AtSign, 
  HelpCircle, BookOpen, Video, Mic,
  Printer, Clock as ClockIcon, Zap, Globe,
  ChevronDown, Map
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

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
  { 
    q: 'كيف يمكنني التسجيل في الدروس المباشرة؟', 
    a: 'يمكنك التسجيل من خلال صفحة الدروس المباشرة بالضغط على زر "انضمام" بجانب الدرس المراد والقيام بملء بياناتك. سيتم إرسال رابط الدرس إلى بريدك الإلكتروني قبل الموعد المحدد.',
    icon: <Video className="h-4 w-4" />,
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  },
  { 
    q: 'هل الدروس المسجلة مجانية؟', 
    a: 'نعم، جميع الدروس المسجلة متاحة مجاناً مع مرفقاتها التعليمية. يمكنك تصفحها ومشاهدتها في أي وقت.',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  },
  { 
    q: 'كيف يمكنني التواصل مع الأستاذ؟', 
    a: 'يمكنك التواصل من خلال نموذج المراسلة في هذه الصفحة أو عبر البريد الإلكتروني المباشر. كما يمكنك المشاركة في الدروس المباشرة وطرح أسئلتك مباشرة.',
    icon: <Mic className="h-4 w-4" />,
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
  },
  { 
    q: 'هل المحتوى مناسب لجميع المستويات؟', 
    a: 'نعم، المحتوى مصمم لثلاث فئات: التلاميذ والطلبة والأساتذة الجامعيين، كل فئة لها محتوى مخصص يناسب مستواها واحتياجاتها.',
    icon: <HelpCircle className="h-4 w-4" />,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
  },
  { 
    q: 'كيف أستخدم ميزة الاستماع إلى المحتوى؟', 
    a: 'يمكنك الضغط على زر السماعة الموجود في أسفل الصفحة للاستماع إلى محتوى القسم الحالي. سيتم تحويل النص إلى كلام تلقائياً.',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  },
  { 
    q: 'هل يمكنني طباعة المحتوى التعليمي؟', 
    a: 'نعم، يمكنك طباعة أي صفحة من الموقع باستخدام زر الطباعة المتاح في أعلى كل قسم أو من خلال اختيار طباعة من متصفحك. المحتوى مُحسّن للطباعة.',
    icon: <Printer className="h-4 w-4" />,
    color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
  },
]

// Animated contact icon component
function AnimatedContactIcon({ icon, className }: { icon: React.ReactNode; className: string }) {
  return (
    <motion.div 
      className={className}
      animate={{ 
        scale: [1, 1.05, 1],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {icon}
    </motion.div>
  )
}

export default function ContactSection() {
  const { setActiveSection } = useAppStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

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

  const handleQuickNav = (section: 'live-lessons' | 'recorded-lessons' | 'oral-expression') => {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">اتصل بنا</h2>
        <p className="text-muted-foreground">تواصل معنا لطرح انشغالاتكم ومقترحاتكم</p>
        {/* Response time indicator */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute top-0 left-0 animate-ping opacity-75" />
          </div>
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">متوسط وقت الرد: أقل من 24 ساعة</span>
        </div>
      </motion.div>

      {/* Quick Help */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => handleQuickNav('live-lessons')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">دروس مباشرة</h4>
                <p className="text-xs text-muted-foreground">انضم للدروس الحية</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => handleQuickNav('recorded-lessons')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">دروس مسجلة</h4>
                <p className="text-xs text-muted-foreground">شاهد الدروس مسجلة</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => handleQuickNav('oral-expression')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Contact Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-l from-primary to-emerald-600" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <AnimatedContactIcon 
                  icon={<MessageSquare className="h-5 w-5" />}
                  className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
                />
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
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                  </motion.div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="contact-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="أدخل اسمك الكامل"
                      className={`transition-all duration-300 ${focusedField === 'name' ? 'ring-2 ring-primary/20 border-primary shadow-sm' : ''}`}
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
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="example@email.com"
                      dir="ltr"
                      className={`transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-primary/20 border-primary shadow-sm' : ''}`}
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
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="موضوع رسالتك"
                    className={`transition-all duration-300 ${focusedField === 'subject' ? 'ring-2 ring-primary/20 border-primary shadow-sm' : ''}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact-message" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      الرسالة *
                    </Label>
                    <span className={`text-xs transition-colors duration-300 ${formData.message.length > 500 ? 'text-amber-500' : 'text-muted-foreground'}`}>{formData.message.length} حرف</span>
                  </div>
                  <Textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    className={`resize-none transition-all duration-300 ${focusedField === 'message' ? 'ring-2 ring-primary/20 border-primary shadow-sm' : ''}`}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto gap-2 hover:scale-105 transition-transform bg-gradient-to-l from-primary to-emerald-700 hover:from-primary/90 hover:to-emerald-700/90"
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
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-l from-primary to-emerald-600" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">معلومات التواصل</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Mail className="h-5 w-5" />, title: 'البريد الإلكتروني', value: 'contact@alta7reer.com', dir: 'ltr', animClass: 'animate-none' },
                    { icon: <Phone className="h-5 w-5" />, title: 'رقم الهاتف', value: '+213 555 123 456', dir: 'ltr', animClass: 'animate-none' },
                    { icon: <MapPin className="h-5 w-5" />, title: 'العنوان', value: 'الجزائر العاصمة، الجزائر', dir: 'rtl', animClass: 'animate-none' },
                    { icon: <ClockIcon className="h-5 w-5" />, title: 'ساعات العمل', value: 'الأحد - الخميس: 8:00 - 17:00', dir: 'rtl', animClass: 'animate-none' },
                  ].map((info, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <motion.div 
                        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        {info.icon}
                      </motion.div>
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

          {/* Map Placeholder / Decorative Element */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-40 bg-gradient-to-bl from-primary/5 via-emerald-50 to-teal-50 dark:from-primary/10 dark:via-emerald-950/20 dark:to-teal-950/20 flex items-center justify-center overflow-hidden">
                  {/* Decorative map grid */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  {/* Decorative circles mimicking map pins */}
                  <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-primary/30 animate-pulse" />
                  <div className="absolute top-12 left-16 w-2 h-2 rounded-full bg-emerald-500/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-8 right-20 w-2.5 h-2.5 rounded-full bg-amber-500/30 animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-teal-500/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
                  <div className="text-center relative z-10">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    </motion.div>
                    <p className="text-sm font-medium text-muted-foreground">الجزائر العاصمة</p>
                    <p className="text-xs text-muted-foreground/60">جامعة الجزائر</p>
                  </div>
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
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-300" />
                  تواصل مباشر
                </h3>
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

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  إحصائيات سريعة
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">150+</div>
                    <div className="text-xs text-muted-foreground">درس مسجل</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">5000+</div>
                    <div className="text-xs text-muted-foreground">طالب نشط</div>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-center">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">25+</div>
                    <div className="text-xs text-muted-foreground">أستاذ</div>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 dark:bg-primary/10 text-center">
                    <div className="text-2xl font-bold text-primary">9</div>
                    <div className="text-xs text-muted-foreground">موضوع تعليمي</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section with Accordion */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-l from-primary via-emerald-600 to-amber-500" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الأسئلة الشائعة</h3>
                <p className="text-sm text-muted-foreground">إجابات على أكثر الأسئلة تكراراً</p>
              </div>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`faq-${idx}`}
                  className="border border-border/50 rounded-xl px-4 data-[state=open]:bg-muted/30 data-[state=open]:border-primary/20 transition-all duration-300"
                >
                  <AccordionTrigger className="hover:no-underline py-4 group/trigger">
                    <div className="flex items-center gap-3 text-right flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${faq.color} group-hover/trigger:scale-110 transition-transform`}>
                        {faq.icon}
                      </div>
                      <span className="font-medium text-sm">{faq.q}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 group-hover/trigger:text-primary" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pr-11">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
