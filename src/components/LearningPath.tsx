'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap, UserCheck, School,
  Lightbulb, CheckCircle2,
  ArrowLeft, Sparkles
} from 'lucide-react'
import { useAppStore, type SectionId } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Path Data ────────────────────────────────────────────────────
interface PathStep {
  title: string
  description: string
  sectionId: SectionId
}

interface LearningPathData {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  dotColor: string
  steps: PathStep[]
  tip: string
}

const learningPaths: LearningPathData[] = [
  {
    id: 'university-student',
    title: 'مسار الطالب الجامعي',
    icon: GraduationCap,
    color: 'from-emerald-500 to-emerald-700',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
    steps: [
      { title: 'أساسيات التعبير الشفهي', description: 'تعلّم أسس التعبير الشفهي وأنواعه ومهاراته الأساسية', sectionId: 'oral-expression' },
      { title: 'علامات الترقيم', description: 'إتقان قواعد علامات الترقيم في الكتابة العربية', sectionId: 'written-expression' },
      { title: 'بناء النص', description: 'تعلّم بناء النص المترابط والمقنع', sectionId: 'written-expression' },
      { title: 'فن الخطابة', description: 'إتقان فن الخطابة والإلقاء أمام الجمهور', sectionId: 'oral-expression' },
      { title: 'كتابة المقال', description: 'تعلّم كتابة المقال المنظم والمؤثر', sectionId: 'written-expression' },
      { title: 'السيرة الذاتية', description: 'كتابة سيرة ذاتية احترافية جذابة', sectionId: 'written-expression' },
    ],
    tip: 'ابدأ بالتعبير الشفهي أولاً لتطوير ثقتك بنفسك، ثم انتقل للمهارات الكتابية. الممارسة اليومية هي المفتاح!',
  },
  {
    id: 'professor',
    title: 'مسار الأستاذ الجامعي',
    icon: UserCheck,
    color: 'from-amber-500 to-amber-700',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
    steps: [
      { title: 'الخطابة الأكاديمية', description: 'إتقان فن الإلقاء الأكاديمي في القاعات والمحاضرات', sectionId: 'oral-expression' },
      { title: 'التقارير الأكاديمية', description: 'كتابة التقارير العلمية الدقيقة والمفصلة', sectionId: 'written-expression' },
      { title: 'بناء النص الأكاديمي', description: 'تعلّم منهجية بناء النصوص الأكاديمية الرصينة', sectionId: 'written-expression' },
      { title: 'المقال العلمي', description: 'إتقان كتابة المقال العلمي المحكم', sectionId: 'written-expression' },
      { title: 'المداخلة في المؤتمرات', description: 'فنون المداخلة وإدارة الجلسات العلمية', sectionId: 'oral-expression' },
    ],
    tip: 'ركّز على المهارات الأكاديمية المتقدمة. يمكنك استخدام المحتوى كمرجع لطلبتك أيضاً!',
  },
  {
    id: 'pupil',
    title: 'مسار التلميذ',
    icon: School,
    color: 'from-teal-500 to-teal-700',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-600 dark:text-teal-400',
    dotColor: 'bg-teal-500',
    steps: [
      { title: 'التعبير الشفهي', description: 'تعلّم أساسيات التعبير الشفهي والتحدث بثقة', sectionId: 'oral-expression' },
      { title: 'علامات الترقيم', description: 'إتقان علامات الترقيم الأساسية في الكتابة', sectionId: 'written-expression' },
      { title: 'كتابة الرسائل', description: 'تعلّم كتابة الرسائل الإدارية والشخصية', sectionId: 'written-expression' },
      { title: 'التلخيص', description: 'إتقان مهارة تلخيص النصوص بكفاءة', sectionId: 'written-expression' },
      { title: 'كتابة المقال', description: 'تعلّم كتابة المقال المدرسي المنظم', sectionId: 'written-expression' },
    ],
    tip: 'خذ وقتك في كل خطوة! الأفضل أن تتقن مهارة قبل الانتقال للتالية. 15 دقيقة يومياً كافية!',
  },
]

