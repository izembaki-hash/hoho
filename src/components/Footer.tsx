'use client'

import { useState } from 'react'
import { Pen, Mail, Phone, MapPin, Heart, Send, CheckCircle, ChevronLeft, ArrowUp } from 'lucide-react'
import { type SectionId, useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const quickLinks: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'about', label: 'نبذة عن المؤلف' },
  { id: 'live-lessons', label: 'دروس مباشرة' },
  { id: 'recorded-lessons', label: 'دروس مسجلة' },
  { id: 'oral-expression', label: 'التحرير الشفهي' },
  { id: 'written-expression', label: 'التحرير الكتابي' },
  { id: 'contact', label: 'اتصل بنا' },
]

const socialLinks = [
  { label: 'البريد الإلكتروني', href: 'mailto:contact@alta7reer.com', icon: <Mail className="h-4 w-4" />, hoverColor: 'hover:bg-primary hover:text-primary-foreground' },
  { label: 'واتساب', href: 'https://wa.me/213555123456', icon: <Phone className="h-4 w-4" />, hoverColor: 'hover:bg-emerald-500 hover:text-white' },
]

// Decorative wave SVG separator
function WaveSeparator() {
  return (
    <div className="relative -mt-1">
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[60px] sm:h-[80px] block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 C240 80 480 0 720 40 C960 80 1200 0 1440 40 L1440 100 L0 100 Z"
          className="fill-foreground"
        />
        <path
          d="M0 55 C200 85 450 15 720 55 C990 85 1200 15 1440 55 L1440 100 L0 100 Z"
          className="fill-foreground opacity-50"
        />
      </svg>
    </div>
  )
}

export default function Footer() {
  const { setActiveSection } = useAppStore()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleLinkClick = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <>
      <WaveSeparator />
      <footer className="bg-foreground text-background geometric-pattern">
        {/* Gradient accent top border */}
        <div className="h-1 bg-gradient-to-l from-amber-500 via-primary to-emerald-600" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Main Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 sm:py-12">
            {/* Brand */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-primary to-emerald-700 flex items-center justify-center shadow-md">
                  <Pen className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-l from-primary via-emerald-400 to-amber-400 bg-clip-text text-transparent">
                  التحرير الكتابي والشفهي
                </h3>
              </div>
              <p className="text-sm text-background/70 leading-relaxed">
                منصة تعليمية متكاملة تهدف إلى تطوير مهارات التحرير الكتابي والشفهي لدى الطلبة والأساتذة الجامعيين والتلاميذ.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 rounded-full bg-background/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${link.hoverColor}`}
                    title={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-base font-bold border-b border-background/15 pb-2 relative text-gradient-hover">
                روابط سريعة
                <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-l from-primary to-amber-500" />
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleLinkClick(link.id)}
                      className="quick-link-hover nav-slide-underline flex items-center gap-2 text-sm text-background/60 hover:text-primary transition-all duration-300 group py-2 min-h-[44px]"
                    >
                      <ChevronLeft className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                      <span className="relative group-hover:pr-2 transition-all duration-300">{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-base font-bold border-b border-background/15 pb-2 relative text-gradient-hover">
                تواصل معنا
                <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-l from-primary to-amber-500" />
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-background/60 hover:text-background/90 transition-colors duration-300 py-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span>contact@alta7reer.com</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-background/60 hover:text-background/90 transition-colors duration-300 py-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span dir="ltr">+213 555 123 456</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-background/60 hover:text-background/90 transition-colors duration-300 py-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span>الجزائر العاصمة، الجزائر</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-base font-bold border-b border-background/15 pb-2 relative text-gradient-hover">
                النشرة البريدية
                <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-l from-primary to-amber-500" />
              </h3>
              <p className="text-sm text-background/60 leading-relaxed">
                اشترك لتصلك أحدث الدروس والمحتوى التعليمي
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>تم الاشتراك بنجاح!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="بريدك الإلكتروني"
                    className="newsletter-input-focus bg-background/10 border-background/20 text-background placeholder:text-background/40 text-sm focus:border-primary/50 focus:ring-primary/30 transition-all duration-300"
                    dir="ltr"
                    required
                  />
                  <Button type="submit" size="icon" className="shrink-0 bg-gradient-to-bl from-primary to-emerald-700 hover:from-primary/90 hover:to-emerald-700/90 shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative py-6">
            {/* Gradient line separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-background/20 to-transparent" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-sm text-background/40">
                © {new Date().getFullYear()} التحرير الكتابي والشفهي. جميع الحقوق محفوظة.
              </p>
              <p className="text-sm text-background/40 flex items-center gap-1">
                صُمّم بـ <Heart className="h-3.5 w-3.5 text-red-400 inline animate-pulse" /> لنشر العلم والمعرفة
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
