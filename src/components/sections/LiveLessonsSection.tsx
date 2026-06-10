'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { 
  Video, Calendar, Clock, Users, Radio, Plus, CheckCircle, 
  MessageSquare, Phone, Mail, User 
} from 'lucide-react'

interface LiveLesson {
  id: string
  title: string
  description: string
  scheduledAt: string
  duration: number
  isLive: boolean
  category: string
  instructor: string
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
  },
]

const liveLesson = {
  title: 'الإلقاء الإبداعي ومهارات العرض',
  description: 'بث مباشر حول تقنيات الإلقاء الإبداعي وكيفية تطوير مهارات العرض التقديمي',
  instructor: 'أ.د. محمد بن عبد الله',
  viewers: 127,
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

export default function LiveLessonsSection() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<LiveLesson | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string }[]>([
    { user: 'أحمد', message: 'السلام عليكم، درس مفيد جداً' },
    { user: 'فاطمة', message: 'هل يمكن شرح نقطة لغة الجسد بالتفصيل؟' },
    { user: 'الأستاذ', message: 'أهلاً وسهلاً، سنخصص وقتاً لذلك إن شاء الله' },
  ])
  const [newMessage, setNewMessage] = useState('')

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
    setChatMessages(prev => [...prev, { user: 'أنت', message: newMessage }])
    setNewMessage('')
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">دروس مباشرة</h2>
        <p className="text-muted-foreground">انضم إلى الدروس الحية وتفاعل مع الأساتذة مباشرة</p>
      </div>

      {/* Live Stream */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-l from-red-600 to-red-800 p-1">
          <div className="flex items-center justify-center gap-2 text-white text-sm font-medium py-1">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>بث مباشر الآن</span>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Video Area */}
            <div className="lg:col-span-2 bg-black/90 aspect-video flex items-center justify-center relative">
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">{liveLesson.title}</h3>
                <p className="text-white/70 text-sm mb-4">{liveLesson.description}</p>
                <Badge variant="destructive" className="gap-1">
                  <Radio className="h-3 w-3 animate-pulse" />
                  مباشر
                </Badge>
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="destructive" className="gap-1">
                  <Users className="h-3 w-3" />
                  {liveLesson.viewers} مشاهد
                </Badge>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="border-r border-border flex flex-col h-full min-h-[300px] lg:min-h-0">
              <div className="p-3 border-b border-border bg-muted/30">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  المحادثة المباشرة
                </h4>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[300px]">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium text-primary">{msg.user}: </span>
                    <span className="text-muted-foreground">{msg.message}</span>
                  </div>
                ))}
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
                  <Button size="icon" onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Lessons Schedule */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">جدول الدروس القادمة</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الدرس</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">التاريخ</TableHead>
                  <TableHead className="text-right hidden md:table-cell">الوقت</TableHead>
                  <TableHead className="text-right hidden md:table-cell">المدة</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">التصنيف</TableHead>
                  <TableHead className="text-right">التسجيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{formatDate(lesson.scheduledAt)}</div>
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
                    <TableCell>
                      <Dialog open={registerDialogOpen && selectedLesson?.id === lesson.id} onOpenChange={(open) => {
                        if (!open) { setRegisterDialogOpen(false); setSelectedLesson(null); setSubmitSuccess(false); }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => { setSelectedLesson(lesson); setRegisterDialogOpen(true); }}
                            className="gap-1"
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
                            <div className="flex flex-col items-center py-8 gap-3">
                              <CheckCircle className="h-16 w-16 text-emerald-500" />
                              <h3 className="text-lg font-bold">تم التسجيل بنجاح!</h3>
                              <p className="text-sm text-muted-foreground text-center">
                                سيتم إرسال رابط الدرس إلى بريدك الإلكتروني قبل الموعد المحدد
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-2 mb-2">
                                <p className="text-sm font-medium">{selectedLesson?.title}</p>
                                <p className="text-xs text-muted-foreground">{selectedLesson && formatDate(selectedLesson.scheduledAt)}</p>
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
                                >
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
    </div>
  )
}
