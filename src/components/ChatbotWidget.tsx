'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, X, Send, Trash2, Bot, User, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'مرحباً! أنا المساعد الذكي لمنصة التحرير الكتابي والشفهي. يمكنني مساعدتك في أسئلتك حول التعبير الكتابي والشفهي. كيف يمكنني مساعدتك؟',
  timestamp: new Date(),
}

const SUGGESTED_QUESTIONS = [
  'ما هو التعبير الشفهي؟',
  'كيف أكتب مقالاً جيداً؟',
  'نصائح للإلقاء الفعّال',
  'ما هي علامات الترقيم؟',
]

const MAX_CHAR_LIMIT = 500

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-muted/80 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="block w-2 h-2 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="block w-2 h-2 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.span
            className="block w-2 h-2 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if user has interacted before
  useEffect(() => {
    try {
      const interacted = localStorage.getItem('chatbot-interacted')
      if (interacted) {
        setHasInteracted(true)
      }
    } catch {}
  }, [])

  // Mark as interacted when chat opens
  const markInteracted = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true)
      try {
        localStorage.setItem('chatbot-interacted', 'true')
      } catch {}
    }
  }, [hasInteracted])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return
      if (trimmed.length > MAX_CHAR_LIMIT) return

      markInteracted()
      setError(null)

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue('')
      setIsLoading(true)

      try {
        // Build history from previous messages (last 10)
        const history = messages
          .filter((m) => m.id !== 'welcome')
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }))

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            error: 'حدث خطأ غير متوقع',
          }))
          throw new Error(errorData.error || 'فشل في الحصول على رد')
        }

        const data = await response.json()

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.message || 'عذراً، لم أتمكن من معالجة طلبك.',
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
        setError(errorMessage)

        // Add error as assistant message
        const errorMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: `⚠️ ${errorMessage}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages, markInteracted]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      sendMessage(inputValue)
    },
    [inputValue, sendMessage]
  )

  const handleSuggestedQuestion = useCallback(
    (question: string) => {
      sendMessage(question)
    },
    [sendMessage]
  )

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setError(null)
  }, [])

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
    markInteracted()
  }, [markInteracted])

  const charCount = inputValue.length
  const isOverLimit = charCount > MAX_CHAR_LIMIT

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 sm:bottom-36 left-3 sm:left-6 z-50 flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
            style={{
              width: 'min(380px, calc(100vw - 1.5rem))',
              height: 'min(500px, calc(100vh - 160px))',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">المساعد الذكي</h3>
                  <p className="text-[10px] opacity-80">مساعدك في التحرير الكتابي والشفهي</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  aria-label="مسح المحادثة"
                  title="مسح المحادثة"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  aria-label="إغلاق المحادثة"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" dir="rtl">
              <div className="space-y-1">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-start gap-2 mb-4 ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tl-sm'
                          : 'bg-muted/80 text-foreground rounded-tr-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isLoading && <TypingIndicator />}

                {/* Error message */}
                <AnimatePresence>
                  {error && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-2"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions - show only at start */}
              {messages.length <= 1 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 pt-3 border-t border-border/50"
                >
                  <p className="text-xs text-muted-foreground mb-2">أسئلة مقترحة:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border/50 p-3 bg-card/80 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  disabled={isLoading}
                  maxLength={MAX_CHAR_LIMIT}
                  className="flex-1 h-10 text-sm rounded-full border-border/50 bg-background/50 focus-visible:ring-primary/30"
                  dir="rtl"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading || isOverLimit}
                  className="h-10 w-10 rounded-full shrink-0"
                  aria-label="إرسال"
                >
                  <Send className="h-4 w-4 rotate-180" />
                </Button>
              </form>
              {/* Character counter */}
              {charCount > 0 && (
                <div className="flex justify-between mt-1.5 px-1">
                  <span
                    className={`text-[10px] ${
                      isOverLimit
                        ? 'text-destructive font-medium'
                        : charCount > MAX_CHAR_LIMIT * 0.8
                          ? 'text-amber-500'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {charCount}/{MAX_CHAR_LIMIT}
                  </span>
                  {isOverLimit && (
                    <span className="text-[10px] text-destructive">تجاوزت الحد المسموح</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button - positioned above ContentReader (bottom-6 left-6) */}
      <div className="fixed bottom-20 left-6 z-50 flex flex-col items-start gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative"
            >
              {/* Pulse ring for first-time visitors */}
              {!hasInteracted && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              <Button
                onClick={toggleChat}
                size="icon"
                className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-primary text-primary-foreground relative"
                aria-label="فتح المحادثة مع المساعد الذكي"
              >
                <MessageCircle className="h-6 w-6" />
                {!hasInteracted && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[9px] bg-amber-500 text-white border-2 border-card">
                    1
                  </Badge>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
