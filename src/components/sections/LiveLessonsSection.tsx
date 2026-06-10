'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppStore } from '@/lib/store'
import SectionHeader from '@/components/SectionHeader'
import ShareButton from '@/components/ShareButton'
import { 
  Video, Calendar, Clock, Users, Radio, Plus, CheckCircle, 
  MessageSquare, Phone, Mail, User, Bookmark, BookmarkCheck,
  Send, AlertCircle, Eye, Timer, UsersRound, Zap, CircleDot
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LiveLesson {
  id: string
  title: string
  description: string
  scheduledAt: string
  duration: number
  isLive: boolean
  category: string
  instructor: string
  participants?: number
}

const sampleLessons: LiveLesson[] = [
  {
    id: '1',
    title: 'أساسيات التعبير الشفهي',
    description: 'درس تفاعلي حول أسس ومبادئ التعبير الشفهي الفعّال',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    duration: 90,
    isLive: false,
    category: 'شفهي',
    instructor: 'أ.د. محمد بن عبد الله',
    participants: 45,
  },
  {
    id: '2',
    title: 'فن الخطابة والإقناع',
    description: 'تعلم تقنيات الخطابة المؤثرة وأساليب الإقناع',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    duration: 60,
    isLive: false,
    category: 'شفهي',
    instructor: 'أ.د. محمد بن عبد الله',
    participants: 32,
  },
  {
    id: '3',
    title: 'كتابة المقال الأكاديمي',
    description: 'دليل شامل لكتابة المقال الأكاديمي وفق المنهجية العلمية',
    scheduledAt: new Date(Date.now() + 259200000).toISOString(),
    duration: 120,
    isLive: false,
    category: 'كتابي',
    instructor: 'أ.د. محمد بن عبد الله',
    participants: 58,
  },
  {
    id: '4',
    title: 'الرسائل الإدارية والمهنية',
    description: 'فنون كتابة المراسلات الإدارية والرسائل المهنية',
    scheduledAt: new Date(Date.now() + 345600000).toISOString(),
    duration: 90,
    isLive: false,
    category: 'كتابي',
    instructor: 'أ.د. محمد بن عبد الله',
    participants: 27,
  },
  {
    id: '5',
    title: 'علامات الترقيم واستخداماتها',
    description: 'القواعد الكاملة لعلامات الترقيم في الكتابة العربية',
    scheduledAt: new Date(Date.now() + 432000000).toISOString(),
    duration: 60,
    isLive: false,
    category: 'كتابي',
    instructor: 'أ.د. محمد بن عبد الله',
    participants: 41,
  },
]

const liveLesson = {
  title: 'الإلقاء الإبداعي ومهارات العرض',
  description: 'بث مباشر حول تقنيات الإلقاء الإبداعي وكيفية تطوير مهارات العرض التقديمي',
  instructor: 'أ.د. محمد بن عبد الله',
  viewers: 127,
  participants: 89,
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ar-SA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('ar-SA', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function getDaysUntil(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'اليوم'
  if (diff === 1) return 'غداً'
  return `بعد ${diff} أيام`
}

// Countdown timer component for next lesson
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const diff = target - now
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }
      
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    
    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex items-center gap-1.5">
      <Timer className="h-4 w-4 text-amber-500" />
      <div className="flex items-center gap-1 font-mono text-sm">
        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold min-w-[28px] text-center">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-amber-500 font-bold">:</span>
        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold min-w-[28px] text-center">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-amber-500 font-bold">:</span>
        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold min-w-[28px] text-center">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-muted rounded-xl rounded-bl-none max-w-fit">
      <span className="text-xs text-muted-foreground ml-1">الأستاذ يكتب</span>
      <div className="flex items-center gap-0.5">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  )
}

