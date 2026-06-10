'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mic, Pen, Type, Megaphone, FileText, Mail, User,
  Plus, Trash2, CalendarDays, StickyNote, BookOpenCheck,
  Clock, Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Module-level constants ──────────────────────────────────────
const PLANNER_KEY = 'alta7reer-study-planner'
const NOTES_KEY = 'alta7reer-quick-notes'
const MAX_NOTES_LENGTH = 1000

const arabicDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']

// ─── Subject definitions ─────────────────────────────────────────
const subjects = [
  {
    id: 'oral',
    label: 'التحرير الشفهي',
    icon: Mic,
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-700 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-700',
    dot: 'bg-emerald-500',
  },
  {
    id: 'written',
    label: 'التحرير الكتابي',
    icon: Pen,
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-700 dark:text-amber-400',
    gradient: 'from-amber-500 to-amber-700',
    dot: 'bg-amber-500',
  },
  {
    id: 'punctuation',
    label: 'علامات الترقيم',
    icon: Type,
    color: 'teal',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-300 dark:border-teal-700',
    text: 'text-teal-700 dark:text-teal-400',
    gradient: 'from-teal-500 to-teal-700',
    dot: 'bg-teal-500',
  },
  {
    id: 'oratory',
    label: 'الخطابة',
    icon: Megaphone,
    color: 'red',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-700 dark:text-red-400',
    gradient: 'from-red-500 to-red-700',
    dot: 'bg-red-500',
  },
  {
    id: 'essay',
    label: 'المقال',
    icon: FileText,
    color: 'orange',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-700 dark:text-orange-400',
    gradient: 'from-orange-500 to-orange-700',
    dot: 'bg-orange-500',
  },
  {
    id: 'letters',
    label: 'الرسائل الإدارية',
    icon: Mail,
    color: 'sky',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-300 dark:border-sky-700',
    text: 'text-sky-700 dark:text-sky-400',
    gradient: 'from-sky-500 to-sky-700',
    dot: 'bg-sky-500',
  },
  {
    id: 'resume',
    label: 'السيرة الذاتية',
    icon: User,
    color: 'rose',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-300 dark:border-rose-700',
    text: 'text-rose-700 dark:text-rose-400',
    gradient: 'from-rose-500 to-rose-700',
    dot: 'bg-rose-500',
  },
] as const

// ─── Types ───────────────────────────────────────────────────────
interface StudySession {
  id: string
  subjectId: string
  dayIndex: number
  timeFrom: string
  timeTo: string
  notes: string
}

