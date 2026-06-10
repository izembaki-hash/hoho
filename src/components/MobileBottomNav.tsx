'use client'

import { useAppStore, type SectionId } from '@/lib/store'
import { Home, User, Video, BookOpen, Mic, Pen, Mail } from 'lucide-react'

const navItems: { id: SectionId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'home', label: 'الرئيسية', icon: <Home className="h-5 w-5" />, color: 'text-emerald-500' },
  { id: 'about', label: 'المؤلف', icon: <User className="h-5 w-5" />, color: 'text-teal-500' },
  { id: 'live-lessons', label: 'مباشر', icon: <Video className="h-5 w-5" />, color: 'text-red-500' },
  { id: 'recorded-lessons', label: 'مسجلة', icon: <BookOpen className="h-5 w-5" />, color: 'text-amber-500' },
  { id: 'oral-expression', label: 'شفهي', icon: <Mic className="h-5 w-5" />, color: 'text-purple-500' },
  { id: 'written-expression', label: 'كتابي', icon: <Pen className="h-5 w-5" />, color: 'text-primary' },
  { id: 'contact', label: 'تواصل', icon: <Mail className="h-5 w-5" />, color: 'text-sky-500' },
]

export default function MobileBottomNav() {
  const { activeSection, setActiveSection } = useAppStore()

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {navItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all duration-300 min-w-0 flex-1 ${
                isActive
                  ? 'bg-primary/10 scale-105'
                  : 'hover:bg-muted/50 active:scale-95'
              }`}
            >
              <div className={`relative transition-all duration-300 ${
                isActive ? item.color : 'text-muted-foreground'
              }`}>
                {item.icon}
                {/* Active indicator dot */}
                {isActive && (
                  <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
                )}
              </div>
              <span className={`text-[10px] leading-tight truncate w-full text-center transition-colors duration-300 ${
                isActive ? 'text-foreground font-bold' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
              {/* Active bottom line */}
              {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
