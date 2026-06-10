'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import LiveLessonsSection from '@/components/sections/LiveLessonsSection'
import RecordedLessonsSection from '@/components/sections/RecordedLessonsSection'
import OralExpressionSection from '@/components/sections/OralExpressionSection'
import WrittenExpressionSection from '@/components/sections/WrittenExpressionSection'
import ContactSection from '@/components/sections/ContactSection'
import { useAppStore } from '@/lib/store'

const sectionComponents: Record<string, React.ComponentType> = {
  home: HeroSection,
  about: AboutSection,
  'live-lessons': LiveLessonsSection,
  'recorded-lessons': RecordedLessonsSection,
  'oral-expression': OralExpressionSection,
  'written-expression': WrittenExpressionSection,
  contact: ContactSection,
}

const sectionTitles: Record<string, string> = {
  home: 'الرئيسية',
  about: 'نبذة عن المؤلف',
  'live-lessons': 'دروس مباشرة',
  'recorded-lessons': 'دروس مسجلة',
  'oral-expression': 'التحرير الشفهي',
  'written-expression': 'التحرير الكتابي',
  contact: 'اتصل بنا',
}

export default function Home() {
  const { activeSection } = useAppStore()
  const ActiveSectionComponent = sectionComponents[activeSection] || HeroSection

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        {/* Breadcrumb */}
        {activeSection !== 'home' && (
          <div className="bg-muted/30 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button
                  onClick={() => useAppStore.getState().setActiveSection('home')}
                  className="hover:text-primary transition-colors"
                >
                  الرئيسية
                </button>
                <span>/</span>
                <span className="text-foreground font-medium">{sectionTitles[activeSection]}</span>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <ActiveSectionComponent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
