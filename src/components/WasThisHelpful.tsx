'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Check, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface WasThisHelpfulProps {
  sectionId: string
  title: string
}

export default function WasThisHelpful({ sectionId, title }: WasThisHelpfulProps) {
  const [feedback, setFeedback] = useState<'none' | 'helpful' | 'not-helpful'>('none')
  const [showThanks, setShowThanks] = useState(false)

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type)
    setShowThanks(true)
    // Save to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('alta7reer-feedback') || '{}')
      stored[sectionId] = { title, feedback: type, timestamp: Date.now() }
      localStorage.setItem('alta7reer-feedback', JSON.stringify(stored))
    } catch {}
    setTimeout(() => setShowThanks(false), 3000)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageCircle className="h-4 w-4" />
        <span>هل استفدت من هذا المحتوى؟</span>
      </div>
      <div className="flex items-center gap-2">
        {feedback === 'none' ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback('helpful')}
              className="gap-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-all"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              نعم، مفيد
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback('not-helpful')}
              className="gap-1.5 text-xs hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 dark:hover:bg-amber-950/30 dark:hover:text-amber-400 transition-all"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              يحتاج تحسين
            </Button>
          </>
        ) : (
          <AnimatePresence>
            {showThanks && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs"
              >
                <Check className={`h-4 w-4 ${feedback === 'helpful' ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className={feedback === 'helpful' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                  {feedback === 'helpful' ? 'شكراً لردك الإيجابي!' : 'شكراً لملاحظتك، سنعمل على التحسين!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
