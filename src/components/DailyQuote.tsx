'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Quote, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const quotes = [
  {
    text: 'مَن جَدّ في طلب العِلمِ ظَفِرَ بمَرامِهِ، ومَن زَلّ عن سَبيلِ الحَقِّ شَقِيَ في المَقامِ',
    author: 'ابن خلدون',
  },
  {
    text: 'خيرُ جليسٍ في الزمانِ كتابُ، فحُسنٌ صُحبتُهُ وزِيادَةُ مَزَارِهِ',
    author: 'المتنبي',
  },
  {
    text: 'العِلمُ نورٌ، والجَهلُ ظَلامٌ، والقَلمُ سَيفٌ لا يَنْبُو',
    author: 'حكمة عربية',
  },
  {
    text: 'اقرأ كثيراً، واكتب كثيراً، وتعلّم دائماً؛ فالعِلمُ كَنزٌ لا يَفنى',
    author: 'أحمد شوقي',
  },
  {
    text: 'اللغةُ العربيةُ كالبَحرِ، كُلّما غُصتَ فيها وجَدتَ دُرَراً ومرجاناً',
    author: 'طه حسين',
  },
  {
    text: 'لا يَستقيمُ ظِلّ الغُصنِ والعودُ مُعوَجٌّ، وكذا الكَلامُ لا يَجمُلُ بلا إعرابٍ',
    author: 'سيبويه',
  },
  {
    text: 'مَن أرادَ أن يُتقِنَ الكتابةَ، فليُكثِرِ القراءةَ، ومَن أرادَ أن يُتقِنَ الحديثَ، فليُكثِرِ الاستماعَ',
    author: 'الجاحظ',
  },
  {
    text: 'البلاغةُ إيجازٌ في غيرِ إخلالٍ، وإطنابٌ في غيرِ إملالٍ',
    author: 'عبد القاهر الجرجاني',
  },
]

export default function DailyQuote() {
  const [quoteIndex, setQuoteIndex] = useState(() => {
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    return dayOfYear % quotes.length
  })
  const [isAnimating, setIsAnimating] = useState(false)

  const handleRefresh = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
      setIsAnimating(false)
    }, 300)
  }

  const currentQuote = quotes[quoteIndex]

  return (
    <Card className="border-0 shadow-md overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-bl from-amber-50 via-transparent to-emerald-50 dark:from-amber-950/20 dark:via-transparent dark:to-emerald-950/20" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-bl from-amber-500 to-amber-700 flex items-center justify-center text-white shrink-0 shadow-lg">
            <Quote className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400">حكمة اليوم</h3>
              <button
                onClick={handleRefresh}
                className="p-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                title="حكمة أخرى"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-amber-600 dark:text-amber-400 transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-foreground leading-relaxed text-sm mb-2 italic">
                  &laquo;{currentQuote.text}&raquo;
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  — {currentQuote.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
