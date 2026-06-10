'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check, Copy, Twitter, MessageCircle, Send, Facebook } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ShareSystemProps {
  sectionTitle: string
  sectionId?: string
}

const SHARE_STORAGE_KEY = 'alta7reer-share-toast'

export default function ShareSystem({ sectionTitle, sectionId }: ShareSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    const base = window.location.origin + window.location.pathname
    return sectionId ? `${base}#${sectionId}` : base
  }, [sectionId])

  const shareText = `اطلع على ${sectionTitle} على منصة التحرير الكتابي والشفهي`

  const handleCopyLink = useCallback(async () => {
    const url = getShareUrl()
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    setShowToast(true)
    setTimeout(() => {
      setCopied(false)
      setShowToast(false)
    }, 2000)
  }, [getShareUrl])

  const handleShare = useCallback((platform: 'twitter' | 'whatsapp' | 'telegram' | 'facebook') => {
    const url = getShareUrl()
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(url)

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    }

    window.open(urls[platform], '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }, [getShareUrl, shareText])

  const shareOptions = [
    {
      id: 'copy' as const,
      label: 'نسخ الرابط',
      icon: copied ? Check : Copy,
      color: copied ? 'text-emerald-500' : 'text-muted-foreground',
      hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
      onClick: handleCopyLink,
    },
    {
      id: 'twitter' as const,
      label: 'تويتر / X',
      icon: Twitter,
      color: 'text-sky-500',
      hoverBg: 'hover:bg-sky-50 dark:hover:bg-sky-950/30',
      onClick: () => handleShare('twitter'),
    },
    {
      id: 'whatsapp' as const,
      label: 'واتساب',
      icon: MessageCircle,
      color: 'text-emerald-600',
      hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
      onClick: () => handleShare('whatsapp'),
    },
    {
      id: 'telegram' as const,
      label: 'تيليجرام',
      icon: Send,
      color: 'text-blue-500',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
      onClick: () => handleShare('telegram'),
    },
    {
      id: 'facebook' as const,
      label: 'فيسبوك',
      icon: Facebook,
      color: 'text-blue-700 dark:text-blue-400',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
      onClick: () => handleShare('facebook'),
    },
  ]

  return (
    <div ref={containerRef} className="relative" dir="rtl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">مشاركة</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 mt-2 z-50 min-w-[200px] rounded-xl border border-border bg-background shadow-lg overflow-hidden"
            >
              <div className="p-1.5">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/50 mb-1">
                  مشاركة &quot;{sectionTitle}&quot;
                </div>
                {shareOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.id}
                      onClick={option.onClick}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${option.hoverBg}`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${option.color}`} />
                      <span className="flex-1 text-right">{option.label}</span>
                      {option.id === 'copy' && copied && (
                        <span className="text-[10px] text-emerald-500 font-medium">تم النسخ ✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full left-1/2 mt-2 z-50 whitespace-nowrap bg-emerald-600 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-lg"
          >
            تم النسخ ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
