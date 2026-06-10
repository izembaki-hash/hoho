'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Mic, Pen, Volume2, Search, Bookmark, ChevronLeft, ChevronRight, Sparkles, Compass, Zap, Rocket } from 'lucide-react'

interface OnboardingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const slides = [
  {
    icon: <Sparkles className="h-12 w-12" />,
    title: 'مرحباً بك!',
    description: 'أهلاً بك في منصة التحرير الكتابي والشفهي، منصتك الشاملة لتعلّم مهارات التعبير والإبداع اللغوي. اكتشف عالماً من المحتوى التعليمي المتميز المصمّم خصيصاً لك.',
    gradient: 'from-emerald-500 to-emerald-700',
    bgGradient: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20',
  },
  {
    icon: <Compass className="h-12 w-12" />,
    title: 'استكشف المحتوى',
    description: 'تصفّح أقسامنا المتنوعة: التحرير الشفهي مع مهارات العرض والإلقاء، والتحرير الكتابي مع فنون الخطابة والمقال والسيرة الذاتية. محتوى مصمم للطلبة والأساتذة والتلاميذ.',
    gradient: 'from-amber-500 to-amber-700',
    bgGradient: 'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20',
    sections: [
      { icon: <Mic className="h-5 w-5" />, label: 'التحرير الشفهي' },
      { icon: <Pen className="h-5 w-5" />, label: 'التحرير الكتابي' },
      { icon: <BookOpen className="h-5 w-5" />, label: 'الدروس المسجلة' },
    ],
  },
  {
    icon: <Zap className="h-12 w-12" />,
    title: 'ميزات تفاعلية',
    description: 'استفد من ميزاتنا التفاعلية الفريدة لتحسين تجربتك التعليمية.',
    gradient: 'from-teal-500 to-teal-700',
    bgGradient: 'from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20',
    features: [
      { icon: <Volume2 className="h-5 w-5" />, label: 'الاستماع للمحتوى', desc: 'تحويل النص إلى كلام' },
      { icon: <Search className="h-5 w-5" />, label: 'بحث شامل', desc: 'Ctrl+K للبحث السريع' },
      { icon: <Bookmark className="h-5 w-5" />, label: 'حفظ المحتوى', desc: 'أضف للمفضلة والعودة لاحقاً' },
    ],
  },
  {
    icon: <Rocket className="h-12 w-12" />,
    title: 'ابدأ الآن!',
    description: 'أنت جاهز لبدء رحلتك التعليمية! استكشف الأقسام، تفاعل مع المحتوى، وحقق إنجازاتك. لا تنسَ تتبع تقدمك من لوحة التقدم.',
    gradient: 'from-primary to-emerald-700',
    bgGradient: 'from-primary/10 to-emerald-100/50 dark:from-primary/20 dark:to-emerald-900/20',
  },
]

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? -60 : 60,
    opacity: 0,
  }),
}

function OnboardingContent({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)

  const slide = slides[currentStep]

  const handleSkip = () => {
    onComplete()
  }

  const goNext = () => {
    if (currentStep < slides.length - 1) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const goPrevious = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className={`relative bg-gradient-to-b ${slide.bgGradient} transition-colors duration-500`}>
      {/* Skip button - top left for RTL */}
      <button
        onClick={handleSkip}
        className="absolute top-4 left-4 z-10 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-background/50"
      >
        تخطي
      </button>

      <div className="p-8 pt-12 pb-6 min-h-[380px] flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="flex-1 flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-bl ${slide.gradient} flex items-center justify-center text-white mb-6 shadow-lg`}>
              {slide.icon}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {slide.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-4">
              {slide.description}
            </p>

            {/* Section icons for step 2 */}
            {slide.sections && (
              <div className="flex items-center gap-4 mt-2">
                {slide.sections.map((section, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-amber-600 shadow-sm">
                      {section.icon}
                    </div>
                    <span className="text-xs text-muted-foreground">{section.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Features for step 3 */}
            {slide.features && (
              <div className="space-y-2 mt-2 w-full max-w-xs">
                {slide.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-background/80 border border-border/50 rounded-lg px-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                      {feature.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{feature.label}</p>
                      <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar: progress dots + navigation */}
      <div className="border-t border-border/50 bg-background/60 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Previous button */}
          <button
            onClick={goPrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 text-sm transition-colors ${
              currentStep === 0
                ? 'text-muted-foreground/30 cursor-not-allowed'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDirection(idx > currentStep ? 1 : -1); setCurrentStep(idx) }}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentStep
                    ? `w-6 h-2 bg-gradient-to-l ${slide.gradient}`
                    : idx < currentStep
                    ? 'w-2 h-2 bg-primary/40'
                    : 'w-2 h-2 bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          {/* Next / Start button */}
          {currentStep === slides.length - 1 ? (
            <Button
              onClick={onComplete}
              className={`bg-gradient-to-l ${slide.gradient} text-white shadow-md hover:opacity-90`}
              size="sm"
            >
              ابدأ الاستكشاف
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const [mountKey, setMountKey] = useState(0)

  const handleComplete = () => {
    try {
      localStorage.setItem('onboarding-complete', 'true')
    } catch {}
    onOpenChange(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // Remount content with fresh state when opening
      setMountKey(k => k + 1)
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl [&>button]:hidden"
      >
        {open && <OnboardingContent key={mountKey} onComplete={handleComplete} />}
      </DialogContent>
    </Dialog>
  )
}
