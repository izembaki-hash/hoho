'use client'

import { useState } from 'react'
import { useAppStore, type SectionId } from '@/lib/store'
import { Home, User, Video, BookOpen, Mic, Pen, Mail, BarChart3, MoreHorizontal, ChevronUp, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems: { id: SectionId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'home', label: 'الرئيسية', icon: <Home className="h-5 w-5" />, color: 'text-emerald-500' },
  { id: 'oral-expression', label: 'شفهي', icon: <Mic className="h-5 w-5" />, color: 'text-purple-500' },
  { id: 'live-lessons', label: 'مباشر', icon: <Video className="h-5 w-5" />, color: 'text-red-500' },
  { id: 'written-expression', label: 'كتابي', icon: <Pen className="h-5 w-5" />, color: 'text-primary' },
  { id: 'quiz', label: 'اختبار', icon: <Brain className="h-5 w-5" />, color: 'text-amber-500' },
]

const moreItems: { id: SectionId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'about', label: 'المؤلف', icon: <User className="h-5 w-5" />, color: 'text-teal-500' },
  { id: 'recorded-lessons', label: 'مسجلة', icon: <BookOpen className="h-5 w-5" />, color: 'text-amber-500' },
  { id: 'contact', label: 'تواصل', icon: <Mail className="h-5 w-5" />, color: 'text-sky-500' },
  { id: 'progress', label: 'التقدم', icon: <BarChart3 className="h-5 w-5" />, color: 'text-primary' },
]

export default function MobileBottomNav() {
  const { activeSection, setActiveSection } = useAppStore()
  const [showMore, setShowMore] = useState(false)
  const [tapScale, setTapScale] = useState<string | null>(null)

  const allItems = [...navItems, ...moreItems]
  const isMoreItemActive = moreItems.some(item => item.id === activeSection)

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setShowMore(false)
  }

  const handleTapStart = (id: string) => {
    setTapScale(id)
  }

  const handleTapEnd = () => {
    setTapScale(null)
  }

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed bottom-20 left-4 right-4 z-50 lg:hidden bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              <div className="p-3">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <div className="w-8 h-1 rounded-full bg-muted-foreground/20" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {moreItems.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted/50 active:bg-muted'
                        }`}
                      >
                        <div className={isActive ? item.color : ''}>
                          {item.icon}
                        </div>
                        <span className={`text-[11px] leading-tight font-medium ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="w-1 h-1 rounded-full bg-primary" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            const isTapping = tapScale === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onTouchStart={() => handleTapStart(item.id)}
                onTouchEnd={handleTapEnd}
                onMouseDown={() => handleTapStart(item.id)}
                onMouseUp={handleTapEnd}
                onMouseLeave={handleTapEnd}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[48px] ${
                  isTapping && !isActive ? 'scale-90' : ''
                } ${
                  isActive
                    ? 'bg-primary/10'
                    : 'hover:bg-muted/50 active:bg-muted'
                }`}
              >
                <div className={`relative transition-all duration-200 ${
                  isActive ? item.color : 'text-muted-foreground'
                } ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current`}
                    />
                  )}
                </div>
                <span className={`text-[10px] leading-tight mt-0.5 truncate w-full text-center transition-all duration-200 ${
                  isActive ? 'text-foreground font-bold' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
                {/* Active bottom indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="h-0.5 w-5 rounded-full bg-primary mt-0.5"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            onTouchStart={() => handleTapStart('more')}
            onTouchEnd={handleTapEnd}
            onMouseDown={() => handleTapStart('more')}
            onMouseUp={handleTapEnd}
            onMouseLeave={handleTapEnd}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[48px] ${
              tapScale === 'more' ? 'scale-90' : ''
            } ${
              isMoreItemActive || showMore
                ? 'bg-primary/10'
                : 'hover:bg-muted/50 active:bg-muted'
            }`}
          >
            <div className={`relative transition-all duration-200 ${
              isMoreItemActive || showMore ? 'text-primary' : 'text-muted-foreground'
            } ${showMore ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.2s, color 0.2s' }}>
              {showMore ? <ChevronUp className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
              {/* Dot for active more item */}
              {isMoreItemActive && !showMore && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-[10px] leading-tight mt-0.5 font-medium ${
              isMoreItemActive || showMore ? 'text-foreground font-bold' : 'text-muted-foreground'
            }`}>
              المزيد
            </span>
            {(isMoreItemActive || showMore) && (
              <div className="h-0.5 w-5 rounded-full bg-primary mt-0.5" />
            )}
          </button>
        </div>
      </nav>
    </>
  )
}
