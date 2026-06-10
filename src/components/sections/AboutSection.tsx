'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Award, GraduationCap, Briefcase, Quote } from 'lucide-react'

const authorWorks = [
  {
    title: 'فن التحرير الكتابي - نظري وتطبيقي',
    type: 'كتاب',
    year: '2023',
    description: 'مؤلف شامل يتناول أسس وقواعد التحرير الكتابي مع تطبيقات عملية ونماذج محللة',
  },
  {
    title: 'مهارات العرض الشفهي والإلقاء',
    type: 'كتاب',
    year: '2022',
    description: 'دليل متكامل لتطوير مهارات التحدث أمام الجمهور والإقناع الصوتي',
  },
  {
    title: 'دليل التعبير الإداري والمهني',
    type: 'مرجع',
    year: '2021',
    description: 'مرجع عملي لكتابة الرسائل الإدارية والتقارير والمحاضر بأسلوب احترافي',
  },
  {
    title: 'علامات الترقيم في اللغة العربية',
    type: 'بحث',
    year: '2020',
    description: 'بحث أكاديمي معمّق حول قواعد واستخدامات علامات الترقيم في الكتابة العربية',
  },
  {
    title: 'الخطابة فنّاً وأداءً',
    type: 'كتاب',
    year: '2019',
    description: 'دراسة في فن الخطابة العربية من الجذور التاريخية إلى الممارسة المعاصرة',
  },
]

export default function AboutSection() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">نبذة عن المؤلف</h2>
        <p className="text-muted-foreground">تعرف على صاحب الموقع ومسيرته العلمية والأدبية</p>
      </div>

      {/* Author Profile */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-l from-primary to-emerald-800 h-32 sm:h-40" />
        <CardContent className="relative px-6 pb-8 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-background overflow-hidden shadow-xl bg-muted shrink-0">
              <img
                src="/images/author-portrait.png"
                alt="صورة المؤلف"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-right flex-1 pb-2">
              <h3 className="text-2xl font-bold mb-1">أ.د. محمد بن عبد الله</h3>
              <p className="text-primary font-medium mb-2">أستاذ التحرير الكتابي والشفهي</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Badge variant="secondary" className="gap-1">
                  <GraduationCap className="h-3 w-3" />
                  دكتوراه دولة
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Briefcase className="h-3 w-3" />
                  أستاذ محاضر
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Award className="h-3 w-3" />
                  باحث وأديب
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biography */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Quote className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold">السيرة الذاتية</h3>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              أستاذ التعليم العالي في تخصص اللغة العربية وآدابها، ومختص في فنون التحرير الكتابي والشفهي. 
              حاصل على دكتوراه دولة في اللسانيات العربية وتحليل الخطاب، مع خبرة تزيد عن عشرين عاماً 
              في ميدان التعليم الجامعي والبحث العلمي.
            </p>
            <p>
              شارك في العديد من المؤتمرات العلمية الدولية والوطنية، وأشرف على عشرات المذكرات والرسائل الجامعية. 
              نشر أبحاثاً في مجلات محكّمة متخصصة، وألّف كتباً في مجالات التحرير والبلاغة والتواصل الفعّال.
            </p>
            <p>
              يؤمن بأن إتقان مهارات التعبير الكتابي والشفهي هو مفتاح النجاح في الحياة الأكاديمية والمهنية، 
              وسعى من خلال هذا الموقع إلى إتاحة محتوى تعليمي نوعي لكل فئات المتعلمين.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Academic Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md text-center">
          <CardContent className="pt-6 pb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 text-amber-600">
              <Award className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">20+</div>
            <div className="text-sm text-muted-foreground">سنة خبرة أكاديمية</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md text-center">
          <CardContent className="pt-6 pb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">15+</div>
            <div className="text-sm text-muted-foreground">مؤلّف منشور</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md text-center">
          <CardContent className="pt-6 pb-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3 text-teal-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-teal-600 mb-1">50+</div>
            <div className="text-sm text-muted-foreground">إشراف على رسائل جامعية</div>
          </CardContent>
        </Card>
      </div>

      {/* Published Works */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold">المؤلفات والأعمال</h3>
          </div>
          <div className="space-y-4">
            {authorWorks.map((work, idx) => (
              <div key={idx}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-bold text-foreground">{work.title}</h4>
                      <Badge variant="outline" className="text-xs">{work.type}</Badge>
                      <Badge variant="secondary" className="text-xs">{work.year}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{work.description}</p>
                  </div>
                </div>
                {idx < authorWorks.length - 1 && <Separator className="my-2 opacity-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Books to be Published */}
      <Card className="border-0 shadow-md border-r-4 border-r-amber-500">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold">كتب قيد النشر</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="font-bold text-amber-900 mb-1">الإلقاء الإبداعي - نظرية وتطبيق</h4>
              <p className="text-sm text-amber-700">كتاب شامل يتناول فنون الإلقاء الإبداعي من المنظورين النظري والتطبيقي</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="font-bold text-amber-900 mb-1">لغة الجسد في العرض التقديمي</h4>
              <p className="text-sm text-amber-700">دليل عملي لفهم واستخدام لغة الجسد بشكل فعّال في العروض والتواصل</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
