'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Star, BookOpen, Pen, Target, Trophy,
  FileText, Bookmark, GraduationCap, Lock, Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

// ─── Badge Definitions ────────────────────────────────────────────
interface BadgeDefinition {
  id: string
  emoji: string
  title: string
  description: string
  requirement: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  glowColor: string
  checkUnlocked: (data: BadgeCheckData) => boolean
}

interface BadgeCheckData {
  visitedSections: string[]
  ttsUsed: boolean
  dailyChallengeCompleted: boolean
  quizCorrectAnswers: number
  quizScorePercentage: number
  studyPlanSessions: number
  bookmarkCount: number
  otherBadgesUnlocked: number
}

const BADGES_STORAGE_KEY = 'alta7reer-badges'

const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'beginner',
    emoji: '🌟',
    title: 'مبتدئ',
    description: 'زرت قسماً لأول مرة',
    requirement: 'زر أي قسم من الموقع',
    icon: Star,
    color: 'from-emerald-400 to-emerald-600',
    glowColor: 'shadow-emerald-500/40',
    checkUnlocked: (data) => data.visitedSections.length >= 1,
  },
  {
    id: 'reader',
    emoji: '📖',
    title: 'قارئ',
    description: 'استخدمت ميزة الاستماع الصوتي',
    requirement: 'استخدم ميزة تحويل النص إلى كلام',
    icon: BookOpen,
    color: 'from-blue-400 to-blue-600',
    glowColor: 'shadow-blue-500/40',
    checkUnlocked: (data) => data.ttsUsed,
  },
  {
    id: 'writer',
    emoji: '✍️',
    title: 'كاتب',
    description: 'أكملت تحدي اليوم',
    requirement: 'أكمل تحدي الكتابة اليومية',
    icon: Pen,
    color: 'from-amber-400 to-amber-600',
    glowColor: 'shadow-amber-500/40',
    checkUnlocked: (data) => data.dailyChallengeCompleted,
  },
  {
    id: 'trainee',
    emoji: '🎯',
    title: 'متدرب',
    description: 'أجبت على 3 أسئلة بشكل صحيح',
    requirement: 'أجب على 3 أسئلة اختبار صحيحة',
    icon: Target,
    color: 'from-teal-400 to-teal-600',
    glowColor: 'shadow-teal-500/40',
    checkUnlocked: (data) => data.quizCorrectAnswers >= 3,
  },
  {
    id: 'excellent',
    emoji: '🏆',
    title: 'متفوق',
    description: 'حصلت على 80%+ في الاختبار',
    requirement: 'حقق نسبة 80% أو أكثر في اختبار',
    icon: Trophy,
    color: 'from-orange-400 to-orange-600',
    glowColor: 'shadow-orange-500/40',
    checkUnlocked: (data) => data.quizScorePercentage >= 80,
  },
  {
    id: 'organized',
    emoji: '📝',
    title: 'منظم',
    description: 'أنشأت جلسات في خطة الدراسة',
    requirement: 'أنشئ جلسة دراسة واحدة على الأقل',
    icon: FileText,
    color: 'from-purple-400 to-purple-600',
    glowColor: 'shadow-purple-500/40',
    checkUnlocked: (data) => data.studyPlanSessions >= 1,
  },
  {
    id: 'bookmarker',
    emoji: '🔖',
    title: 'محفوظات',
    description: 'حفظت 5 محتويات أو أكثر',
    requirement: 'احفظ 5 محتويات في المفضلة',
    icon: Bookmark,
    color: 'from-rose-400 to-rose-600',
    glowColor: 'shadow-rose-500/40',
    checkUnlocked: (data) => data.bookmarkCount >= 5,
  },
  {
    id: 'expert',
    emoji: '🎓',
    title: 'خبير',
    description: 'حصلت على 5 شارات أخرى',
    requirement: 'احصل على 5 شارات من الشارات الأخرى',
    icon: GraduationCap,
    color: 'from-emerald-400 via-amber-400 to-rose-400',
    glowColor: 'shadow-amber-500/40',
    checkUnlocked: (data) => data.otherBadgesUnlocked >= 5,
  },
]

// ─── Helper Functions ─────────────────────────────────────────────
function getStoredBadges(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const stored = localStorage.getItem(BADGES_STORAGE_KEY)
    if (stored) return new Set(JSON.parse(stored))
  } catch {}
  return new Set()
}

