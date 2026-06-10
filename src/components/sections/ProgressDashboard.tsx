'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  BookOpen, Mic, Pen, Trophy, Target, Flame,
  GraduationCap, Users, School, Star, TrendingUp,
  CheckCircle2, Lock, Sparkles, ChevronDown, ChevronUp,
  PlayCircle, Bookmark, Compass, UserCheck,
  Award, Headphones, Eye, Lightbulb, Zap,
  Calendar, RotateCcw
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import StudyPlanner from '@/components/StudyPlanner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] } },
}

// ─── Learning Paths Data ────────────────────────────────────────
const learningPaths = [
  {
    id: 'oral-basics',
    title: 'أساسيات التعبير الشفهي',
    icon: Mic,
    color: 'from-emerald-500 to-emerald-700',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    dotColor: 'bg-emerald-500',
    totalTopics: 5,
    category: 'oral-expression',
    nextStep: 'تعلّم أنواع التعبير الشفهي المختلفة',
    nextStepId: 'oral-expression' as const,
  },
  {
    id: 'oral-advanced',
    title: 'الإلقاء الإبداعي المتقدم',
    icon: Star,
    color: 'from-amber-500 to-amber-700',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-300 dark:border-amber-700',
    dotColor: 'bg-amber-500',
    totalTopics: 3,
    category: 'oral-expression',
    nextStep: 'اكتشف فن الإلقاء الإبداعي',
    nextStepId: 'oral-expression' as const,
  },
  {
    id: 'written-basics',
    title: 'أساسيات الكتابة الإبداعية',
    icon: Pen,
    color: 'from-teal-500 to-teal-700',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    textColor: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-300 dark:border-teal-700',
    dotColor: 'bg-teal-500',
    totalTopics: 5,
    category: 'written-expression',
    nextStep: 'ابدأ بتعلم فن الخطابة والمقال',
    nextStepId: 'written-expression' as const,
  },
  {
    id: 'written-advanced',
    title: 'الكتابة الأكاديمية والمهنية',
    icon: BookOpen,
    color: 'from-rose-500 to-rose-700',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-300 dark:border-rose-700',
    dotColor: 'bg-rose-500',
    textColor: 'text-rose-600 dark:text-rose-400',
    totalTopics: 4,
    category: 'written-expression',
    nextStep: 'تعلّم كتابة البحث العلمي والسيرة الذاتية',
    nextStepId: 'written-expression' as const,
  },
]

// ─── Achievement Data ────────────────────────────────────────────
const achievements = [
  {
    id: 'first-visit',
    title: 'الزيارة الأولى',
    description: 'زرت المنصة لأول مرة - بداية رحلة التعلم!',
    icon: Target,
    unlocked: true,
    color: 'from-emerald-400 to-emerald-600',
    glowColor: 'shadow-emerald-500/40',
    progress: 100,
    requirement: 'زيارة المنصة',
  },
  {
    id: 'reader',
    title: 'قارئ نهم',
    description: 'حفظت 5 محتويات أو أكثر - أنت قارئ نشط!',
    icon: BookOpen,
    unlocked: false,
    color: 'from-amber-400 to-amber-600',
    glowColor: 'shadow-amber-500/40',
    progress: 40,
    requirement: 'حفظ 5 محتويات',
  },
  {
    id: 'listener',
    title: 'مستمع جيد',
    description: 'استمعت لمحتوى صوتي - استمع وتعلّم!',
    icon: Headphones,
    unlocked: false,
    color: 'from-teal-400 to-teal-600',
    glowColor: 'shadow-teal-500/40',
    progress: 0,
    requirement: 'استخدام ميزة الاستماع',
  },
  {
    id: 'scholar',
    title: 'باحث متميز',
    description: 'استكشفت جميع الأقسام - مستكشف شامل!',
    icon: GraduationCap,
    unlocked: false,
    color: 'from-purple-400 to-purple-600',
    glowColor: 'shadow-purple-500/40',
    progress: 14,
    requirement: 'استكشاف جميع الأقسام',
  },
  {
    id: 'writer',
    title: 'كاتب مبتدئ',
    description: 'أعطيت تقييماً إيجابياً - شاركنا رأيك!',
    icon: Pen,
    unlocked: false,
    color: 'from-rose-400 to-rose-600',
    glowColor: 'shadow-rose-500/40',
    progress: 0,
    requirement: 'إعطاء تقييم إيجابي',
  },
  {
    id: 'master',
    title: 'أستاذ الخطابة',
    description: 'أكملت مسار التعبير الشفهي كاملاً - إنجاز عظيم!',
    icon: Trophy,
    unlocked: false,
    color: 'from-yellow-400 to-orange-500',
    glowColor: 'shadow-yellow-500/40',
    progress: 0,
    requirement: 'إكمال مسار التعبير الشفهي',
  },
]