const tabData = learningPaths.map((path, idx) => ({
  id: path.id,
  label: path.title.replace('مسار ', ''),
  icon: path.icon,
  color: path.color,
  bgColor: path.bgColor,
  borderColor: path.borderColor,
  textColor: path.textColor,
  index: idx,
}))

export default function LearningPath() {
  const [activeTab, setActiveTab] = useState(0)
  const { bookmarks, setActiveSection } = useAppStore()
  const currentPath = learningPaths[activeTab]
  const PathIcon = currentPath.icon

  const handleStartStep = (sectionId: SectionId) => {
    setActiveSection(sectionId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate progress for each step based on bookmarks
  const getStepProgress = (step: PathStep, stepIndex: number): boolean => {
    // Simple heuristic: a step is "completed" if there are enough bookmarks in that section
    const sectionBookmarks = bookmarks.filter(b => {
      if (step.sectionId === 'oral-expression') return b.startsWith('oral-')
      if (step.sectionId === 'written-expression') return b.startsWith('written-')
      return b.includes(step.sectionId)
    }).length

    // Each step needs approximately 2 bookmarks in that section to be considered "completed"
    const threshold = (stepIndex + 1) * 2
    return sectionBookmarks >= threshold
  }

  const completedSteps = currentPath.steps.filter((step, idx) => getStepProgress(step, idx)).length
  const progressPercentage = Math.round((completedSteps / currentPath.steps.length) * 100)

  return (
    <Card className="border-0 shadow-lg overflow-hidden gradient-border-animate">
      {/* Gradient top bar */}
      <div className={`h-1.5 bg-gradient-to-l ${currentPath.color}`} />

      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-bl ${currentPath.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
            <PathIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold">مسارات التعلّم</h3>
            <p className="text-xs text-muted-foreground">اختر المسار المناسب لك وابدأ رحلتك التعليمية</p>
          </div>
          {progressPercentage > 0 && (
            <Badge variant="outline" className={`text-[10px] ${currentPath.textColor}`}>
              {progressPercentage}% مكتمل
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-thin">
          {tabData.map((tab, idx) => {
            const TabIcon = tab.icon
            const isActive = activeTab === idx
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap shrink-0 ${
                  isActive
                    ? `bg-gradient-to-bl ${tab.color} text-white shadow-md`
                    : `bg-muted/50 text-muted-foreground hover:bg-muted`
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Active Path Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Path Title */}
            <div className="flex items-center gap-2 mb-4">
              <h4 className={`font-bold ${currentPath.textColor}`}>{currentPath.title}</h4>
              <Badge variant="secondary" className="text-[10px]">
                {currentPath.steps.length} خطوات
              </Badge>
            </div>

            {/* Timeline */}
            <div className="relative space-y-0">
              {currentPath.steps.map((step, idx) => {
                const isCompleted = getStepProgress(step, idx)
                const isLast = idx === currentPath.steps.length - 1

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                    className="flex gap-3 sm:gap-4"
                  >
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                        isCompleted
                          ? `${currentPath.dotColor} text-white border-transparent shadow-md`
                          : 'bg-background border-muted-foreground/20 text-muted-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 flex-1 min-h-[32px] transition-all duration-500 ${
                          isCompleted ? currentPath.dotColor : 'bg-muted-foreground/15'
                        }`} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className={`flex-1 pb-4 ${isLast ? 'pb-0' : ''}`}>
                      <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                        isCompleted
                          ? `${currentPath.bgColor} ${currentPath.borderColor}`
                          : 'bg-background border-border/50 hover:border-border'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h5 className={`font-bold text-sm mb-1 ${isCompleted ? currentPath.textColor : ''}`}>
                              {step.title}
                            </h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 text-xs gap-1 shrink-0 ${currentPath.textColor} hover:bg-transparent`}
                            onClick={() => handleStartStep(step.sectionId)}
                          >
                            ابدأ
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Tip Callout */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mt-4 p-4 rounded-xl ${currentPath.bgColor} border ${currentPath.borderColor} flex items-start gap-3`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-bl ${currentPath.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h5 className={`text-xs font-bold mb-1 ${currentPath.textColor}`}>نصيحة</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">{currentPath.tip}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