export default function LiveLessonsSection() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<LiveLesson | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { bookmarks, toggleBookmark, isBookmarked } = useAppStore()
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string; time?: string }[]>([
    { user: 'أحمد', message: 'السلام عليكم، درس مفيد جداً', time: '14:32' },
    { user: 'فاطمة', message: 'هل يمكن شرح نقطة لغة الجسد بالتفصيل؟', time: '14:33' },
    { user: 'الأستاذ', message: 'أهلاً وسهلاً، سنخصص وقتاً لذلك إن شاء الله', time: '14:34' },
    { user: 'يوسف', message: 'شكراً أستاذ، هل هناك تمارين تطبيقية؟', time: '14:35' },
    { user: 'سارة', message: 'أنا مهتمة أيضاً بالتمارين العملية 📝', time: '14:36' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showTyping, setShowTyping] = useState(false)
  const [onlineCount, setOnlineCount] = useState(127)

  // Simulate online count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Show typing indicator briefly after sending a message
  useEffect(() => {
    if (chatMessages.length > 5 && chatMessages[chatMessages.length - 1].user === 'أنت') {
      setShowTyping(true)
      const timer = setTimeout(() => {
        setShowTyping(false)
        const responses = [
          'شكراً لمشاركتك! سأكون سعيداً بالإجابة على أسئلتك.',
          'سؤال مهم! دعني أوضح لك هذه النقطة.',
          'ممتاز! هذا يدل على فهمك العميق للموضوع.',
          'أشكرك على تفاعلك، سنناقش هذا بالتفصيل.',
        ]
        setChatMessages(prev => [...prev, { 
          user: 'الأستاذ', 
          message: responses[Math.floor(Math.random() * responses.length)],
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        }])
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [chatMessages.length])

  const handleRegister = async () => {
    if (!selectedLesson || !formData.name || !formData.email) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/register-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lessonId: selectedLesson.id,
        }),
      })
      if (res.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setSubmitSuccess(false)
          setRegisterDialogOpen(false)
          setFormData({ name: '', email: '', phone: '' })
        }, 2000)
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setChatMessages(prev => [...prev, { 
      user: 'أنت', 
      message: newMessage,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }])
    setNewMessage('')
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <SectionHeader
        title="دروس مباشرة"
        description="انضم إلى الدروس الحية وتفاعل مع الأساتذة مباشرة"
        icon={<Video className="h-9 w-9" />}
        gradient="from-red-500 to-red-700"
        shareTitle="دروس مباشرة - التحرير الكتابي والشفهي"
      />

      {/* Live Now Indicator + Next Lesson Countdown */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          {/* Live Now Badge */}
          <Card className="border-0 shadow-md flex-1 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-red-500 absolute top-0 left-0 animate-ping" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600 dark:text-red-400">بث مباشر الآن</span>
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 animate-pulse">
                      <Radio className="h-2.5 w-2.5 ml-0.5" />
                      LIVE
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{liveLesson.title}</p>
                </div>
                <div className="mr-auto flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <UsersRound className="h-3.5 w-3.5 text-red-500" />
                    <span className="font-bold text-red-600 dark:text-red-400">{onlineCount}</span>
                    <span>مشاهد</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Countdown to Next Lesson */}
          <Card className="border-0 shadow-md flex-1 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-sm">الدرس القادم</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{sampleLessons[0].title}</p>
                </div>
                <CountdownTimer targetDate={sampleLessons[0].scheduledAt} />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Live Stream with Glowing Border */}
      <motion.div variants={itemVariants}>
        <div className="animate-glow-pulse rounded-2xl" style={{ '--glow-color': 'rgba(239, 68, 68, 0.4)' } as React.CSSProperties}>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-l from-red-600 to-red-800 p-1.5">
              <div className="flex items-center justify-between text-white text-sm font-medium px-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <CircleDot className="h-4 w-4 animate-pulse" />
                  </div>
                  <span>بث مباشر الآن</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3" />
                    {liveLesson.participants} مشارك
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Eye className="h-3 w-3" />
                    {onlineCount} مشاهد
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Video Area */}
                <div className="lg:col-span-2 bg-gradient-to-bl from-gray-900 to-black aspect-video flex items-center justify-center relative">
                  {/* Decorative grid */}
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="text-center text-white relative z-10">
                    <div className="w-20 h-20 rounded-full bg-red-600/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Video className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{liveLesson.title}</h3>
                    <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">{liveLesson.description}</p>
                    <div className="flex items-center justify-center gap-3">
                      <Badge variant="destructive" className="gap-1 animate-pulse">
                        <Radio className="h-3 w-3" />
                        مباشر
                      </Badge>
                      <span className="text-white/50 text-sm">{liveLesson.instructor}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Badge variant="destructive" className="gap-1 bg-red-600">
                      <Eye className="h-3 w-3" />
                      {onlineCount} مشاهد
                    </Badge>
                  </div>
                </div>
                
                {/* Chat Area */}
                <div className="border-r border-border flex flex-col h-full min-h-[300px] lg:min-h-0 bg-muted/20">
                  <div className="p-3 border-b border-border bg-muted/50 flex items-center justify-between">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      المحادثة المباشرة
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{chatMessages.length} رسالة</Badge>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-muted-foreground">{liveLesson.participants} متصل</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px] custom-scrollbar">
                    <AnimatePresence initial={false}>
                      {chatMessages.map((msg, idx) => (
                        <motion.div
                          key={`${msg.user}-${idx}`}
                          initial={{ opacity: 0, x: 20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="text-sm"
                        >
                          <div className={`inline-block max-w-[85%] rounded-xl px-3 py-2 ${
                            msg.user === 'أنت' 
                              ? 'bg-primary text-primary-foreground rounded-br-none' 
                              : msg.user === 'الأستاذ'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-foreground rounded-bl-none border border-emerald-200 dark:border-emerald-800'
                              : 'bg-muted rounded-bl-none'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`font-medium text-xs ${
                                msg.user === 'أنت' ? 'text-primary-foreground/70' 
                                : msg.user === 'الأستاذ' ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-primary'
                              }`}>{msg.user}</span>
                              {msg.time && (
                                <span className={`text-[9px] ${
                                  msg.user === 'أنت' ? 'text-primary-foreground/50' : 'text-muted-foreground/50'
                                }`}>{msg.time}</span>
                              )}
                            </div>
                            <span>{msg.message}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {/* Typing indicator */}
                    {showTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <TypingIndicator />
                      </motion.div>
                    )}
                  </div>
                  <div className="p-3 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        className="text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button size="icon" onClick={handleSendMessage} className="shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Upcoming Lessons Schedule */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-l from-primary via-amber-500 to-primary" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">جدول الدروس القادمة</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{sampleLessons.length} درس قادم</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {bookmarks.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <BookmarkCheck className="h-3 w-3" />
                    {bookmarks.length} محفوظ
                  </Badge>
                )}
                <ShareButton title="جدول الدروس المباشرة" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-right font-bold">الدرس</TableHead>
                    <TableHead className="text-right hidden sm:table-cell font-bold">التاريخ</TableHead>
                    <TableHead className="text-right hidden md:table-cell font-bold">الوقت</TableHead>
                    <TableHead className="text-right hidden md:table-cell font-bold">المدة</TableHead>
                    <TableHead className="text-right hidden lg:table-cell font-bold">التصنيف</TableHead>
                    <TableHead className="text-right hidden lg:table-cell font-bold">موعد</TableHead>
                    <TableHead className="text-right hidden lg:table-cell font-bold">المشاركون</TableHead>
                    <TableHead className="text-right font-bold">التسجيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleLessons.map((lesson, idx) => (
                    <TableRow key={lesson.id} className={`group ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-primary/5 transition-colors`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(lesson.id)}
                            className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                            title={isBookmarked(lesson.id) ? 'إزالة من المحفوظات' : 'حفظ الدرس'}
                          >
                            {isBookmarked(lesson.id) ? (
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </button>
                          <div>
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">{formatDate(lesson.scheduledAt)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{formatDate(lesson.scheduledAt)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{formatTime(lesson.scheduledAt)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{lesson.duration} دقيقة</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={lesson.category === 'شفهي' ? 'default' : 'secondary'}>
                          {lesson.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          {getDaysUntil(lesson.scheduledAt)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {lesson.participants || 0} مسجل
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog open={registerDialogOpen && selectedLesson?.id === lesson.id} onOpenChange={(open) => {
                          if (!open) { setRegisterDialogOpen(false); setSelectedLesson(null); setSubmitSuccess(false); }
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => { setSelectedLesson(lesson); setRegisterDialogOpen(true); }}
                              className="gap-1 hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                              <Plus className="h-3 w-3" />
                              انضمام
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>التسجيل في الدرس</DialogTitle>
                            </DialogHeader>
                            {submitSuccess ? (
                              <motion.div 
                                className="flex flex-col items-center py-8 gap-3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                              >
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.1 }}
                                  className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
                                >
                                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                                </motion.div>
                                <motion.h3 
                                  className="text-xl font-bold text-emerald-700 dark:text-emerald-400"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  تم التسجيل بنجاح!
                                </motion.h3>
                                <motion.p 
                                  className="text-sm text-muted-foreground text-center"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  سيتم إرسال رابط الدرس إلى بريدك الإلكتروني قبل الموعد المحدد
                                </motion.p>
                                {/* Confetti-like dots */}
                                <motion.div 
                                  className="flex gap-2 mt-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.7 }}
                                >
                                  {['bg-emerald-400', 'bg-amber-400', 'bg-primary', 'bg-teal-400', 'bg-red-400'].map((color, i) => (
                                    <motion.div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${color}`}
                                      initial={{ y: 0 }}
                                      animate={{ y: [-5, 5, -3, 0] }}
                                      transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                                    />
                                  ))}
                                </motion.div>
                              </motion.div>
                            ) : (
                              <>
                                <div className="p-4 rounded-xl bg-gradient-to-l from-primary/5 to-emerald-50 dark:from-primary/10 dark:to-emerald-950/30 border border-primary/10 mb-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-bold">{selectedLesson?.title}</p>
                                  </div>
                                  <div className="flex items-center gap-3 mr-6 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {selectedLesson && formatDate(selectedLesson.scheduledAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {selectedLesson?.duration} دقيقة
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="reg-name" className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      الاسم الكامل
                                    </Label>
                                    <Input
                                      id="reg-name"
                                      value={formData.name}
                                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="أدخل اسمك الكامل"
                                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="reg-email" className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      البريد الإلكتروني
                                    </Label>
                                    <Input
                                      id="reg-email"
                                      type="email"
                                      value={formData.email}
                                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                      placeholder="example@email.com"
                                      dir="ltr"
                                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="reg-phone" className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      رقم الهاتف (اختياري)
                                    </Label>
                                    <Input
                                      id="reg-phone"
                                      value={formData.phone}
                                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                      placeholder="+213 XXX XXX XXX"
                                      dir="ltr"
                                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                                  <DialogClose asChild>
                                    <Button variant="outline">إلغاء</Button>
                                  </DialogClose>
                                  <Button 
                                    onClick={handleRegister} 
                                    disabled={isSubmitting || !formData.name || !formData.email}
                                    className="gap-2 bg-gradient-to-l from-primary to-emerald-700 hover:from-primary/90 hover:to-emerald-700/90"
                                  >
                                    {isSubmitting ? (
                                      <span className="animate-spin">⏳</span>
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                    {isSubmitting ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
