'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TypingEffectProps {
  /** Array of strings to type and delete, cycling through them */
  texts: string[]
  /** Speed in ms per character when typing (default: 80) */
  speed?: number
  /** Speed in ms per character when deleting (default: 40) */
  deleteSpeed?: number
  /** Duration in ms to pause between strings (default: 2000) */
  pauseDuration?: number
  /** Additional CSS classes */
  className?: string
}

export default function TypingEffect({
  texts,
  speed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  className = '',
}: TypingEffectProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const currentFullText = texts[currentIndex] || ''

  const tick = useCallback(() => {
    if (isPaused) return

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentFullText.length) {
        setDisplayText(currentFullText.slice(0, displayText.length + 1))
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true)
        setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % texts.length)
      }
    }
  }, [displayText, isDeleting, isPaused, currentFullText, pauseDuration, texts.length])

  useEffect(() => {
    const intervalSpeed = isDeleting ? deleteSpeed : speed
    const timer = setTimeout(tick, intervalSpeed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting, deleteSpeed, speed])

  return (
    <span className={`inline-flex items-center ${className}`} dir="rtl">
      <span>{displayText}</span>
      <AnimatePresence>
        <motion.span
          className="inline-block text-emerald-400 font-light mr-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          |
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
