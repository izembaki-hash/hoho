'use client'

/**
 * Custom hook to estimate reading time for Arabic text.
 * Arabic reading speed: ~180 words per minute (slower than English due to RTL complexity)
 */

const ARABIC_WORDS_PER_MINUTE = 180

interface ReadingTimeResult {
  /** Estimated reading time in minutes (minimum 1 for non-empty text, 0 for empty) */
  minutes: number
  /** Total word count */
  words: number
  /** Display text in Arabic format */
  displayText: string
}

function getArabicReadingTimeDisplay(minutes: number): string {
  if (minutes === 0) return '0 دقائق قراءة'
  if (minutes === 1) return 'دقيقة قراءة'
  if (minutes === 2) return 'دقيقتان قراءة'
  if (minutes >= 3 && minutes <= 10) return `${minutes} دقائق قراءة`
  return `${minutes} دقيقة قراءة`
}

function countArabicWords(text: string): number {
  if (!text || !text.trim()) return 0
  
  // Remove extra whitespace and normalize
  const normalizedText = text.trim().replace(/\s+/g, ' ')
  
  // Split by spaces and filter out empty strings
  const words = normalizedText.split(' ').filter(word => word.length > 0)
  
  return words.length
}

export function useReadingTime(text: string): ReadingTimeResult {
  const words = countArabicWords(text)
  
  if (words === 0) {
    return { minutes: 0, words: 0, displayText: '0 دقائق قراءة' }
  }
  
  // Calculate minutes with ceiling, minimum 1 minute
  const minutes = Math.max(1, Math.ceil(words / ARABIC_WORDS_PER_MINUTE))
  const displayText = getArabicReadingTimeDisplay(minutes)
  
  return { minutes, words, displayText }
}

/**
 * Helper to estimate reading time from a word count directly.
 * Useful when you know the approximate word count but don't have the full text.
 */
export function useReadingTimeFromWordCount(wordCount: number): ReadingTimeResult {
  if (wordCount <= 0) {
    return { minutes: 0, words: 0, displayText: '0 دقائق قراءة' }
  }
  
  const minutes = Math.max(1, Math.ceil(wordCount / ARABIC_WORDS_PER_MINUTE))
  const displayText = getArabicReadingTimeDisplay(minutes)
  
  return { minutes, words: wordCount, displayText }
}
