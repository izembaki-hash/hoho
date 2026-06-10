'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Play, Pause, Square, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused'

interface ContentReaderProps {
  content: string
}

export default function ContentReader({ content }: ContentReaderProps) {
  const [playerState, setPlayerState] = useState<PlayerState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
        audioUrlRef.current = null
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  const startProgressTracking = useCallback(() => {
    clearProgressInterval()
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const currentProgress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        setProgress(currentProgress)
      }
    }, 200)
  }, [clearProgressInterval])

  const handlePlay = useCallback(async () => {
    if (!content?.trim()) return

    setError(null)

    // If we already have audio loaded, just resume
    if (audioRef.current && playerState === 'paused') {
      audioRef.current.play()
      setPlayerState('playing')
      startProgressTracking()
      return
    }

    // Generate new audio
    setPlayerState('loading')

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'حدث خطأ غير متوقع' }))
        throw new Error(errorData.error || 'فشل في إنشاء الصوت')
      }

      const audioBlob = await response.blob()

      // Clean up previous audio
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setPlayerState('idle')
        setProgress(0)
        clearProgressInterval()
      }

      audio.onerror = () => {
        setError('فشل في تشغيل الصوت')
        setPlayerState('idle')
        setProgress(0)
        clearProgressInterval()
      }

      await audio.play()
      setPlayerState('playing')
      startProgressTracking()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
      setPlayerState('idle')
    }
  }, [content, playerState, startProgressTracking, clearProgressInterval])

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setPlayerState('paused')
      clearProgressInterval()
    }
  }, [clearProgressInterval])

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlayerState('idle')
    setProgress(0)
    clearProgressInterval()
  }, [clearProgressInterval])

  const handleDismissError = useCallback(() => {
    setError(null)
  }, [])

  // Don't render if there's no content
  if (!content?.trim()) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg text-sm max-w-[280px] flex items-center gap-2"
          >
            <VolumeX className="h-4 w-4 shrink-0" />
            <span className="line-clamp-2">{error}</span>
            <button
              onClick={handleDismissError}
              className="shrink-0 hover:opacity-70 transition-opacity mr-1"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini audio player - shown when playing or paused */}
      <AnimatePresence>
        {(playerState === 'playing' || playerState === 'paused') && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl shadow-xl p-3 flex flex-col gap-2 min-w-[220px] max-w-[280px]"
          >
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-primary/10"
                onClick={playerState === 'playing' ? handlePause : handlePlay}
                aria-label={playerState === 'playing' ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {playerState === 'playing' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-destructive/10"
                onClick={handleStop}
                aria-label="إيقاف"
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Status text */}
            <p className="text-[11px] text-muted-foreground text-center">
              {playerState === 'playing' ? 'جاري القراءة...' : 'إيقاف مؤقت'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {playerState === 'loading' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl shadow-xl p-4 flex flex-col items-center gap-2 min-w-[160px]"
          >
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground">جاري إنشاء الصوت...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating circular button - shown when idle */}
      <AnimatePresence>
        {playerState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handlePlay}
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-primary text-primary-foreground"
              aria-label="استمع إلى المحتوى"
            >
              <Volume2 className="h-5 w-5" />
              <span className="sr-only">استمع إلى المحتوى</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
