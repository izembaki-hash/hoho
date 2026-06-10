'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { X, Minus, Plus, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FONT_SIZE_MIN = 14
const FONT_SIZE_MAX = 28
const FONT_SIZE_DEFAULT = 18
const FONT_SIZE_KEY = 'alta7reer-reading-font-size'

function getStoredFontSize(): number {
  if (typeof window === 'undefined') return FONT_SIZE_DEFAULT
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY)
    if (stored) {
      const size = parseInt(stored, 10)
      if (size >= FONT_SIZE_MIN && size <= FONT_SIZE_MAX) return size
    }
  } catch {}
  return FONT_SIZE_DEFAULT
}

export default function ReadingMode() {
  const { readingMode, toggleReadingMode, theme } = useAppStore()
  const [fontSize, setFontSize] = useState(() => getStoredFontSize())
  const [readingProgress, setReadingProgress] = useState(0)

  // Track reading progress
  useEffect(() => {
    if (!readingMode) return

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [readingMode])

  // Apply font size to main content
  useEffect(() => {
    if (!readingMode) return

    const mainContent = document.querySelector('[data-reading-content]')
    if (mainContent) {
      (mainContent as HTMLElement).style.fontSize = `${fontSize}px`
    }

    return () => {
      const el = document.querySelector('[data-reading-content]')
      if (el) {
        (el as HTMLElement).style.fontSize = ''
      }
    }
  }, [readingMode, fontSize])

  // Save font size
  const handleFontSizeChange = useCallback((newSize: number) => {
    const clamped = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, newSize))
    setFontSize(clamped)
    try {
      localStorage.setItem(FONT_SIZE_KEY, String(clamped))
    } catch {}
  }, [])

  // Handle TTS from reading mode toolbar
  const handleTTS = useCallback(() => {
    const ttsButton = document.querySelector('[aria-label="استمع إلى المحتوى"]') as HTMLElement
    if (ttsButton) {
      ttsButton.click()
    }
  }, [])

  return (
    <AnimatePresence>
      {readingMode && (
        <>
          {/* Reading progress bar at the very top */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[70] h-1.5"
            style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          >
            <motion.div
              className="h-full transition-all duration-150 ease-out"
              style={{
                width: `${readingProgress}%`,
                background: 'linear-gradient(to left, #10b981, #059669, #f59e0b)',
              }}
            />
          </motion.div>

          {/* Floating toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-xl border"
            style={{
              background: theme === 'dark' ? 'rgba(26, 26, 46, 0.92)' : 'rgba(253, 246, 227, 0.95)',
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            }}
          >
            {/* Exit reading mode */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleReadingMode}
              className="h-8 gap-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="الخروج من وضع القراءة"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </Button>

            {/* Divider */}
            <div
              className="w-px h-5"
              style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }}
            />

            {/* Font size controls */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFontSizeChange(fontSize - 2)}
              disabled={fontSize <= FONT_SIZE_MIN}
              className="h-8 w-8 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="تصغير الخط"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>

            <span
              className="text-xs font-medium min-w-[2.5rem] text-center tabular-nums"
              style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
            >
              {fontSize}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFontSizeChange(fontSize + 2)}
              disabled={fontSize >= FONT_SIZE_MAX}
              className="h-8 w-8 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="تكبير الخط"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>

            {/* Divider */}
            <div
              className="w-px h-5"
              style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }}
            />

            {/* TTS button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTTS}
              className="h-8 gap-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="الاستماع للمحتوى"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">استماع</span>
            </Button>

            {/* Progress text */}
            <span
              className="hidden md:inline text-[11px] tabular-nums"
              style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}
            >
              {Math.round(readingProgress)}%
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
