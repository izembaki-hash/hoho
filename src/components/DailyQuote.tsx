'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, Share2, BookmarkCheck, Bookmark, Copy, Check } from 'lucide-react'

// === Types ===
type Category = 'شعر' | 'نثر' | 'بلاغة' | 'نقد' | 'حكمة'
type Era = 'العصر الجاهلي' | 'العصر العباسي' | 'العصر الأندلسي' | 'العصر الحديث'

interface Quote {
  text: string
  author: string
  category: Category
  era: Era
}

// === 30 Arabic Literary Quotes ===
const quotes: Quote[] = [
  {
    text: 'الشعر ديوان العرب، فبه حفظت أنسابهم ومآثرهم، وبه دُفعت عنهم أذى أعدائهم',
    author: 'ابن قتيبة',
    category: 'شعر',
    era: 'العصر العباسي',
  },
  {
    text: 'خير الكلام ما قلّ ودلّ ولم يُطلل فيُملّ',
    author: 'عبد الملك بن مروان',
    category: 'بلاغة',
    era: 'العصر العباسي',
  },
  {
    text: 'الكلام في النقد كالدواء، إن أُكثر منه قتل، وإن أُقلّ منه لم يُجدِ',
    author: 'قدامة بن جعفر',
    category: 'نقد',
    era: 'العصر العباسي',
  },
  {
    text: 'من أراد أن يكتب فليقرأ، ومن أراد أن ينطق فليسمع',
    author: 'أبو تمام',
    category: 'حكمة',
    era: 'العصر العباسي',
  },
  {
    text: 'إنما يُعرف فضل الكلام عند التأني، ويُظهر حسنه عند التبيين',
    author: 'الجاحظ',
    category: 'نثر',
    era: 'العصر العباسي',
  },
  {
    text: 'البيان يُحبّب المرء إلى القلوب، ويجعله في أعلى المراتب',
    author: 'عبد القاهر الجرجاني',
    category: 'بلاغة',
    era: 'العصر العباسي',
  },
  {
    text: 'لا يصلح القول إلا بالفعل، ولا الفعل إلا بالقول، ومتى اجتمعا كملت الفضيلة',
    author: 'ابن المقفع',
    category: 'حكمة',
    era: 'العصر العباسي',
  },
  {
    text: 'الشعر كلامٌ جُمع فأُوجز، ونُظم فأُحكم، ورُتّب فأُعجب',
    author: 'أبو هلال العسكري',
    category: 'شعر',
    era: 'العصر العباسي',
  },
  {
    text: 'نقدُ الشعر أصعب من نظمه، لأن الناقد يحتاج إلى ذوقٍ يُميّز، وعلمٍ يُحقّق',
    author: 'حازم القرطاجني',
    category: 'نقد',
    era: 'العصر الأندلسي',
  },
  {
    text: 'حُسن التأليف أن يكون كلّ موضع منه خليقاً أن يكون أول الكلام، ومخلقاً أن يكون آخره',
    author: 'ابن الأثير',
    category: 'نثر',
    era: 'العصر العباسي',
  },
  {
    text: 'أعذب الشعر أكذبه، وأصدقه أقلّه متاعبةً في معناه',
    author: 'المتنبي',
    category: 'شعر',
    era: 'العصر العباسي',
  },
  {
    text: 'الكلام صيدٌ والكتابة قيدٌ، قيّد صيودك بالحبال الواثقة',
    author: 'عبد الحميد الكاتب',
    category: 'نثر',
    era: 'العصر العباسي',
  },
  {
    text: 'من لم يهذّبه القرآن والشعر لا يحسن أن يتكلّم في الجدّ والهزل',
    author: 'أبو فرج الأصفهاني',
    category: 'بلاغة',
    era: 'العصر العباسي',
  },
  {
    text: 'البلاغة إيصال المعنى إلى القلب بأحسن صورة من اللفظ',
    author: 'الخطابي',
    category: 'بلاغة',
    era: 'العصر العباسي',
  },
  {
    text: 'النقد سوطٌ يُوقظ النائم، ومصباحٌ يُضيء للسالك',
    author: 'ابن رشيق القيرواني',
    category: 'نقد',
    era: 'العصر الأندلسي',
  },
  {
    text: 'إذا أردت أن تكتب فاكتب عن شيء تعرفه، وإذا أردت أن تنطق فتكلّم فيما تحسّه',
    author: 'عمرو بن كلثوم',
    category: 'حكمة',
    era: 'العصر الجاهلي',
  },
  {
    text: 'خير الشعر أصدقه، وخير الصدق أنفعُه، وخير النفع أبلغُه',
    author: 'زهير بن أبي سلمى',
    category: 'شعر',
    era: 'العصر الجاهلي',
  },
  {
    text: 'الكتابة صنبورٌ يُخرج ما في العقل من ماءٍ صافٍ أو كدر',
    author: 'ابن خلدون',
    category: 'نثر',
    era: 'العصر الحديث',
  },
  {
    text: 'من حسن القول اختصاره، ومن بلاغته إيجازه، ومن جماله تأثيره',
    author: 'طه حسين',
    category: 'بلاغة',
    era: 'العصر الحديث',
  },
  {
    text: 'العرب كانت أمةً شفاهيةً، فكان الشعرُ سجلّها، والبيانُ لسانها، والخطابةُ سيفها',
    author: 'شوقي ضيف',
    category: 'حكمة',
    era: 'العصر الحديث',
  },
  {
    text: 'كلّ كلمةٍ تُقال من غير تفكّرٍ كحجرٍ يُرمى في ظلامٍ لا يُدري أين يقع',
    author: 'أحمد أمين',
    category: 'حكمة',
    era: 'العصر الحديث',
  },
  {
    text: 'الخطابة فنٌّ يُحرك النفوس، ويُثير العواطف، ويُقنع العقول',
    author: 'محمد أبو موسى',
    category: 'بلاغة',
    era: 'العصر الحديث',
  },
  {
    text: 'النثر فنٌّ كالشعر، يحتاج إلى خيالٍ وذوقٍ وإحساسٍ بالجمال',
    author: 'ميخائيل نعيمة',
    category: 'نثر',
    era: 'العصر الحديث',
  },
  {
    text: 'لا يُحسن القول إلا من أحسنه العمل، ولا يُجيد النقد إلا من ذاق حلاوة الإبداع',
    author: 'عباس محمود العقاد',
    category: 'نقد',
    era: 'العصر الحديث',
  },
  {
    text: 'بينا تُعدّ القولُ ما عشتَ مقولاًUntil يُفلتُ منك فلا يُعاد',
    author: 'امرؤ القيس',
    category: 'شعر',
    era: 'العصر الجاهلي',
  },
  {
    text: 'البيان يُعرّف القليلَ فيصير كثيراً، والكثيرَ فيصير عظيماً',
    author: 'ابن سنان الخفاجي',
    category: 'بلاغة',
    era: 'العصر الأندلسي',
  },
  {
    text: 'لا تقل ما لا تعلم، ولا تتكلّم فيما لا تحسن، فإن نصف العلم أن تقول لا أعلم',
    author: 'الأصمعي',
    category: 'حكمة',
    era: 'العصر العباسي',
  },
  {
    text: 'القلمُ أشدّ من السيف، لأنّ السيفَ يقطع الجسد، والقلمَ يقطع الجهل',
    author: 'ابن عبد ربه',
    category: 'نثر',
    era: 'العصر الأندلسي',
  },
  {
    text: 'ألا لا يجهلن أحدٌ علينا فنجهلَ فوق جهل الجاهلينا',
    author: 'المتنبي',
    category: 'شعر',
    era: 'العصر العباسي',
  },
  {
    text: 'الكاتب الناجح من يجعل القارئ يرى ما يرى، ويحسّ بما يحسّ، ويُفكّر كما يُفكّر',
    author: 'الرافعي',
    category: 'نقد',
    era: 'العصر الحديث',
  },
]