// ─── Audience Data ───────────────────────────────────────────────
const audienceData = [
  {
    label: 'الطلبة الجامعيين',
    icon: GraduationCap,
    bookmarkPrefix: 'students',
    color: 'from-emerald-500 to-emerald-700',
    topics: 14,
    focusArea: 'مهارات العرض والكتابة الأكاديمية',
    sectionId: 'oral-expression' as const,
  },
  {
    label: 'الأساتذة الجامعيين',
    icon: UserCheck,
    bookmarkPrefix: 'professors',
    color: 'from-amber-500 to-amber-700',
    topics: 14,
    focusArea: 'فنون الإلقاء والتواصل الفعّال',
    sectionId: 'oral-expression' as const,
  },
  {
    label: 'التلاميذ',
    icon: School,
    bookmarkPrefix: 'pupils',
    color: 'from-teal-500 to-teal-700',
    topics: 14,
    focusArea: 'أساسيات التعبير والتحدث بثقة',
    sectionId: 'oral-expression' as const,
  },
]

// ─── Weekly Activity Data ────────────────────────────────────────
const arabicDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']

// ─── Learning Tips Data ─────────────────────────────────────────
const learningTips = [
  {
    id: 'tip-bookmark',
    icon: Bookmark,
    title: 'احفظ المحتويات المهمة',
    description: 'اضغط على أيقونة الحفظ في أي محتوى للعودة إليه لاحقاً. المحتويات المحفوظة تساعدك على تتبع تقدمك وتسهل مراجعة المواضيع الهامة.',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    id: 'tip-listen',
    icon: Headphones,
    title: 'استخدم ميزة الاستماع الصوتي',
    description: 'استمع إلى المحتوى أثناء التنقل أو أثناء أداء مهام أخرى. ميزة الاستماع متاحة في جميع الأقسام وتساعدك على التعلم متعدد الحواس.',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'tip-explore',
    icon: Eye,
    title: 'استكشف محتوى الفئات الثلاث',
    description: 'اقرأ محتوى الطلبة والأساتذة والتلاميذ لتحصل على رؤية شاملة. كل فئة تقدم المحتوى بطريقة تناسب مستواها.',
    color: 'from-teal-400 to-teal-600',
  },
  {
    id: 'tip-daily',
    icon: Calendar,
    title: 'تعلم قليلاً كل يوم',
    description: 'الاستمرارية هي المفتاح! خصص 15 دقيقة يومياً للتعلم. حتى التقدم البسيط يومياً يتراكم لنتائج كبيرة على المدى الطويل.',
    color: 'from-rose-400 to-rose-600',
  },
  {
    id: 'tip-practice',
    icon: Mic,
    title: 'تدرّب على الإلقاء',
    description: 'بعد قراءة المحتوى، تدرّب على إلقاء ما تعلمته بصوت عالٍ. هذا يعزز الفهم ويطور مهارات التعبير الشفهي لديك.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'tip-search',
    icon: Compass,
    title: 'استخدم البحث الشامل',
    description: 'اضغط Ctrl+K للبحث في جميع المحتوى. يمكنك العثور بسرعة على أي موضوع يهمك عبر جميع أقسام المنصة.',
    color: 'from-sky-400 to-sky-600',
  },
]

// ─── Motivational Texts ─────────────────────────────────────────
const motivationalTexts = [
  { min: 0, max: 10, text: 'ابدأ رحلتك التعليمية الآن! 🚀' },
  { min: 11, max: 25, text: 'خطوة رائعة! استمر في التقدم! 💪' },
  { min: 26, max: 50, text: 'أنت في الطريق الصحيح! واصل! 🌟' },
  { min: 51, max: 75, text: 'تقدم ممتاز! أنت نجم! ⭐' },
  { min: 76, max: 99, text: 'مذهل! قريب من النهاية! 🏆' },
  { min: 100, max: 100, text: 'أكملت الرحلة! أنت بطل! 🎉' },
]

