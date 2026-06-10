'use client'

import { Pen, Mail, Phone, MapPin } from 'lucide-react'
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

export default function Footer() {
  const { setActiveSection } = useAppStore()

  const handleLinkClick = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Pen className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold">التحرير الكتابي والشفهي</h3>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              منصة تعليمية متكاملة تهدف إلى تطوير مهارات التحرير الكتابي والشفهي لدى الطلبة والأساتذة الجامعيين والتلاميذ من خلال دروس مباشرة ومسجلة ومحتوى تعليمي متنوع.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contact@alta7reer.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr">+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>الجزائر العاصمة، الجزائر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} التحرير الكتابي والشفهي. جميع الحقوق محفوظة.
            </p>
            <p className="text-sm text-background/50">
              صُمّم بعناية لنشر العلم والمعرفة
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
