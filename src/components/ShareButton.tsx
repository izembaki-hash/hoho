'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check, Copy, Twitter, MessageCircle } from 'lucide-react'

interface ShareButtonProps {
  title: string
  text?: string
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareText = text || `${title} - التحرير الكتابي والشفهي`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
  }

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-1.5 text-xs"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'تم النسخ' : 'نسخ الرابط'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsApp}
        className="gap-1.5 text-xs"
      >
        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
        واتساب
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitter}
        className="gap-1.5 text-xs"
      >
        <Twitter className="h-3.5 w-3.5 text-sky-500" />
        تويتر
      </Button>
    </div>
  )
}