function getMotivationalText(progress: number): string {
  const match = motivationalTexts.find(m => progress >= m.min && progress <= m.max)
  return match?.text ?? 'استمر في التقدم!'
}

function getStreakMotivation(streak: number): string {
  if (streak === 0) return 'ابدأ يومك بالتعلم!'
  if (streak < 3) return 'بداية رائعة، واصل!'
  if (streak < 7) return 'أسبوعك يتشكّل! استمر!'
  if (streak < 14) return 'أسبوعان متتاليان! مذهل!'
  if (streak < 30) return 'أنت عادة تعليمية! رائع!'
  return 'أسطورة الاستمرارية! 🏆'
}

// ─── Mini Circular Progress Component ────────────────────────────
function MiniCircularProgress({ value, size = 48, strokeWidth = 4, colorClass = 'text-primary' }: {
  value: number; size?: number; strokeWidth?: number; colorClass?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor"
        className="text-muted/30" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor"
        className={colorClass} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  )
}

// ─── Sparkle Effect Component ────────────────────────────────────
function SparkleEffect({ active }: { active: boolean }) {
  if (!active) return null
  const sparkles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: (i * 60),
    delay: i * 0.15,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute left-1/2 top-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
            x: [0, Math.cos((s.angle * Math.PI) / 180) * 60],
            y: [0, Math.sin((s.angle * Math.PI) / 180) * 60],
          }}
          transition={{
            duration: 0.8,
            delay: s.delay,
            ease: 'easeOut',
          }}
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Count Up Animation Hook ─────────────────────────────────────
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === prevTarget.current) return
    const start = prevTarget.current
    const diff = target - start
    const startTime = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.round(start + diff * eased))
      if (progress >= 1) {
        clearInterval(timer)
        prevTarget.current = target
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

// ─── Main Component ──────────────────────────────────────────────
export default function ProgressDashboard() {
  const { bookmarks, setActiveSection } = useAppStore()
  const [expandedTip, setExpandedTip] = useState<string | null>(null)
  const [sparkleActive, setSparkleActive] = useState(false)
  const [claimedBadges, setClaimedBadges] = useState<Set<string>>(new Set())
  const prevProgressRef = useRef(0)
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [streak, setStreak] = useState(0)

  // Calculate progress
  const oralBookmarks = bookmarks.filter(b => b.startsWith('oral-')).length
  const writtenBookmarks = bookmarks.filter(b => b.startsWith('written-')).length
  const totalBookmarks = bookmarks.length

  // Simple progress calculation
  const overallProgress = Math.min(100, Math.round((totalBookmarks / 14) * 100))

  // Count up animation
  const animatedProgress = useCountUp(overallProgress, 1200)

  // Sparkle effect when progress changes
  useEffect(() => {
    if (overallProgress > prevProgressRef.current && prevProgressRef.current !== 0) {
      setSparkleActive(true)
      const timer = setTimeout(() => setSparkleActive(false), 1500)
      return () => clearTimeout(timer)
    }
    prevProgressRef.current = overallProgress
  }, [overallProgress])

  // Load weekly activity and streak from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('alta7reer-weekly-activity')
      if (stored) {
        setWeeklyData(JSON.parse(stored))
      } else {
        // Generate simulated data based on bookmarks
        const simData = arabicDays.map(() => Math.min(3, Math.floor(Math.random() * (totalBookmarks > 0 ? 3 : 1))))
        setWeeklyData(simData)
        localStorage.setItem('alta7reer-weekly-activity', JSON.stringify(simData))
      }

      const storedStreak = localStorage.getItem('alta7reer-streak')
      if (storedStreak) {
        const parsed = JSON.parse(storedStreak)
        const lastDate = parsed.lastDate
        const today = new Date().toDateString()
        if (lastDate === today) {
          setStreak(parsed.count)
        } else if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
          // Continue streak if visited yesterday
          const newCount = parsed.count + 1
          setStreak(newCount)
          localStorage.setItem('alta7reer-streak', JSON.stringify({ count: newCount, lastDate: today }))
        } else {
          // Reset streak
          setStreak(1)
          localStorage.setItem('alta7reer-streak', JSON.stringify({ count: 1, lastDate: today }))
        }
      } else {
        setStreak(1)
        localStorage.setItem('alta7reer-streak', JSON.stringify({ count: 1, lastDate: new Date().toDateString() }))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [totalBookmarks])

  // Rotate tips on each visit
  const tipOffset = typeof window !== 'undefined'
    ? Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % learningTips.length
    : 0
  const rotatedTips = [...learningTips.slice(tipOffset), ...learningTips.slice(0, tipOffset)]

  // Determine achievements unlocked status based on bookmarks
  const updatedAchievements = achievements.map(a => {
    let unlocked = a.unlocked
    let progress = a.progress
    if (a.id === 'reader') {
      unlocked = totalBookmarks >= 5
      progress = Math.min(100, Math.round((totalBookmarks / 5) * 100))
    }
    if (a.id === 'scholar') {
      // Check if visited all sections (simplified: based on bookmarks variety)
      const uniquePrefixes = new Set(bookmarks.map(b => b.split('-').slice(0, 2).join('-')))
      unlocked = uniquePrefixes.size >= 7
      progress = Math.min(100, Math.round((uniquePrefixes.size / 7) * 100))
    }
    if (a.id === 'master') {
      unlocked = oralBookmarks >= 5
      progress = Math.min(100, Math.round((oralBookmarks / 5) * 100))
    }
    return { ...a, unlocked, progress }
  })

  const handleClaimBadge = useCallback((id: string) => {
    setClaimedBadges(prev => new Set(prev).add(id))
  }, [])

  const handleQuickAction = useCallback((sectionId: string) => {
    setActiveSection(sectionId as 'home' | 'about' | 'live-lessons' | 'recorded-lessons' | 'oral-expression' | 'written-expression' | 'contact' | 'progress')
  }, [setActiveSection])

  const activityColors = ['bg-muted/50', 'bg-emerald-200 dark:bg-emerald-800/50', 'bg-amber-400 dark:bg-amber-600/60', 'bg-emerald-500']
  const activityLabels = ['لا نشاط', 'نشاط خفيف', 'نشاط متوسط', 'نشاط نشط']

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 sm:space-y-8"
      >
        {/* ─── Header ──────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-bl from-primary to-emerald-800 flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/20 mb-4">
              <TrendingUp className="h-9 w-9" />
            </div>
            <motion.div
              className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Sparkles className="h-3 w-3 text-amber-900" />
            </motion.div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">لوحة التقدم التعليمي</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">تتبع تقدمك في رحلة تعلّم مهارات التحرير الكتابي والشفهي</p>
        </motion.div>

        {/* ─── Top Grid: Progress + Streak + Quick Actions ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Overall Progress Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-lg overflow-hidden relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }} />
              <div className="h-1.5 bg-gradient-to-l from-primary via-emerald-500 to-amber-500" />
              <CardContent className="p-6 sm:p-8 relative">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Enhanced Circular Progress */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0">
                    {/* Rotating outer ring */}
                    <motion.div
                      className="absolute inset-[-8px] rounded-full border-2 border-dashed border-primary/20"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute inset-[-14px] rounded-full border border-dashed border-amber-300/15"
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                    />

                    <svg className="w-28 h-28 sm:w-36 sm:h-36 -rotate-90" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="7" />
                      <circle
                        cx="50" cy="50" r="42" fill="none" stroke="url(#progressGradient)" strokeWidth="7" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallProgress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                      />
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold bg-gradient-to-bl from-primary to-emerald-700 bg-clip-text text-transparent">
                        {animatedProgress}%
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">مكتمل</span>
                    </div>

                    {/* Sparkle effect */}
                    <SparkleEffect active={sparkleActive} />
                  </div>

                  {/* Progress Info */}
                  <div className="flex-1 text-center sm:text-right">
                    <h3 className="text-xl font-bold mb-2">تقدمك العام</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {overallProgress < 25
                        ? 'ابدأ رحلتك التعليمية باستكشاف المحتوى المتاح!'
                        : overallProgress < 50
                        ? 'أنت في الطريق الصحيح! واصل الاستكشاف والتعلّم.'
                        : overallProgress < 75
                        ? 'تقدم ممتاز! لقد أنجزت أكثر من النصف.'
                        : 'مذهل! أنت قريب من إتمام رحلتك التعليمية!'}
                    </p>
                    <p className="text-sm font-semibold text-primary mb-4">
                      {getMotivationalText(overallProgress)}
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <div className="flex items-center gap-1.5 text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">{totalBookmarks}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs">محتوى محفوظ</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full">
                        <Flame className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-amber-700 dark:text-amber-400 font-medium">{streak}</span>
                        <span className="text-amber-600 dark:text-amber-400 text-xs">أيام متتالية</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm bg-teal-50 dark:bg-teal-950/30 px-3 py-1.5 rounded-full">
                        <Mic className="h-3.5 w-3.5 text-teal-500" />
                        <span className="text-teal-700 dark:text-teal-400 font-medium">{oralBookmarks}</span>
                        <span className="text-teal-600 dark:text-teal-400 text-xs">شفهي</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-full">
                        <Pen className="h-3.5 w-3.5 text-rose-500" />
                        <span className="text-rose-700 dark:text-rose-400 font-medium">{writtenBookmarks}</span>
                        <span className="text-rose-600 dark:text-rose-400 text-xs">كتابي</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Streak + Quick Actions */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Learning Streak */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-l from-amber-400 via-orange-500 to-red-500" />
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-bl from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20"
                    animate={streak > 0 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <Flame className="h-7 w-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">سلسلة التعلم</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{streak}</span>
                      <span className="text-xs text-muted-foreground">يوم متتالي</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{getStreakMotivation(streak)}</p>
                  </div>
                </div>
                {/* Streak dots visualization */}
                <div className="flex gap-1 mt-3 justify-center">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                        i < streak % 7
                          ? 'bg-gradient-to-bl from-amber-400 to-orange-500 text-white shadow-sm shadow-amber-500/20'
                          : 'bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-l from-emerald-500 via-teal-500 to-primary" />
              <CardContent className="p-5 space-y-2.5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  إجراءات سريعة
                </h3>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 rounded-xl bg-gradient-to-l from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 hover:from-emerald-100 hover:to-emerald-200/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30 transition-all duration-300"
                  onClick={() => handleQuickAction('oral-expression')}
                >
                  <PlayCircle className="h-5 w-5 shrink-0" />
                  <div className="text-right">
                    <div className="text-xs font-bold">تابع التعلم</div>
                    <div className="text-[10px] opacity-70">استكمل من حيث توقفت</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 rounded-xl bg-gradient-to-l from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 hover:from-amber-100 hover:to-amber-200/50 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30 transition-all duration-300"
                  onClick={() => handleQuickAction('recorded-lessons')}
                >
                  <Bookmark className="h-5 w-5 shrink-0" />
                  <div className="text-right">
                    <div className="text-xs font-bold">راجع المحفوظات</div>
                    <div className="text-[10px] opacity-70">العودة للمحتوى المحفوظ</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 rounded-xl bg-gradient-to-l from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 hover:from-teal-100 hover:to-teal-200/50 text-teal-700 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/30 transition-all duration-300"
                  onClick={() => handleQuickAction('recorded-lessons')}
                >
                  <Compass className="h-5 w-5 shrink-0" />
                  <div className="text-right">
                    <div className="text-xs font-bold">استكشف محتوى جديد</div>
                    <div className="text-[10px] opacity-70">اكتشف دروساً جديدة</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── Section Divider ──────────────────────────────────── */}
        <div className="decorative-separator py-2">
          <span className="relative z-10 bg-background px-4 text-muted-foreground text-lg">✦</span>
        </div>

        {/* ─── Learning Paths ──────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            مسارات التعلّم
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {learningPaths.map((path, idx) => {
              const PathIcon = path.icon
              const pathBookmarks = path.category === 'oral-expression' ? oralBookmarks : writtenBookmarks
              const progress = Math.min(100, Math.round((pathBookmarks / path.totalTopics) * 100))
              const completedCheckpoints = Math.round((pathBookmarks / path.totalTopics) * path.totalTopics)

              return (
                <Card key={idx} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                  <div className={`h-1 bg-gradient-to-l ${path.color}`} />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-bl ${path.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <PathIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm mb-1">{path.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{pathBookmarks}/{path.totalTopics} موضوع</span>
                          <Badge variant="outline" className={`text-[10px] h-5 ${path.textColor}`}>
                            {progress}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Checkpoint/Milestone dots */}
                    <div className="flex items-center gap-1 mb-3 px-1">
                      {Array.from({ length: path.totalTopics }).map((_, i) => (
                        <div key={i} className="flex-1 flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full transition-all duration-500 shrink-0 ${
                              i < completedCheckpoints
                                ? `${path.dotColor} shadow-sm scale-110`
                                : 'bg-muted/60 border border-muted-foreground/20'
                            }`}
                          />
                          {i < path.totalTopics - 1 && (
                            <div className={`flex-1 h-0.5 mx-0.5 transition-all duration-500 ${
                              i < completedCheckpoints - 1 ? path.dotColor : 'bg-muted/40'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-muted/30 overflow-hidden mb-3">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-l ${path.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>

                    {/* Next step indicator */}
                    <div className={`flex items-center gap-2 p-2.5 rounded-lg ${path.bgColor} border ${path.borderColor}`}>
                      <PlayCircle className={`h-4 w-4 shrink-0 ${path.textColor}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-muted-foreground">الخطوة التالية:</span>
                        <p className={`text-xs font-medium ${path.textColor} truncate`}>{path.nextStep}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 text-xs ${path.textColor} hover:bg-transparent`}
                        onClick={() => handleQuickAction(path.nextStepId)}
                      >
                        ابدأ ←
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* ─── Section Divider ──────────────────────────────────── */}
        <div className="decorative-separator py-2">
          <span className="relative z-10 bg-background px-4 text-muted-foreground text-lg">✦</span>
        </div>

        {/* ─── Middle Grid: Audience + Weekly Activity ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Audience Stats */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              تقدم حسب الفئة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {audienceData.map((audience, idx) => {
                const AudienceIcon = audience.icon
                const audienceBookmarks = bookmarks.filter(b => b.includes(audience.bookmarkPrefix)).length
                const progress = Math.min(100, Math.round((audienceBookmarks / audience.topics) * 100))

                return (
                  <Card key={idx} className="border-0 shadow-sm text-center group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className={`h-1 bg-gradient-to-l ${audience.color}`} />
                    <CardContent className="p-5">
                      {/* Avatar + Mini circular progress */}
                      <div className="relative inline-block mb-3">
                        <MiniCircularProgress
                          value={progress}
                          size={60}
                          strokeWidth={4}
                          colorClass={
                            idx === 0 ? 'text-emerald-500' :
                            idx === 1 ? 'text-amber-500' : 'text-teal-500'
                          }
                        />
                        <div className={`absolute inset-0 flex items-center justify-center`}>
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-bl ${audience.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <AudienceIcon className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm mb-1">{audience.label}</h4>
                      <p className="text-xl font-bold text-primary mb-1">{progress}%</p>
                      <p className="text-xs text-muted-foreground mb-1">{audienceBookmarks}/{audience.topics} موضوع محفوظ</p>
                      <p className="text-[10px] text-muted-foreground/70 mb-3">{audience.focusArea}</p>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px] gap-1 rounded-full"
                        onClick={() => handleQuickAction(audience.sectionId)}
                      >
                        <Eye className="h-3 w-3" />
                        عرض المحتوى
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>

          {/* Weekly Activity Chart */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg overflow-hidden h-full">
              <div className="h-1 bg-gradient-to-l from-emerald-400 via-teal-400 to-primary" />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    النشاط الأسبوعي
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      const newData = arabicDays.map(() => Math.floor(Math.random() * 4))
                      setWeeklyData(newData)
                      try { localStorage.setItem('alta7reer-weekly-activity', JSON.stringify(newData)) } catch {}
                    }}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>

                {/* Bar chart */}
                <div className="flex items-end gap-2 h-32 mb-3">
                  {weeklyData.map((level, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            className={`w-full rounded-t-md ${activityColors[level]} transition-all duration-500`}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(8, (level / 3) * 100)}%` }}
                            transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">{arabicDays[i]}: {activityLabels[level]}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Day labels */}
                <div className="flex gap-2">
                  {arabicDays.map((day, i) => (
                    <div key={i} className="flex-1 text-center text-[9px] text-muted-foreground truncate">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/50">
                  {activityColors.slice(1).map((color, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                      <span className="text-[8px] text-muted-foreground">{activityLabels[i + 1].split(' ')[1] || activityLabels[i + 1]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── Section Divider ──────────────────────────────────── */}
        <div className="decorative-separator py-2">
          <span className="relative z-10 bg-background px-4 text-muted-foreground text-lg">✦</span>
        </div>

        {/* ─── Achievement Badges ───────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            الإنجازات
            <Badge variant="outline" className="text-[10px] h-5 mr-2">
              {updatedAchievements.filter(a => a.unlocked).length}/{updatedAchievements.length} مفتوح
            </Badge>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {updatedAchievements.map((achievement) => {
              const AchievementIcon = achievement.icon
              const isClaimed = claimedBadges.has(achievement.id)

              return (
                <Tooltip key={achievement.id}>
                  <TooltipTrigger asChild>
                    <Card
                      className={`border-0 shadow-sm text-center transition-all duration-500 overflow-hidden cursor-default ${
                        achievement.unlocked
                          ? `hover:shadow-lg ${achievement.unlocked && !isClaimed ? 'animate-badge-glow' : ''}`
                          : 'opacity-50 grayscale'
                      }`}
                    >
                      <div className={`h-1 bg-gradient-to-l ${achievement.unlocked ? achievement.color : 'from-muted to-muted'}`} />
                      <CardContent className="p-4">
                        <div className={`relative w-14 h-14 rounded-xl mx-auto mb-2 flex items-center justify-center transition-all duration-500 ${
                          achievement.unlocked
                            ? `bg-gradient-to-bl ${achievement.color} shadow-lg ${achievement.glowColor}`
                            : 'bg-muted'
                        }`}>
                          {achievement.unlocked ? (
                            <AchievementIcon className="h-6 w-6 text-white" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}

                          {/* Claimed checkmark overlay */}
                          <AnimatePresence>
                            {achievement.unlocked && isClaimed && (
                              <motion.div
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                              >
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <h4 className="font-bold text-xs mb-1">{achievement.title}</h4>
                        <p className="text-[9px] text-muted-foreground leading-tight mb-2 line-clamp-2">{achievement.requirement}</p>

                        {/* Progress bar */}
                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1.5">
                          <motion.div
                            className={`h-full rounded-full ${achievement.unlocked ? `bg-gradient-to-l ${achievement.color}` : 'bg-muted-foreground/30'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${achievement.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                          />
                        </div>
                        <span className="text-[8px] text-muted-foreground">{achievement.progress}%</span>

                        {/* Claim button */}
                        {achievement.unlocked && !isClaimed && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-[9px] mt-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 gap-1 rounded-full px-3"
                              onClick={() => handleClaimBadge(achievement.id)}
                            >
                              <Award className="h-3 w-3" />
                              اكسب
                            </Button>
                          </motion.div>
                        )}

                        {isClaimed && (
                          <Badge className="mt-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-[8px] h-4 gap-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            مكتسب
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[200px]">
                    <p className="font-bold text-xs mb-1">{achievement.title}</p>
                    <p className="text-[10px] text-muted-foreground">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <p className="text-[10px] text-amber-500 mt-1">🔧 {achievement.requirement}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </motion.div>

        {/* ─── Section Divider ──────────────────────────────────── */}
        <div className="decorative-separator py-2">
          <span className="relative z-10 bg-background px-4 text-muted-foreground text-lg">✦</span>
        </div>

        {/* ─── Learning Tips ────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            نصائح لتحسين تقدمك
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rotatedTips.slice(0, 6).map((tip, idx) => {
              const TipIcon = tip.icon
              const isExpanded = expandedTip === tip.id

              return (
                <Card
                  key={tip.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                >
                  <div className={`h-1 bg-gradient-to-l ${tip.color} ${isExpanded ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'} transition-opacity duration-300`} />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-bl ${tip.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                        <TipIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs">{tip.title}</h4>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          </motion.div>
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.p
                              className="text-[11px] text-muted-foreground leading-relaxed mt-2"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                              {tip.description}
                            </motion.p>
                          )}
                          {!isExpanded && (
                            <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">{tip.description}</p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* ─── Section Divider ──────────────────────────────────── */}
        <div className="decorative-separator py-2">
          <span className="relative z-10 bg-background px-4 text-muted-foreground text-lg">✦</span>
        </div>

        {/* ─── Study Planner & Notes ────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <StudyPlanner />
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