// ─── Helper: localStorage safe read ──────────────────────────────
function readPlannerData(): StudySession[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(PLANNER_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function readNotesData(): string {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem(NOTES_KEY) ?? ''
  } catch {
    return ''
  }
}

// ─── Main Component ──────────────────────────────────────────────
export default function StudyPlanner() {
  // Lazy initialization from localStorage (no useEffect+setState)
  const [sessions, setSessions] = useState<StudySession[]>(readPlannerData)
  const [notes, setNotes] = useState<string>(readNotesData)
  const [activeTab, setActiveTab] = useState('planner')

  // Form state for adding new session
  const [newSubject, setNewSubject] = useState('')
  const [newDay, setNewDay] = useState('0')
  const [newTimeFrom, setNewTimeFrom] = useState('08:00')
  const [newTimeTo, setNewTimeTo] = useState('09:00')
  const [newNotes, setNewNotes] = useState('')

  // Persist helpers
  const persistSessions = useCallback((updated: StudySession[]) => {
    setSessions(updated)
    try { localStorage.setItem(PLANNER_KEY, JSON.stringify(updated)) } catch { /* ignore */ }
  }, [])

  const persistNotes = useCallback((text: string) => {
    setNotes(text)
    try { localStorage.setItem(NOTES_KEY, text) } catch { /* ignore */ }
  }, [])

  // Add a new session
  const handleAddSession = useCallback(() => {
    if (!newSubject) return
    const newSession: StudySession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      subjectId: newSubject,
      dayIndex: Number(newDay),
      timeFrom: newTimeFrom,
      timeTo: newTimeTo,
      notes: newNotes.trim(),
    }
    const updated = [...sessions, newSession]
    persistSessions(updated)
    setNewNotes('')
  }, [newSubject, newDay, newTimeFrom, newTimeTo, newNotes, sessions, persistSessions])

  // Delete a session
  const handleDeleteSession = useCallback((id: string) => {
    const updated = sessions.filter(s => s.id !== id)
    persistSessions(updated)
  }, [sessions, persistSessions])

  // Notes handlers
  const handleNotesChange = useCallback((value: string) => {
    if (value.length <= MAX_NOTES_LENGTH) {
      persistNotes(value)
    }
  }, [persistNotes])

  const handleClearNotes = useCallback(() => {
    persistNotes('')
  }, [persistNotes])

  // Get sessions for a specific day
  const getSessionsForDay = useCallback((dayIndex: number) => {
    return sessions.filter(s => s.dayIndex === dayIndex)
  }, [sessions])

  // Get subject data by id
  const getSubject = useCallback((subjectId: string) => {
    return subjects.find(s => s.id === subjectId) ?? subjects[0]
  }, [])

  // Character count for notes
  const charCount = notes.length
  const charPercent = Math.round((charCount / MAX_NOTES_LENGTH) * 100)
  const charColor = charPercent > 90 ? 'text-red-500' : charPercent > 70 ? 'text-amber-500' : 'text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <Card className="gradient-border-animate border-0 shadow-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-amber-500 to-teal-500" />
        <CardContent className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-bl from-emerald-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">المخطط الدراسي والملاحظات</h3>
              <p className="text-xs text-muted-foreground">نظّم جلساتك الدراسية وسجّل ملاحظاتك الشخصية</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
            <TabsList className="w-full sm:w-auto mb-4">
              <TabsTrigger value="planner" className="gap-1.5 text-xs sm:text-sm">
                <CalendarDays className="h-3.5 w-3.5" />
                المخطط الأسبوعي
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-1.5 text-xs sm:text-sm">
                <StickyNote className="h-3.5 w-3.5" />
                ملاحظات سريعة
              </TabsTrigger>
            </TabsList>

            {/* ─── Planner Tab ──────────────────────────────────── */}
            <TabsContent value="planner">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left: Weekly schedule */}
                <div className="lg:col-span-2 space-y-3">
                  {/* Day columns */}
                  {arabicDays.map((day, dayIdx) => {
                    const daySessions = getSessionsForDay(dayIdx)
                    return (
                      <div key={dayIdx} className="rounded-xl border border-border/50 overflow-hidden">
                        {/* Day header */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border-b border-border/50">
                          <div className={`w-2 h-2 rounded-full ${daySessions.length > 0 ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                          <span className="text-sm font-bold">{day}</span>
                          {daySessions.length > 0 && (
                            <Badge variant="outline" className="text-[9px] h-4 mr-auto">
                              {daySessions.length} جلسة
                            </Badge>
                          )}
                        </div>

                        {/* Sessions for this day */}
                        <div className="p-2 min-h-[40px]">
                          <AnimatePresence mode="popLayout">
                            {daySessions.length === 0 ? (
                              <p className="text-[11px] text-muted-foreground/50 text-center py-1">
                                لا توجد جلسات دراسية
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {daySessions.map(session => {
                                  const subject = getSubject(session.subjectId)
                                  const SubjectIcon = subject.icon
                                  return (
                                    <motion.div
                                      key={session.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.2 }}
                                      className={`flex items-center gap-2 p-2.5 rounded-lg ${subject.bg} border ${subject.border} group relative`}
                                    >
                                      {/* Subject icon */}
                                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-bl ${subject.gradient} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                        <SubjectIcon className="h-4 w-4" />
                                      </div>

                                      {/* Session info */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className={`text-xs font-bold ${subject.text}`}>{subject.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-2.5 w-2.5" />
                                            {session.timeFrom} - {session.timeTo}
                                          </span>
                                        </div>
                                        {session.notes && (
                                          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{session.notes}</p>
                                        )}
                                      </div>

                                      {/* Delete button */}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                                        onClick={() => handleDeleteSession(session.id)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right: Add session form */}
                <div className="space-y-4">
                  <Card className="border border-border/50 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" />
                        إضافة جلسة دراسية
                      </h4>

                      {/* Subject select */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">المادة</label>
                        <Select value={newSubject} onValueChange={setNewSubject} dir="rtl">
                          <SelectTrigger className="w-full h-9 text-sm">
                            <SelectValue placeholder="اختر المادة" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(s => {
                              const SubIcon = s.icon
                              return (
                                <SelectItem key={s.id} value={s.id}>
                                  <div className="flex items-center gap-2">
                                    <SubIcon className={`h-3.5 w-3.5 ${s.text}`} />
                                    <span>{s.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Day select */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">اليوم</label>
                        <Select value={newDay} onValueChange={setNewDay} dir="rtl">
                          <SelectTrigger className="w-full h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {arabicDays.map((day, idx) => (
                              <SelectItem key={idx} value={String(idx)}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Time range */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">الوقت</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={newTimeFrom}
                            onChange={e => setNewTimeFrom(e.target.value)}
                            className="h-9 text-sm flex-1"
                          />
                          <span className="text-xs text-muted-foreground">إلى</span>
                          <Input
                            type="time"
                            value={newTimeTo}
                            onChange={e => setNewTimeTo(e.target.value)}
                            className="h-9 text-sm flex-1"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">ملاحظات (اختياري)</label>
                        <Input
                          value={newNotes}
                          onChange={e => setNewNotes(e.target.value)}
                          placeholder="أضف ملاحظة للجلسة..."
                          className="h-9 text-sm"
                          maxLength={100}
                        />
                      </div>

                      {/* Add button */}
                      <Button
                        className="w-full h-10 text-sm gap-2 rounded-xl"
                        disabled={!newSubject}
                        onClick={handleAddSession}
                      >
                        <Plus className="h-4 w-4" />
                        إضافة الجلسة
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Stats summary */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 p-3 text-center">
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{sessions.length}</span>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">جلسة دراسية</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 p-3 text-center">
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {new Set(sessions.map(s => s.subjectId)).size}
                      </span>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">مادة مختلفة</p>
                    </div>
                  </div>

                  {/* Empty state */}
                  {sessions.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center py-4 space-y-2"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
                        <Sparkles className="h-7 w-7 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">ابدأ بتخطيط أسبوعك الدراسي!</p>
                      <p className="text-[11px] text-muted-foreground/60">أضف جلساتك الدراسية لتنظيم وقتك بشكل أفضل</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ─── Notes Tab ────────────────────────────────────── */}
            <TabsContent value="notes">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Notes textarea */}
                <div className="lg:col-span-2 space-y-3">
                  <Textarea
                    value={notes}
                    onChange={e => handleNotesChange(e.target.value)}
                    placeholder="اكتب ملاحظاتك الدراسية هنا... يمكن أن تكون أفكاراً للدراسة، ملخصات، أو أي شيء تريد تذكره."
                    className="min-h-[240px] sm:min-h-[320px] resize-y text-sm leading-relaxed custom-scrollbar"
                    dir="rtl"
                    maxLength={MAX_NOTES_LENGTH}
                  />

                  {/* Character counter bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-medium ${charColor}`}>
                        {charCount} / {MAX_NOTES_LENGTH} حرف
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {MAX_NOTES_LENGTH - charCount} حرف متبقي
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full transition-colors duration-300 ${
                          charPercent > 90 ? 'bg-red-500' : charPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, charPercent)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs gap-1.5 rounded-lg"
                      onClick={handleClearNotes}
                      disabled={notes.length === 0}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      مسح
                    </Button>
                    <div className="flex-1" />
                    <Badge variant="outline" className="text-[10px] h-6 gap-1">
                      <StickyNote className="h-3 w-3" />
                      يُحفظ تلقائياً
                    </Badge>
                  </div>
                </div>

                {/* Notes sidebar */}
                <div className="space-y-4">
                  <Card className="border border-border/50 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <StickyNote className="h-4 w-4 text-primary" />
                        نصائح للملاحظات
                      </h4>
                      <div className="space-y-2">
                        {[
                          { icon: '📝', text: 'اكتب ملخصاً لكل درس تنتهي منه' },
                          { icon: '💡', text: 'سجّل الأفكار المهمة فوراً قبل نسيانها' },
                          { icon: '📋', text: 'استخدم الملاحظات لمراجعة المواد قبل الامتحانات' },
                          { icon: '🔗', text: 'اربط بين المفاهيم المختلفة لتسهيل الفهم' },
                          { icon: '⭐', text: 'حدّد النقاط الرئيسية بكلمات مفتاحية' },
                        ].map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-sm shrink-0">{tip.icon}</span>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick stats for notes */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/30 p-3 text-center">
                      <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                        {notes.length > 0 ? notes.split(/\s+/).filter(Boolean).length : 0}
                      </span>
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-0.5">كلمة</p>
                    </div>
                    <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-800/30 p-3 text-center">
                      <span className="text-xl font-bold text-sky-600 dark:text-sky-400">
                        {notes.length > 0 ? notes.split(/\n/).filter(Boolean).length : 0}
                      </span>
                      <p className="text-[10px] text-sky-600 dark:text-sky-400 mt-0.5">سطر</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
