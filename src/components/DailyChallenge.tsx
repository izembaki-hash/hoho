'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Pen, CheckCircle2, Save, RotateCcw, Flame, Sparkles } from 'lucide-react'

const STORAGE_KEY = 'alta7reer-daily-challenge'

interface ChallengeData {
  date: string
  text: string
  completed: boolean
}

const challenges: { day: number; text: string; targetWords: number }[] = [
  { day: 0, text: 'اكتب فقرة من 50 كلمة عن أهمية القراءة في حياتك', targetWords: 50 },
  { day: 1, text: 'صغ جملة واحدة تعبر فيها عن فكرة معقدة ببساطة', targetWords: 15 },
  { day: 2, text: 'اكتب مقدمة جذابة لمقال عن التكنولوجيا والتعليم', targetWords: 40 },
  { day: 3, text: 'حوّل الجملة التالية إلى أسلوب بلاغي: "العلم مفيد"', targetWords: 20 },
  { day: 4, text: 'اكتب خاتمة قوية لمقال عن البيئة', targetWords: 40 },
  { day: 5, text: 'اكتب رسالة رسمية تطلب فيها إجازة من مديرك', targetWords: 50 },
  { day: 6, text: 'اكتب وصفاً إبداعياً لمشهد طبيعي في 30 كلمة', targetWords: 30 },
]

const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

function getTodayChallenge() {
  const today = new Date().getDay()
  return { ...challenges[today], dayName: dayNames[today] }
}

function getTodayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function countArabicWords(text: string): number {
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length
}

const emptySubscribe = () => () => {}

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export default function DailyChallenge() {
  const challenge = getTodayChallenge()
  const todayKey = getTodayKey()
  const mounted = useIsMounted()

  const [text, setText] = useState(() => {
    if (typeof window === 'undefined') return ''
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: ChallengeData = JSON.parse(stored)
        if (data.date === todayKey) return data.text || ''
      }
    } catch { /* ignore */ }
    return ''
  })
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: ChallengeData = JSON.parse(stored)
        if (data.date === todayKey) return data.completed || false
      }
    } catch { /* ignore */ }
    return false
  })
  const [saved, setSaved] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: ChallengeData = JSON.parse(stored)
        if (data.date === todayKey) return !!data.text
      }
    } catch { /* ignore */ }
    return false
  })

  const wordCount = countArabicWords(text)
  const progress = Math.min((wordCount / challenge.targetWords) * 100, 100)

  const handleSave = useCallback(() => {
    const data: ChallengeData = {
      date: todayKey,
      text,
      completed: wordCount >= challenge.targetWords,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSaved(true)
    if (wordCount >= challenge.targetWords) {
      setCompleted(true)
    }
  }, [todayKey, text, wordCount, challenge.targetWords])

  const handleReset = useCallback(() => {
    setText('')
    setCompleted(false)
    setSaved(false)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  if (!mounted) {
    return (
      <Card className="relative overflow-hidden border-2 border-transparent rounded-2xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-l from-emerald-500 via-amber-500 to-emerald-600 p-[2px]">
          <div className="h-full w-full rounded-2xl bg-background" />
        </div>
        <CardContent className="relative z-10 p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-3 w-28 bg-muted rounded" />
              </div>
            </div>
            <div className="h-24 bg-muted rounded-xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="relative overflow-hidden border-2 border-transparent rounded-2xl">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-l from-emerald-500 via-amber-500 to-emerald-600 p-[2px]">
          <div className="h-full w-full rounded-2xl bg-background" />
        </div>

        <CardContent className="relative z-10 p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-bl from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">تحدي اليوم الكتابي</h3>
                <p className="text-sm text-muted-foreground">
                  يوم {challenge.dayName} — تحدّى نفسك!
                </p>
              </div>
            </div>
            {completed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>تم إنجاز التحدي ✅</span>
              </motion.div>
            )}
          </div>

          {/* Challenge text */}
          <div className="bg-gradient-to-l from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/20 rounded-xl p-4 mb-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {challenge.text}
              </p>
            </div>
          </div>

          {/* Text area */}
          <div className="space-y-3">
            <Textarea
              placeholder="ابدأ الكتابة هنا..."
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setSaved(false)
              }}
              disabled={completed}
              className="min-h-[120px] sm:min-h-[150px] resize-y text-base leading-relaxed border-emerald-200 dark:border-emerald-800/50 focus:border-emerald-400 focus:ring-emerald-400/20"
              dir="rtl"
            />

            {/* Word counter & progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Pen className="h-3.5 w-3.5" />
                  عدد الكلمات: <span className="font-bold text-foreground">{wordCount}</span>
                  <span className="text-muted-foreground">/ {challenge.targetWords}</span>
                </span>
                <span className={`text-xs font-medium ${progress >= 100 ? 'text-emerald-600 dark:text-emerald-400' : progress >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    progress >= 100
                      ? 'bg-gradient-to-l from-emerald-500 to-emerald-400'
                      : progress >= 50
                        ? 'bg-gradient-to-l from-amber-500 to-amber-400'
                        : 'bg-gradient-to-l from-emerald-300 to-amber-300'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={completed || !text.trim()}
                className="bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Save className="h-4 w-4 ml-2" />
                {completed ? 'تم الحفظ' : saved ? 'حفظ التحديث' : 'حفظ'}
              </Button>
              {!completed && text.trim() && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <RotateCcw className="h-4 w-4 ml-2" />
                  إعادة
                </Button>
              )}
              {saved && !completed && (
                <span className="text-xs text-muted-foreground">تم الحفظ ✓</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
