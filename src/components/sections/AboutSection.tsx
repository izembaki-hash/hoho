'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Award, GraduationCap, Briefcase, Quote, Clock, Globe, Users } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const authorWorks = [
  {
    title: 'فن التحرير الكتابي - نظري وتطبيقي',
    type: 'كتاب',
    year: '2023',
    description: 'مؤلف شامل يتناول أسس وقواعد التحرير الكتابي مع تطبيقات عملية ونماذج محللة',
    color: 'bg-emerald-500',
  },
  {
    title: 'مهارات العرض الشفهي والإلقاء',
    type: 'كتاب',
    year: '2022',
    description: 'دليل متكامل لتطوير مهارات التحدث أمام الجمهور والإقناع الصوتي',
    color: 'bg-teal-500',
  },
  {
    title: 'دليل التعبير الإداري والمهني',
    type: 'مرجع',
    year: '2021',
    description: 'مرجع عملي لكتابة الرسائل الإدارية والتقارير والمحاضر بأسلوب احترافي',
    color: 'bg-amber-500',
  },
  {
    title: 'علامات الترقيم في اللغة العربية',
    type: 'بحث',
    year: '2020',
    description: 'بحث أكاديمي معمّق حول قواعد واستخدامات علامات الترقيم في الكتابة العربية',
    color: 'bg-primary',
  },
  {
    title: 'الخطابة فنّاً وأداءً',
    type: 'كتاب',
    year: '2019',
    description: 'دراسة في فن الخطابة العربية من الجذور التاريخية إلى الممارسة المعاصرة',
    color: 'bg-red-500',
  },
]

const timeline = [
  { year: '2003', event: 'الحصول على دكتوراه دولة في اللسانيات العربية', icon: <GraduationCap className="h-4 w-4" /> },
  { year: '2005', event: 'التعيين أستاذاً محاضراً في الجامعة', icon: <Briefcase className="h-4 w-4" /> },
  { year: '2010', event: 'نشر أول مؤلّف في فنون التحرير الكتابي', icon: <BookOpen className="h-4 w-4" /> },
  { year: '2015', event: 'المشاركة في المؤتمرات الدولية', icon: <Globe className="h-4 w-4" /> },
  { year: '2020', event: 'إطلاق المنصة التعليمية الرقمية', icon: <Users className="h-4 w-4" /> },
  { year: '2024', event: 'إطلاق موقع التحرير الكتابي والشفهي', icon: <Award className="h-4 w-4" /> },
]

// Draw-in timeline component
function DrawInTimeline({ items }: { items: typeof timeline }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  return (
    <div ref={containerRef} className="relative">
      {/* Timeline line with draw-in animation */}
      <div className="absolute right-5 top-0 bottom-0 w-0.5 bg-primary/20">
        <motion.div
          className="absolute top-0 left-0 right-0 bg-primary/60 origin-top"
          initial={{ height: 0 }}
          animate={isInView ? { height: '100%' } : { height: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 + idx * 0.15, duration: 0.5, ease: 'easeOut' }}
            className="flex items-start gap-4 relative"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 z-10 shadow-md">
              {item.icon}
            </div>
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-bold">{item.year}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.event}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Achievement card with hover expansion
function AchievementCard({ icon, value, label, color, bgColor }: { icon: React.ReactNode; value: string; label: string; color: string; bgColor: string }) {
  return (
    <Card className="border-0 shadow-md text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
      <CardContent className="pt-6 pb-4 relative">
        {/* Expanding background on hover */}
        <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center mx-auto mb-3 ${color} group-hover:scale-110 transition-transform duration-500`}>
            {icon}
          </div>
          <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
          <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AboutSection() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">نبذة عن المؤلف</h2>
        <p className="text-muted-foreground">تعرف على صاحب الموقع ومسيرته العلمية والأدبية</p>
      </motion.div>

      {/* Author Profile */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-l from-primary via-emerald-800 to-primary/80 h-32 sm:h-44 relative">
            {/* Decorative */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 w-20 h-20 border border-white rounded-full" />
              <div className="absolute bottom-4 left-12 w-14 h-14 border border-white rotate-45" />
            </div>
          </div>
          <CardContent className="relative px-6 pb-8 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-background overflow-hidden shadow-2xl bg-muted shrink-0">
                <img
                  src="/images/author-portrait.png"
                  alt="صورة المؤلف"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-right flex-1 pb-2">
                <h3 className="text-2xl font-bold mb-1">أ.د. محمد بن عبد الله</h3>
                <p className="text-primary font-medium mb-3">أستاذ التحرير الكتابي والشفهي</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {/* Shimmer badge effect */}
                  <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20 border-0 relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer" />
                    <GraduationCap className="h-3 w-3 relative z-10" />
                    <span className="relative z-10">دكتوراه دولة</span>
                  </Badge>
                  <Badge className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer" style={{ animationDelay: '0.5s' }} />
                    <Briefcase className="h-3 w-3 relative z-10" />
                    <span className="relative z-10">أستاذ محاضر</span>
                  </Badge>
                  <Badge className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer" style={{ animationDelay: '1s' }} />
                    <Award className="h-3 w-3 relative z-10" />
                    <span className="relative z-10">باحث وأديب</span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Biography */}
      <motion.div variants={itemVariants}>
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
      </motion.div>

      {/* Academic Achievements with hover expansion */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AchievementCard
            icon={<Award className="h-7 w-7" />}
            value="20+"
            label="سنة خبرة أكاديمية"
            color="text-amber-600"
            bgColor="bg-amber-100 dark:bg-amber-900/30"
          />
          <AchievementCard
            icon={<BookOpen className="h-7 w-7" />}
            value="15+"
            label="مؤلّف منشور"
            color="text-emerald-600"
            bgColor="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <AchievementCard
            icon={<GraduationCap className="h-7 w-7" />}
            value="50+"
            label="إشراف على رسائل جامعية"
            color="text-teal-600"
            bgColor="bg-teal-100 dark:bg-teal-900/30"
          />
        </div>
      </motion.div>

      {/* Academic Timeline with Draw-in Animation */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">المسيرة الأكاديمية</h3>
            </div>
            <DrawInTimeline items={timeline} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Published Works */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">المؤلفات والأعمال</h3>
            </div>
            <div className="space-y-3">
              {authorWorks.map((work, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 group"
                >
                  <div className={`w-1 h-12 rounded-full ${work.color} shrink-0 mt-1 group-hover:h-14 transition-all`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">{work.title}</h4>
                      <Badge variant="outline" className="text-xs">{work.type}</Badge>
                      <Badge variant="secondary" className="text-xs">{work.year}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{work.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Books to be Published */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-l from-amber-400 to-amber-600" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">كتب قيد النشر</h3>
              <Badge className="bg-amber-100 text-amber-700 border-0">قريباً</Badge>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow duration-300">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">الإلقاء الإبداعي - نظرية وتطبيق</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">كتاب شامل يتناول فنون الإلقاء الإبداعي من المنظورين النظري والتطبيقي</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow duration-300">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">لغة الجسد في العرض التقديمي</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">دليل عملي لفهم واستخدام لغة الجسد بشكل فعّال في العروض والتواصل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
