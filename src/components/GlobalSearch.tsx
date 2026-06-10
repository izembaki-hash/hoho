'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppStore, type SectionId } from '@/lib/store'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, BookOpen, Video, Mic, Pen, User, Mail, 
  MessageSquare, GraduationCap, School, Users,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchItem {
  id: string
  title: string
  description: string
  section: SectionId
  category: string
  icon: React.ReactNode
}

const searchData: SearchItem[] = [
  // Oral Expression
  { id: 'oral-def', title: 'تعريف التعبير الشفهي', description: 'التعبير الشفهي هو القدرة على نقل الأفكار والمشاعر بطريقة منطقية ومقنعة', section: 'oral-expression', category: 'التحرير الشفهي', icon: <Mic className="h-4 w-4" /> },
  { id: 'oral-types', title: 'أنواع العرض الشفهي', description: 'تتنوع أشكال العرض الشفهي حسب الغاية والسياق التواصلي', section: 'oral-expression', category: 'التحرير الشفهي', icon: <Mic className="h-4 w-4" /> },
  { id: 'oral-skills', title: 'مهارات العرض الشفهي', description: 'مجموعة من المهارات الأساسية والفرعية لتقديم عرض شفهي ناجح', section: 'oral-expression', category: 'التحرير الشفهي', icon: <Mic className="h-4 w-4" /> },
  { id: 'oral-creative', title: 'الإلقاء الإبداعي', description: 'فن التعبير بأسلوب مبتكر وجذاب يخاطب العقل والوجدان', section: 'oral-expression', category: 'التحرير الشفهي', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'oral-body', title: 'لغة الجسد', description: 'المحاور غير اللفظية في التواصل من حركات وتعبيرات', section: 'oral-expression', category: 'التحرير الشفهي', icon: <Users className="h-4 w-4" /> },
  // Written Expression
  { id: 'writ-oratory', title: 'الخطابة', description: 'فن إقناع الجمهور من خلال الكلمة المنطوقة المبنية على حجج', section: 'written-expression', category: 'التحرير الكتابي', icon: <Mic className="h-4 w-4" /> },
  { id: 'writ-summary', title: 'التلخيص', description: 'استخراج الأفكار الرئيسية وإعادة صياغتها بأسلوب موجز', section: 'written-expression', category: 'التحرير الكتابي', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'writ-report', title: 'التقرير', description: 'وثيقة مكتوبة تقدم معلومات وحقائق حول موضوع محدد', section: 'written-expression', category: 'التحرير الكتابي', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'writ-text', title: 'بناء النص', description: 'تنظيم الأفكار والترابط بينها في نسق لغوي متماسك', section: 'written-expression', category: 'التحرير الكتابي', icon: <Pen className="h-4 w-4" /> },
  { id: 'writ-punct', title: 'علامات الترقيم', description: 'الرموز المستخدمة في الكتابة لتنظيم النص وتوضيح المعاني', section: 'written-expression', category: 'التحرير الكتابي', icon: <Pen className="h-4 w-4" /> },
  { id: 'writ-admin', title: 'الرسائل الإدارية', description: 'المراسلات الرسمية بين المؤسسات والأفراد', section: 'written-expression', category: 'التحرير الكتابي', icon: <Mail className="h-4 w-4" /> },
  { id: 'writ-cv', title: 'السيرة الذاتية', description: 'وثيقة تلخص المؤهلات والمهارات والخبرات المهنية', section: 'written-expression', category: 'التحرير الكتابي', icon: <User className="h-4 w-4" /> },
  { id: 'writ-essay', title: 'المقال', description: 'نص نثري يتناول موضوعاً بأسلوب حر يعرض فيه الكاتب رأيه', section: 'written-expression', category: 'التحرير الكتابي', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'writ-intervention', title: 'المداخلة', description: 'مساهمة شفهية أو كتابية في نقاش أو حوار جماعي', section: 'written-expression', category: 'التحرير الكتابي', icon: <MessageSquare className="h-4 w-4" /> },
  // Live & Recorded
  { id: 'live-lessons', title: 'دروس مباشرة', description: 'بث حي للدروس مع إمكانية التفاعل والأسئلة', section: 'live-lessons', category: 'دروس', icon: <Video className="h-4 w-4" /> },
  { id: 'recorded-lessons', title: 'دروس مسجلة', description: 'مكتبة شاملة للدروس المسجلة مع مرفقات تعليمية', section: 'recorded-lessons', category: 'دروس', icon: <BookOpen className="h-4 w-4" /> },
  // Other
  { id: 'about', title: 'نبذة عن المؤلف', description: 'السيرة الذاتية والمؤلفات والمسيرة الأكاديمية', section: 'about', category: 'عام', icon: <User className="h-4 w-4" /> },
  { id: 'contact', title: 'اتصل بنا', description: 'نموذج المراسلة والأسئلة الشائعة', section: 'contact', category: 'عام', icon: <Mail className="h-4 w-4" /> },
]

function Sparkles(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> }

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { setActiveSection } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Reset query when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setQuery('')
    setOpen(newOpen)
  }

  const filteredResults = query.trim()
    ? searchData.filter(item =>
        item.title.includes(query) ||
        item.description.includes(query) ||
        item.category.includes(query)
      )
    : []

  const handleSelect = (item: SearchItem) => {
    setActiveSection(item.section)
    setOpen(false)
    setQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">البحث في الموقع</DialogTitle>
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المحتوى التعليمي..."
            className="flex-1 bg-transparent border-0 outline-none py-4 px-3 text-sm placeholder:text-muted-foreground"
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        
        {query.trim() && (
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredResults.length > 0 ? (
              <div className="space-y-1">
                {filteredResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-accent transition-colors text-right group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{item.title}</span>
                        <Badge variant="outline" className="text-[10px] h-4">{item.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">لا توجد نتائج لـ &quot;{query}&quot;</p>
              </div>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-3">بحث سريع</p>
            <div className="flex flex-wrap gap-2">
              {['الخطابة', 'التلخيص', 'لغة الجسد', 'السيرة الذاتية', 'علامات الترقيم'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