function getCheckData(): BadgeCheckData {
  if (typeof window === 'undefined') {
    return {
      visitedSections: [],
      ttsUsed: false,
      dailyChallengeCompleted: false,
      quizCorrectAnswers: 0,
      quizScorePercentage: 0,
      studyPlanSessions: 0,
      bookmarkCount: 0,
      otherBadgesUnlocked: 0,
    }
  }

  let visitedSections: string[] = []
  let ttsUsed = false
  let dailyChallengeCompleted = false
  let quizCorrectAnswers = 0
  let quizScorePercentage = 0
  let studyPlanSessions = 0
  let bookmarkCount = 0

  try {
    const visited = localStorage.getItem('alta7reer-visited-sections')
    if (visited) visitedSections = JSON.parse(visited)

    ttsUsed = localStorage.getItem('alta7reer-tts-used') === 'true'

    const challenge = localStorage.getItem('alta7reer-daily-challenge')
    if (challenge) {
      const parsed = JSON.parse(challenge)
      dailyChallengeCompleted = parsed.completed === true
    }

    const quizHistory = localStorage.getItem('quiz-history')
    if (quizHistory) {
      const history = JSON.parse(quizHistory)
      if (Array.isArray(history)) {
        history.forEach((entry: { score: number; total: number }) => {
          quizCorrectAnswers += entry.score || 0
          const pct = entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0
          quizScorePercentage = Math.max(quizScorePercentage, pct)
        })
      }
    }

    const planner = localStorage.getItem('alta7reer-study-planner')
    if (planner) {
      const parsed = JSON.parse(planner)
      studyPlanSessions = Array.isArray(parsed) ? parsed.length : 0
    }

    const bookmarks = localStorage.getItem('alta7reer-bookmarks')
    if (bookmarks) {
      const parsed = JSON.parse(bookmarks)
      bookmarkCount = Array.isArray(parsed) ? parsed.length : 0
    }
  } catch {}

  return {
    visitedSections,
    ttsUsed,
    dailyChallengeCompleted,
    quizCorrectAnswers,
    quizScorePercentage,
    studyPlanSessions,
    bookmarkCount,
    otherBadgesUnlocked: 0, // Will be computed after checking other badges
  }
}

function computeUnlockedBadges(): Set<string> {
  const data = getCheckData()

  // First pass: check all non-expert badges
  const unlocked = new Set<string>()
  badgeDefinitions.forEach(badge => {
    if (badge.id === 'expert') return
    if (badge.checkUnlocked(data)) {
      unlocked.add(badge.id)
    }
  })

  // Second pass: check expert badge (depends on other badges count)
  data.otherBadgesUnlocked = unlocked.size
  const expertBadge = badgeDefinitions.find(b => b.id === 'expert')
  if (expertBadge && expertBadge.checkUnlocked(data)) {
    unlocked.add('expert')
  }

  return unlocked
}

// ─── Component ────────────────────────────────────────────────────
export default function ProgressBadges() {
  // Use lazy initialization to compute badges once per render cycle
  const [unlockedBadgeIds] = useState<Set<string>>(() => computeUnlockedBadges())

  // Sync to localStorage
  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredBadges()
      let changed = false
      unlockedBadgeIds.forEach(id => {
        if (!existing.has(id)) {
          existing.add(id)
          changed = true
        }
      })
      if (changed) {
        localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify([...existing]))
      }
    } catch {}
  }

  const unlockedCount = unlockedBadgeIds.size
  const totalCount = badgeDefinitions.length

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-l from-emerald-500 via-amber-500 to-rose-500" />
        <CardContent className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-md">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">شارات الإنجاز</h3>
                <p className="text-xs text-muted-foreground">{unlockedCount} من {totalCount} شارة</p>
              </div>
            </div>
            {unlockedCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                {unlockedCount} مفتوحة
              </div>
            )}
          </div>

          {/* Badges horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin" dir="rtl">
            {badgeDefinitions.map((badge, idx) => {
              const isUnlocked = unlockedBadgeIds.has(badge.id)
              const BadgeIcon = badge.icon
              const isExpert = badge.id === 'expert'

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.3, ease: 'easeOut' }}
                  className="shrink-0"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 cursor-default min-w-[80px] ${
                          isUnlocked
                            ? `${isExpert ? 'bg-gradient-to-br from-emerald-50 via-amber-50 to-rose-50 dark:from-emerald-950/20 dark:via-amber-950/20 dark:to-rose-950/20' : 'bg-muted/50'} hover:bg-muted/80`
                            : 'bg-muted/20 opacity-60'
                        }`}
                      >
                        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isUnlocked
                            ? `bg-gradient-to-bl ${badge.color} text-white shadow-lg ${badge.glowColor}`
                            : 'bg-muted/50 text-muted-foreground/40'
                        } ${isUnlocked ? 'badge-glow' : ''}`}>
                          {isUnlocked ? (
                            <span className="text-lg">{badge.emoji}</span>
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </div>
                        <span className={`text-[10px] font-medium text-center leading-tight ${
                          isUnlocked ? 'text-foreground' : 'text-muted-foreground/50'
                        }`}>
                          {badge.title}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[200px]">
                      <div className="text-center">
                        <p className="font-bold text-xs mb-1">
                          {badge.emoji} {badge.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mb-1">{badge.description}</p>
                        <p className="text-[10px] text-primary font-medium">
                          {isUnlocked ? '✓ تم الفتح' : `كيفية الحصول: ${badge.requirement}`}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* CSS for badge glow effect */}
      <style jsx global>{`
        .badge-glow {
          animation: badge-glow-pulse 2s ease-in-out infinite;
        }
        @keyframes badge-glow-pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
      `}</style>
    </TooltipProvider>
  )
}
