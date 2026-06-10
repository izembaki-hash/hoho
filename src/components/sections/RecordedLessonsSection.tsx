'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, Clock, Download, FileText, BookOpen, Search, 
  Filter, Eye, Calendar, Tag, Paperclip 
} from 'lucide-react'

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

const categories = ['الكل', 'كتابي', 'شفهي']

export default function RecordedLessonsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [selectedLesson, setSelectedLesson] = useState<RecordedLesson | null>(null)

  const filteredLessons = sampleRecordedLessons.filter(lesson => {
    const matchesSearch = lesson.title.includes(searchQuery) || lesson.description.includes(searchQuery)
    const matchesCategory = activeCategory === 'الكل' || lesson.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">دروس مسجلة</h2>
        <p className="text-muted-foreground">مكتبة شاملة للدروس المسجلة مع مرفقات وملحقات تعليمية</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الدروس..."
            className="pr-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="gap-1"
            >
              <Filter className="h-3 w-3" />
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            onClick={() => setSelectedLesson(lesson)}
          >
            <div className="relative aspect-video bg-gradient-to-bl from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 mr-[-2px]" />
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
                  <Clock className="h-3 w-3 ml-1" />
                  {formatDuration(lesson.duration)}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant={lesson.category === 'شفهي' ? 'default' : 'secondary'} className="text-xs">
                  {lesson.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {lesson.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {lesson.description}
              </p>
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
                <DialogTitle className="text-xl">{selectedLesson.title}</DialogTitle>
              </DialogHeader>
              
              {/* Video Player Placeholder */}
              <div className="aspect-video bg-black/90 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Play className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-white/70">مشغل الفيديو</p>
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
                            <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-red-600" />
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
