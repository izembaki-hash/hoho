'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import ThemeProvider from '@/components/ThemeProvider'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import LiveLessonsSection from '@/components/sections/LiveLessonsSection'
import RecordedLessonsSection from '@/components/sections/RecordedLessonsSection'
import OralExpressionSection from '@/components/sections/OralExpressionSection'
import WrittenExpressionSection from '@/components/sections/WrittenExpressionSection'
import ContactSection from '@/components/sections/ContactSection'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
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

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
}

export default function Home() {
  const { activeSection } = useAppStore()
  const ActiveSectionComponent = sectionComponents[activeSection] || HeroSection

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">
          {/* Breadcrumb */}
          <AnimatePresence mode="wait">
            {activeSection !== 'home' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-muted/30 border-b border-border/50"
              >
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
                    <span className="text-foreground font-medium">{sectionTitles[activeSection]}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
              <ActiveSectionComponent />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  )
}
