'use client'

import { Pen, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react'
import { type SectionId, useAppStore } from '@/lib/store'

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
  { label: 'البريد الإلكتروني', href: 'mailto:contact@alta7reer.com', icon: <Mail className="h-4 w-4" /> },
  { label: 'واتساب', href: 'https://wa.me/213555123456', icon: <Phone className="h-4 w-4" /> },
]

export default function Footer() {
  const { setActiveSection } = useAppStore()

  const handleLinkClick = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-b from-foreground to-foreground/95 text-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-primary to-emerald-700 flex items-center justify-center shadow-md">
                <Pen className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold">التحرير الكتابي والشفهي</h3>
            </div>
            <p className="text-sm text-background/70 leading-relaxed max-w-md">
              منصة تعليمية متكاملة تهدف إلى تطوير مهارات التحرير الكتابي والشفهي لدى الطلبة والأساتذة الجامعيين والتلاميذ من خلال دروس مباشرة ومسجلة ومحتوى تعليمي متنوع.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold border-b border-background/10 pb-2">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className="text-sm text-background/60 hover:text-primary hover:pr-1 transition-all duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold border-b border-background/10 pb-2">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>contact@alta7reer.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span dir="ltr">+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>الجزائر العاصمة، الجزائر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/40">
              © {new Date().getFullYear()} التحرير الكتابي والشفهي. جميع الحقوق محفوظة.
            </p>
            <p className="text-sm text-background/40 flex items-center gap-1">
              صُمّم بـ <Heart className="h-3 w-3 text-red-400 inline" /> لنشر العلم والمعرفة
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
