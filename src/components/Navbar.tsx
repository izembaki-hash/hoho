'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppStore, type SectionId } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, BookOpen, Mic, Pen, Video, User, Mail, Home, Sun, Moon, Search, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'الرئيسية', icon: <Home className="h-4 w-4" /> },
  { id: 'about', label: 'نبذة عن المؤلف', icon: <User className="h-4 w-4" /> },
  { id: 'live-lessons', label: 'دروس مباشرة', icon: <Video className="h-4 w-4" /> },
  { id: 'recorded-lessons', label: 'دروس مسجلة', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'oral-expression', label: 'التحرير الشفهي', icon: <Mic className="h-4 w-4" /> },
  { id: 'written-expression', label: 'التحرير الكتابي', icon: <Pen className="h-4 w-4" /> },
  { id: 'contact', label: 'اتصل بنا', icon: <Mail className="h-4 w-4" /> },
  { id: 'progress', label: 'لوحة التقدم', icon: <BarChart3 className="h-4 w-4" /> },
]

export default function Navbar() {
  const { activeSection, setActiveSection, mobileMenuOpen, setMobileMenuOpen, theme, toggleTheme } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Pill indicator: calculate position of active nav item
  useEffect(() => {
    if (!navRef.current) return
    const activeBtn = navRef.current.querySelector(`[data-nav-id="${activeSection}"]`) as HTMLElement
    if (activeBtn) {
      const parentRect = navRef.current.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      setPillStyle({
        left: btnRect.left - parentRect.left,
        width: btnRect.width,
      })
    }
  }, [activeSection])

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl shadow-lg shadow-primary/5'
            : 'bg-background/60 backdrop-blur-sm'
        }`}
      >
        {/* Gradient border at bottom when scrolled */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-primary to-emerald-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <Pen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground leading-tight">التحرير الكتابي والشفهي</h1>
                <p className="text-xs text-muted-foreground">منصة تعليمية متكاملة</p>
              </div>
            </button>

            {/* Desktop Navigation with Pill Indicator */}
            <div className="hidden lg:flex items-center relative" ref={navRef}>
              {/* Animated pill background */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-9 bg-primary/10 rounded-lg transition-all duration-300 ease-out"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                }}
              />
              {navItems.map((item) => (
                <button
                  key={item.id}
                  data-nav-id={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-10 ${
                    activeSection === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="mr-2 pr-2 border-r border-border flex items-center gap-1">
                {/* Search Button with pulse */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchOpen(true)}
                  className="rounded-full h-9 gap-2 text-muted-foreground relative group"
                >
                  <Search className="h-4 w-4 animate-search-pulse group-hover:animate-none" />
                  <span className="hidden xl:inline text-xs">بحث</span>
                  <kbd className="hidden xl:inline-flex h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground">⌘K</kbd>
                </Button>
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full h-9 w-9"
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span className="sr-only">تبديل المظهر</span>
                </Button>
              </div>
            </div>

            {/* Mobile: Search + Theme Toggle + Menu */}
            <div className="flex items-center gap-1 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="rounded-full h-9 w-9 relative"
              >
                <Search className="h-4 w-4 animate-search-pulse" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full h-9 w-9"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">فتح القائمة</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 p-6 border-b border-border bg-gradient-to-l from-primary/5 to-transparent">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-primary to-emerald-700 flex items-center justify-center shadow-md">
                        <Pen className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">التحرير الكتابي والشفهي</h2>
                        <p className="text-xs text-muted-foreground">منصة تعليمية متكاملة</p>
                      </div>
                    </div>
                    <div className="flex-1 py-2 overflow-y-auto">
                      {navItems.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex items-center gap-3 w-full px-6 py-3.5 text-right transition-all duration-300 ${
                            activeSection === item.id
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-accent'
                          }`}
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activeSection === item.id
                              ? 'bg-primary-foreground/20'
                              : 'bg-muted'
                          }`}>
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-6 border-t border-border bg-muted/30">
                      <button
                        onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                        className="flex items-center gap-2 w-full p-3 rounded-lg bg-background border border-border text-sm text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <Search className="h-4 w-4" />
                        <span>البحث في المحتوى</span>
                        <kbd className="mr-auto text-[9px] border rounded px-1 bg-muted">⌘K</kbd>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Global Search Dialog */}
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

// Inline search dialog to avoid circular imports
function GlobalSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('')
  const { setActiveSection } = useAppStore()

  useEffect(() => {
    if (!open) {
      // Reset query when dialog closes via escape or backdrop click
      queueMicrotask(() => setQuery(''))
    }
  }, [open])

  const searchItems = [
    { title: 'الخطابة', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'التلخيص', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'التقرير', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'علامات الترقيم', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'الرسائل الإدارية', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'السيرة الذاتية', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'المقال', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'المداخلة', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'بناء النص', section: 'written-expression' as SectionId, category: 'التحرير الكتابي' },
    { title: 'تعريف التعبير الشفهي', section: 'oral-expression' as SectionId, category: 'التحرير الشفهي' },
    { title: 'أنواع العرض الشفهي', section: 'oral-expression' as SectionId, category: 'التحرير الشفهي' },
    { title: 'مهارات العرض الشفهي', section: 'oral-expression' as SectionId, category: 'التحرير الشفهي' },
    { title: 'الإلقاء الإبداعي', section: 'oral-expression' as SectionId, category: 'التحرير الشفهي' },
    { title: 'لغة الجسد', section: 'oral-expression' as SectionId, category: 'التحرير الشفهي' },
    { title: 'دروس مباشرة', section: 'live-lessons' as SectionId, category: 'الدروس' },
    { title: 'دروس مسجلة', section: 'recorded-lessons' as SectionId, category: 'الدروس' },
    { title: 'نبذة عن المؤلف', section: 'about' as SectionId, category: 'عام' },
    { title: 'اتصل بنا', section: 'contact' as SectionId, category: 'عام' },
  ]

  const filtered = query.trim()
    ? searchItems.filter(item => item.title.includes(query) || item.category.includes(query))
    : []

  const handleSelect = (section: SectionId) => {
    setActiveSection(section)
    onOpenChange(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100]"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-lg mx-auto mt-20 mx-4"
          >
            <div className="bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
              <div className="flex items-center border-b border-border px-4">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث في المحتوى التعليمي..."
                  className="flex-1 bg-transparent border-0 outline-none py-4 px-3 text-sm placeholder:text-muted-foreground"
                  autoFocus={open}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') onOpenChange(false)
                    if (e.key === 'Enter' && filtered.length > 0) {
                      handleSelect(filtered[0].section)
                    }
                  }}
                />
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {query.trim() && (
                <div className="max-h-72 overflow-y-auto p-2">
                  {filtered.length > 0 ? (
                    <div className="space-y-0.5">
                      {filtered.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelect(item.section)}
                          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-accent transition-colors text-right"
                        >
                          <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-muted-foreground mr-auto">{item.category}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">لا توجد نتائج لـ &quot;{query}&quot;</p>
                    </div>
                  )}
                </div>
              )}

              {!query.trim() && (
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">بحث سريع</p>
                  <div className="flex flex-wrap gap-2">
                    {['الخطابة', 'التلخيص', 'لغة الجسد', 'السيرة الذاتية', 'علامات الترقيم'].map(term => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
