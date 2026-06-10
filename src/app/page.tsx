'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import ThemeProvider from '@/components/ThemeProvider'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import LiveLessonsSection from '@/components/sections/LiveLessonsSection'
import RecordedLessonsSection from '@/components/sections/RecordedLessonsSection'
import OralExpressionSection from '@/components/sections/OralExpressionSection'
import WrittenExpressionSection from '@/components/sections/WrittenExpressionSection'
import ContactSection from '@/components/sections/ContactSection'
import { useAppStore } from '@/lib/store'
import { HomeIcon, ChevronLeft } from 'lucide-react'

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

const sectionIcons: Record<string, string> = {
  home: '🏠',
  about: '👨‍🏫',
  'live-lessons': '📡',
  'recorded-lessons': '📚',
  'oral-expression': '🎤',
  'written-expression': '✍️',
  contact: '✉️',
}

export default function Home() {
  const { activeSection } = useAppStore()
  const ActiveSectionComponent = sectionComponents[activeSection] || HeroSection

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <ReadingProgressBar />
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">
          {/* Breadcrumb */}
          {activeSection !== 'home' && (
            <div className="bg-muted/30 border-b border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <button
                    onClick={() => useAppStore.getState().setActiveSection('home')}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <HomeIcon className="h-3.5 w-3.5" />
                    الرئيسية
                  </button>
                  <ChevronLeft className="h-3 w-3" />
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <span className="text-xs">{sectionIcons[activeSection]}</span>
                    {sectionTitles[activeSection]}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div
            key={activeSection}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          >
            <ActiveSectionComponent />
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  )
}