// === Category Color Mapping ===
const categoryColors: Record<Category, string> = {
  'شعر': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'نثر': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'بلاغة': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  'نقد': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  'حكمة': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
}

// === Era Color Mapping (muted) ===
const eraColors: Record<Era, string> = {
  'العصر الجاهلي': 'bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  'العصر العباسي': 'bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  'العصر الأندلسي': 'bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  'العصر الحديث': 'bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400 border-slate-200 dark:border-slate-700',
}

// === Convert number to Arabic numeral ===
function toArabicNumeral(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return String(num).replace(/\d/g, (d) => arabicNumerals[parseInt(d)])
}

// === localStorage key ===
const FAVORITES_KEY = 'alta7reer-favorite-quotes'

export default function DailyQuote() {
  // Get today's quote index (day of month, 1-30)
  const getDailyIndex = useCallback(() => {
    const day = new Date().getDate() // 1-31
    return (day - 1) % 30 // 0-29
  }, [])

  const [currentIndex, setCurrentIndex] = useState(getDailyIndex)
  const [isPaused, setIsPaused] = useState(false)
  const [copied, setCopied] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentQuote = quotes[currentIndex]
  const isFavorite = favorites.includes(currentQuote.text)
  const dailyIndex = getDailyIndex()

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      // ignore
    }
  }, [favorites])

  // Auto-rotate every 10 seconds, pause on hover
  useEffect(() => {
    if (isPaused) {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
        autoRotateRef.current = null
      }
      return
    }

    autoRotateRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 30)
    }, 10000)

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
        autoRotateRef.current = null
      }
    }
  }, [isPaused])

  // Navigate to next quote
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % 30)
  }, [])

  // Navigate to previous quote
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + 30) % 30)
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback(() => {
    setFavorites((prev) => {
      if (prev.includes(currentQuote.text)) {
        return prev.filter((t) => t !== currentQuote.text)
      }
      return [...prev, currentQuote.text]
    })
  }, [currentQuote.text])

  // Share / Copy to clipboard
  const handleShare = useCallback(async () => {
    const shareText = `❝${currentQuote.text}❞\n— ${currentQuote.author}\n\n${currentQuote.category} | ${currentQuote.era}\nمنصة التحرير الكتابي والشفهي`

    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // ignore
      }
      document.body.removeChild(textArea)
    }
  }, [currentQuote])

  return (
    <Card
      className="gradient-border-animate overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      dir="rtl"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Gradient top bar */}
      <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-amber-500 to-teal-500" />

      <CardContent className="p-4 sm:p-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">📜</span>
            <h3 className="text-base sm:text-lg font-bold">اقتباس اليوم</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {currentIndex === dailyIndex && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[0.65rem]">
                اقتباس اليوم
              </Badge>
            )}
            <span className="text-xs text-muted-foreground tabular-nums font-medium">
              {toArabicNumeral(currentIndex + 1)}/{toArabicNumeral(30)}
            </span>
          </div>
        </div>

        {/* Quote content with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Large decorative quotation marks */}
            <div className="absolute -top-2 sm:-top-4 right-0 left-0 pointer-events-none select-none">
              <span className="text-6xl sm:text-8xl font-serif text-primary/8 leading-none absolute right-0 -top-4 sm:-top-8">❝</span>
              <span className="text-6xl sm:text-8xl font-serif text-primary/8 leading-none absolute left-0 bottom-0">❞</span>
            </div>

            {/* Quote text */}
            <div className="relative z-10 py-4 sm:py-8 px-2 sm:px-8">
              <p className="text-base sm:text-xl leading-loose sm:leading-loose font-medium text-foreground/90 text-center">
                {currentQuote.text}
              </p>
            </div>

            {/* Author + badges row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2 sm:mt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-primary font-bold text-sm sm:text-base">— {currentQuote.author}</span>
                <Badge className={`${categoryColors[currentQuote.category]} text-[0.7rem] sm:text-xs`}>
                  {currentQuote.category}
                </Badge>
                <Badge className={`${eraColors[currentQuote.era]} text-[0.7rem] sm:text-xs`}>
                  {currentQuote.era}
                </Badge>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls row */}
        <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-border/50">
          {/* Navigation arrows */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="h-9 w-9 rounded-full hover:bg-primary/10"
              aria-label="الاقتباس السابق"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-9 w-9 rounded-full hover:bg-primary/10"
              aria-label="الاقتباس التالي"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Favorite / Bookmark */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={`h-9 w-9 rounded-full ${isFavorite ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20' : 'hover:bg-primary/10'}`}
              aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              {isFavorite ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>

            {/* Heart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={`h-9 w-9 rounded-full ${isFavorite ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20' : 'hover:bg-primary/10'}`}
              aria-label={isFavorite ? 'إزالة الإعجاب' : 'أعجبني'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>

            {/* Share / Copy */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-9 w-9 rounded-full hover:bg-primary/10 relative"
              aria-label="نسخ الاقتباس"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Auto-rotate indicator */}
        <div className="flex items-center justify-center mt-2 gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isPaused ? 'bg-muted-foreground/30' : 'bg-primary animate-pulse'}`} />
          <span className="text-[0.65rem] text-muted-foreground">
            {isPaused ? 'متوقف' : 'تدوير تلقائي'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
