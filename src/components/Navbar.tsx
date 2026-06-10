'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore, type SectionId } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, X, BookOpen, Mic, Pen, Video, User, Mail, Home } from 'lucide-react'

const navItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'الرئيسية', icon: <Home className="h-4 w-4" /> },
  { id: 'about', label: 'نبذة عن المؤلف', icon: <User className="h-4 w-4" /> },
  { id: 'live-lessons', label: 'دروس مباشرة', icon: <Video className="h-4 w-4" /> },
  { id: 'recorded-lessons', label: 'دروس مسجلة', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'oral-expression', label: 'التحرير الشفهي', icon: <Mic className="h-4 w-4" /> },
  { id: 'written-expression', label: 'التحرير الكتابي', icon: <Pen className="h-4 w-4" /> },
  { id: 'contact', label: 'اتصل بنا', icon: <Mail className="h-4 w-4" /> },
]

export default function Navbar() {
  const { activeSection, setActiveSection, mobileMenuOpen, setMobileMenuOpen } = useAppStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Pen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">التحرير الكتابي والشفهي</h1>
              <p className="text-xs text-muted-foreground">منصة تعليمية متكاملة</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 p-6 border-b border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Pen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">التحرير الكتابي والشفهي</h2>
                    <p className="text-xs text-muted-foreground">منصة تعليمية متكاملة</p>
                  </div>
                </div>
                <div className="flex-1 py-4 overflow-y-auto">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center gap-3 w-full px-6 py-3.5 text-right transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
