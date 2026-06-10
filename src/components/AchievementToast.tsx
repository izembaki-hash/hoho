'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { X, Trophy, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  checkCondition: () => boolean
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-visit',
    title: 'مرحباً بك! 🎉',
    description: 'زرت المنصة لأول مرة',
    icon: '🎉',
    checkCondition: () => true, // Always true on first mount
  },
  {
    id: 'explorer',
    title: 'مستكشف! 🧭',
    description: 'زرت 3 أقسام مختلفة',
    icon: '🧭',
    checkCondition: () => {
      try {
        const visited = JSON.parse(localStorage.getItem('alta7reer-visited-sections') || '[]')
        return visited.length >= 3
      } catch { return false }
    },
  },
  {
    id: 'communicator',
    title: 'متواصل! 💬',
    description: 'استخدمت المساعد الذكي',
    icon: '💬',
    checkCondition: () => {
      try { return !!localStorage.getItem('chatbot-interacted') } catch { return false }
    },
  },
  {
    id: 'excellent',
    title: 'ممتاز! 🏆',
    description: 'أكملت اختبار المعرفة',
    icon: '🏆',
    checkCondition: () => {
      try {
        const quizHistory = JSON.parse(localStorage.getItem('quiz-history') || '{}')
        return Object.keys(quizHistory).some(
          (key) => quizHistory[key].attempts > 0
        )
      } catch { return false }
    },
  },
  {
    id: 'keeper',
    title: 'محافظ! 📌',
    description: 'حفظت 5 عناصر أو أكثر',
    icon: '📌',
    checkCondition: () => {
      try {
        const bookmarks = JSON.parse(localStorage.getItem('alta7reer-bookmarks') || '[]')
        return bookmarks.length >= 5
      } catch { return false }
    },
  },
  {
    id: 'listener',
    title: 'مستمع! 🎧',
    description: 'استخدمت ميزة الاستماع',
    icon: '🎧',
    checkCondition: () => {
      try { return !!localStorage.getItem('tts-used') } catch { return false }
    },
  },
  {
    id: 'expert',
    title: 'خبير! 🌟',
    description: 'زرت جميع الأقسام',
    icon: '🌟',
    checkCondition: () => {
      try {
        const visited = JSON.parse(localStorage.getItem('alta7reer-visited-sections') || '[]')
        const allSections = ['home', 'about', 'live-lessons', 'recorded-lessons', 'oral-expression', 'written-expression', 'contact', 'progress', 'quiz']
        return allSections.every((s) => visited.includes(s))
      } catch { return false }
    },
  },
]

const STORAGE_KEY = 'alta7reer-achievements'
const PROGRESS_DURATION = 3500 // progress bar animation time
const AUTO_DISMISS = 4000

interface ActiveAchievement extends Achievement {
  unlockedAt: number
}

export default function AchievementToast() {
  const [activeAchievement, setActiveAchievement] = useState<ActiveAchievement | null>(null)
  const [progress, setProgress] = useState(100)
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isCheckingRef = useRef(false)

  const getUnlockedAchievements = useCallback((): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [])

  const saveAchievement = useCallback((id: string) => {
    try {
      const unlocked = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (!unlocked.includes(id)) {
        unlocked.push(id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked))
      }
    } catch {}
  }, [])

  const checkAndShowAchievements = useCallback(() => {
    if (isCheckingRef.current) return
    isCheckingRef.current = true

    try {
      const unlocked = getUnlockedAchievements()
      // Find first new achievement
      for (const achievement of ACHIEVEMENTS) {
        if (!unlocked.includes(achievement.id) && achievement.checkCondition()) {
          saveAchievement(achievement.id)
          setActiveAchievement({
            ...achievement,
            unlockedAt: Date.now(),
          })
          break // Show one at a time
        }
      }
    } finally {
      isCheckingRef.current = false
    }
  }, [getUnlockedAchievements, saveAchievement])

  const dismiss = useCallback(() => {
    setActiveAchievement(null)
    setProgress(100)
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)

    // After dismissing, check if there are more achievements to show
    setTimeout(() => {
      checkAndShowAchievements()
    }, 300)
  }, [checkAndShowAchievements])

  // Initial check and periodic checking
  useEffect(() => {
    // Delay initial check slightly to ensure localStorage is available
    const initTimer = setTimeout(() => {
      checkAndShowAchievements()
    }, 1500)

    // Check periodically for new achievements
    checkIntervalRef.current = setInterval(() => {
      checkAndShowAchievements()
    }, 5000)

    return () => {
      clearTimeout(initTimer)
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current)
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }
  }, [checkAndShowAchievements])

  // Handle auto-dismiss and progress when achievement is shown
  useEffect(() => {
    if (activeAchievement) {
      // Start progress bar countdown
      const startTime = Date.now()
      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, 100 - (elapsed / PROGRESS_DURATION) * 100)
        setProgress(remaining)
        if (remaining <= 0 && progressTimerRef.current) {
          clearInterval(progressTimerRef.current)
        }
      }, 50)

      // Auto dismiss after timeout
      dismissTimerRef.current = setTimeout(() => {
        dismiss()
      }, AUTO_DISMISS)

      return () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current)
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
      }
    }
  }, [activeAchievement, dismiss])

  // Track TTS usage
  useEffect(() => {
    const handleTTSUsage = () => {
      try { localStorage.setItem('tts-used', 'true') } catch {}
    }
    // Listen for custom event from ContentReader
    window.addEventListener('tts-used', handleTTSUsage)
    return () => window.removeEventListener('tts-used', handleTTSUsage)
  }, [])

  return (
    <AnimatePresence>
      {activeAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -80, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -80, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed top-20 left-4 sm:left-6 z-[60] max-w-sm"
          dir="rtl"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-emerald-200 dark:border-emerald-800">
            {/* Gradient Background */}
            <div className="bg-gradient-to-l from-emerald-600 via-emerald-500 to-teal-600 p-4">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-white/5 rounded-full -translate-x-6 -translate-y-6" />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-full translate-x-4 translate-y-4" />

              <div className="flex items-start gap-3 relative">
                {/* Trophy Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm shrink-0"
                >
                  <Trophy className="h-6 w-6 text-yellow-200" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-[10px] text-emerald-100 font-medium mb-0.5">
                      إنجاز جديد!
                    </p>
                    <h4 className="text-base font-bold text-white leading-tight mb-1">
                      {activeAchievement.title}
                    </h4>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      {activeAchievement.description}
                    </p>
                  </motion.div>
                </div>

                {/* Dismiss Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={dismiss}
                  className="h-7 w-7 rounded-full hover:bg-white/20 text-white/80 hover:text-white shrink-0 -mt-0.5"
                  aria-label="إغلاق"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Stars decoration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1 mt-2"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.08, type: 'spring', damping: 12 }}
                  >
                    <Star className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-emerald-900/30">
              <motion.div
                className="h-full bg-gradient-to-l from-yellow-400 to-yellow-300"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
