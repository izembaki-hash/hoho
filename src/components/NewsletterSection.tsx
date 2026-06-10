'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, Bell, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSuccess(true)
    setEmail('')
    setIsSubmitting(false)
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary via-emerald-800 to-primary/90" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-white rounded-full" />
          <div className="absolute bottom-8 left-12 w-16 h-16 border-2 border-white rotate-45" />
          <div className="absolute top-1/2 left-1/3 w-10 h-10 border border-white rounded-full" />
          <div className="absolute top-8 left-1/2 w-8 h-8 border border-white rotate-12" />
        </div>
        
        <CardContent className="relative z-10 p-8 sm:p-12 text-center">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              اشترك في النشرة البريدية
            </h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              كن أول من يعلم عن الدروس الجديدة والمحتوى الحصري. نرسل نشرة أسبوعية بأهم المواضيع والتحديثات.
            </p>
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/20 backdrop-blur-sm"
              >
                <CheckCircle className="h-6 w-6 text-emerald-300" />
                <div className="text-right">
                  <p className="text-white font-bold">تم الاشتراك بنجاح!</p>
                  <p className="text-white/70 text-sm">شكراً لاهتمامك، سنوافيك بالجديد</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="pr-10 bg-white/95 border-0 h-12"
                    dir="ltr"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold h-12 gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isSubmitting ? 'جاري الاشتراك...' : 'اشترك الآن'}
                </Button>
              </form>
            )}
            
            <p className="text-white/50 text-xs mt-4">
              نحترم خصوصيتك ولن نشارك بريدك مع أي طرف ثالث
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
