'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { 
  Play, Clock, Download, FileText, BookOpen, Search, 
  Filter, Eye, Calendar, Tag, Paperclip, Bookmark, 
  BookmarkCheck, CheckCircle2, Star, ChevronDown, Sparkles,
  ArrowLeft
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import SectionHeader from '@/components/SectionHeader'
import ShareButton from '@/components/ShareButton'
import { motion } from 'framer-motion'

interface RecordedLesson {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  category: string
  duration: number
  views: number
  createdAt: string
  rating: number
  level: string
  attachments: { name: string; type: string; size: string }[]
}

const sampleRecordedLessons: RecordedLesson[] = [
  {
    id: '1',
    title: 'مقدمة في التحرير الكتابي',
    description: 'درس تأسيسي يتناول مفهوم التحرير الكتابي وأساسياته ومجالات تطبيقه',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'كتابي',
    duration: 3600,
    views: 1250,
    rating: 4.8,
    level: 'مبتدئ',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    attachments: [
      { name: 'ملخص الدرس.pdf', type: 'PDF', size: '2.5 MB' },
      { name: 'تمارين تطبيقية.pdf', type: 'PDF', size: '1.2 MB' },
    ],
  },
  {
    id: '2',
    title: 'فن الخطابة - المستوى الأول',
    description: 'تعلم أساسيات فن الخطابة وطرق إعداد الخطبة المؤثرة',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'شفهي',
    duration: 5400,
    views: 980,
    rating: 4.9,
    level: 'متوسط',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    attachments: [
      { name: 'كتاب الخطابة.pdf', type: 'PDF', size: '5.1 MB' },
      { name: 'نماذج خطب.pdf', type: 'PDF', size: '3.2 MB' },
      { name: 'تعريفات ومصطلحات.pdf', type: 'PDF', size: '800 KB' },
    ],
  },
  {
    id: '3',
    title: 'كتابة التقرير الإداري',
    description: 'دليل عملي لكتابة التقارير الإدارية بشكل احترافي ومنهجي',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'كتابي',
    duration: 4200,
    views: 760,
    rating: 4.7,
    level: 'متقدم',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    attachments: [
      { name: 'نماذج تقارير.pdf', type: 'PDF', size: '1.8 MB' },
      { name: 'دليل كتابة التقرير.pdf', type: 'PDF', size: '2.1 MB' },
    ],
  },
  {
    id: '4',
    title: 'مهارات العرض الشفهي',
    description: 'تقنيات ومهارات العرض الشفهي الفعّال والتواصل مع الجمهور',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'شفهي',
    duration: 4800,
    views: 1120,
    rating: 4.6,
    level: 'متوسط',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    attachments: [
      { name: 'ملخص المهارات.pdf', type: 'PDF', size: '1.5 MB' },
      { name: 'تمارين التدريب.pdf', type: 'PDF', size: '900 KB' },
    ],
  },
  {
    id: '5',
    title: 'علامات الترقيم - درس شامل',
    description: 'شرح مفصل لجميع علامات الترقيم في اللغة العربية مع أمثلة تطبيقية',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'كتابي',
    duration: 6000,
    views: 1540,
    rating: 5.0,
    level: 'مبتدئ',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    attachments: [
      { name: 'جدول علامات الترقيم.pdf', type: 'PDF', size: '500 KB' },
      { name: 'تمارين محلولة.pdf', type: 'PDF', size: '1.1 MB' },
      { name: 'ملخص شامل.pdf', type: 'PDF', size: '750 KB' },
    ],
  },
  {
    id: '6',
    title: 'الإلقاء الإبداعي ولغة الجسد',
    description: 'كيفية استخدام لغة الجسد وتقنيات الإلقاء الإبداعي في العروض',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'شفهي',
    duration: 4500,
    views: 890,
    rating: 4.8,
    level: 'متقدم',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    attachments: [
      { name: 'دليل لغة الجسد.pdf', type: 'PDF', size: '3.2 MB' },
    ],
  },
  {
    id: '7',
    title: 'بناء النص الأدبي',
    description: 'أسس بناء النص الأدبي وتقنيات الكتابة الإبداعية',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'كتابي',
    duration: 5100,
    views: 670,
    rating: 4.5,
    level: 'متوسط',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    attachments: [
      { name: 'نماذج نصوص أدبية.pdf', type: 'PDF', size: '4.5 MB' },
      { name: 'تمارين بناء النص.pdf', type: 'PDF', size: '1.3 MB' },
    ],
  },
  {
    id: '8',
    title: 'كتابة المقالة الصحفية',
    description: 'فنون كتابة المقالة الصحفية وأنواعها وأساليبها المختلفة',
    videoUrl: '#',
    thumbnailUrl: '',
    category: 'كتابي',
    duration: 3900,
    views: 540,
    rating: 4.4,
    level: 'متوسط',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    attachments: [
      { name: 'نماذج مقالات.pdf', type: 'PDF', size: '2.8 MB' },
    ],
  },
]

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}س ${minutes}د`
  return `${minutes} دقيقة`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-SA', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  })
}

function isNewLesson(createdAt: string) {
  const daysDiff = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff <= 7
}

function getLevelColor(level: string) {
  switch (level) {
    case 'مبتدئ': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'متوسط': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'متقدم': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-muted text-muted-foreground'
  }
}

const categories = ['الكل', 'كتابي', 'شفهي']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

export default function RecordedLessonsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [selectedLesson, setSelectedLesson] = useState<RecordedLesson | null>(null)
  const { bookmarks, toggleBookmark, isBookmarked } = useAppStore()

  const filteredLessons = sampleRecordedLessons.filter(lesson => {
    const matchesSearch = lesson.title.includes(searchQuery) || lesson.description.includes(searchQuery)
    const matchesCategory = activeCategory === 'الكل' || lesson.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const bookmarkedCount = sampleRecordedLessons.filter(l => isBookmarked(l.id)).length
  
  // Find similar lessons for detail dialog
  const getSimilarLessons = (lesson: RecordedLesson) => {
    return sampleRecordedLessons
      .filter(l => l.id !== lesson.id && (l.category === lesson.category || l.level === lesson.level))
      .slice(0, 3)
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
        title="دروس مسجلة"
        description="مكتبة شاملة للدروس المسجلة مع مرفقات وملحقات تعليمية"
        icon={<BookOpen className="h-9 w-9" />}
        gradient="from-amber-500 to-amber-700"
        shareTitle="دروس مسجلة - التحرير الكتابي والشفهي"
      />

      {/* Stats bar */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">إجمالي الدروس:</span>
            <span className="font-bold">{sampleRecordedLessons.length}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <BookmarkCheck className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">المحفوظة:</span>
            <span className="font-bold">{bookmarkedCount}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">إجمالي المشاهدات:</span>
            <span className="font-bold">{sampleRecordedLessons.reduce((s, l) => s + l.views, 0).toLocaleString('ar-SA')}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">دروس جديدة:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{sampleRecordedLessons.filter(l => isNewLesson(l.createdAt)).length}</span>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter - Enhanced styling */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الدروس..."
              className="pr-10 pl-4 h-11 bg-background border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={`gap-1 transition-all ${activeCategory === cat ? 'shadow-md' : ''}`}
              >
                <Filter className="h-3 w-3" />
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLessons.map((lesson) => (
          <motion.div key={lesson.id} variants={itemVariants}>
            <Card
              className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              onClick={() => setSelectedLesson(lesson)}
            >
              <div className="relative aspect-video bg-gradient-to-bl from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                {/* Colored gradient based on category */}
                <div className={`absolute inset-0 ${lesson.category === 'شفهي' ? 'bg-gradient-to-bl from-teal-500/20 to-teal-600/5' : 'bg-gradient-to-bl from-amber-500/20 to-amber-600/5'}`} />
                {/* Overlay gradient for better badge readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg relative z-10">
                  <Play className="h-6 w-6 mr-[-2px]" />
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 z-10">
                  <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0 backdrop-blur-sm">
                    <Clock className="h-3 w-3 ml-1" />
                    {formatDuration(lesson.duration)}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                  <Badge className={`text-xs ${getLevelColor(lesson.level)}`}>
                    {lesson.level}
                  </Badge>
                  {isNewLesson(lesson.createdAt) && (
                    <Badge className="text-xs bg-amber-500 text-white border-0 animate-pulse">
                      <Sparkles className="h-2.5 w-2.5 ml-0.5" />
                      جديد
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant={lesson.category === 'شفهي' ? 'default' : 'secondary'} className="text-xs">
                    {lesson.category}
                  </Badge>
                </div>
                {/* Bookmark button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(lesson.id); }}
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
                  title={isBookmarked(lesson.id) ? 'إزالة من المحفوظات' : 'حفظ الدرس'}
                >
                  {isBookmarked(lesson.id) ? (
                    <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Bookmark className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {lesson.description}
                </p>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(lesson.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} 
                    />
                  ))}
                  <span className="text-xs font-medium mr-1">{lesson.rating}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {lesson.views} مشاهدة
                  </div>
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {lesson.attachments.length} مرفق
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
          <p className="text-sm text-muted-foreground">جرّب تعديل كلمات البحث أو تغيير التصنيف</p>
        </div>
      )}

      {/* Lesson Detail Dialog */}
      <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && setSelectedLesson(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {selectedLesson.title}
                  {isNewLesson(selectedLesson.createdAt) && (
                    <Badge className="text-[10px] bg-amber-500 text-white border-0">
                      <Sparkles className="h-2.5 w-2.5 ml-0.5" />
                      جديد
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              {/* Video Player Placeholder with overlay gradient */}
              <div className="aspect-video bg-black/90 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="text-center text-white relative z-10">
                  <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Play className="h-8 w-8" />
                  </div>
                  <p className="text-sm text-white/70">مشغل الفيديو</p>
                </div>
                {/* Duration overlay */}
                <div className="absolute bottom-3 left-3 z-10">
                  <Badge variant="secondary" className="text-xs bg-black/70 text-white border-0 backdrop-blur-sm">
                    <Clock className="h-3 w-3 ml-1" />
                    {formatDuration(selectedLesson.duration)}
                  </Badge>
                </div>
              </div>

              {/* Lesson Info */}
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{selectedLesson.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(selectedLesson.duration)}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    {selectedLesson.views} مشاهدة
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(selectedLesson.createdAt)}
                  </Badge>
                  <Badge variant={selectedLesson.category === 'شفهي' ? 'default' : 'secondary'}>
                    {selectedLesson.category}
                  </Badge>
                  <Badge className={getLevelColor(selectedLesson.level)}>
                    {selectedLesson.level}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {selectedLesson.rating}
                  </Badge>
                </div>

                {/* Share */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm text-muted-foreground">مشاركة:</span>
                  <ShareButton title={selectedLesson.title} />
                </div>

                {/* Attachments */}
                {selectedLesson.attachments.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-primary" />
                      المرفقات والملحقات
                    </h4>
                    <div className="space-y-2">
                      {selectedLesson.attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{attachment.type} • {attachment.size}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Download className="h-3 w-3" />
                            تحميل
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Lessons */}
                {getSimilarLessons(selectedLesson).length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4 text-primary" />
                      دروس مشابهة
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {getSimilarLessons(selectedLesson).map(similar => (
                        <Card 
                          key={similar.id} 
                          className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group/sim overflow-hidden"
                          onClick={() => setSelectedLesson(similar)}
                        >
                          <div className="relative aspect-video bg-gradient-to-bl from-primary/10 to-primary/5 flex items-center justify-center">
                            <div className={`absolute inset-0 ${similar.category === 'شفهي' ? 'bg-gradient-to-bl from-teal-500/10 to-teal-600/5' : 'bg-gradient-to-bl from-amber-500/10 to-amber-600/5'}`} />
                            <Play className="h-6 w-6 text-primary/50 group-hover/sim:text-primary transition-colors" />
                            <Badge className="text-[9px] absolute top-1.5 right-1.5 px-1 py-0 border-0 bg-black/50 text-white">{formatDuration(similar.duration)}</Badge>
                          </div>
                          <CardContent className="p-2.5">
                            <h5 className="font-medium text-xs line-clamp-1 group-hover/sim:text-primary transition-colors">{similar.title}</h5>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                              <span className="text-[10px] text-muted-foreground">{similar.rating}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
