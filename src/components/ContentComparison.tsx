'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, Pen, Megaphone, FileText, Mail, User, ScrollText, BarChart3,
  CheckCircle, X, ArrowLeftRight, Eye, EyeOff, BookOpen,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface ComparisonSide {
  icon: ReactNode
  title: string
  points: string[]
  colorClass: string
  bgClass: string
  borderClass: string
  badgeClass: string
}

interface ComparisonData {
  id: string
  title: string
  left: ComparisonSide
  right: ComparisonSide
  similarities: string[]
  differences: string[]
}

const comparisons: ComparisonData[] = [
  {
    id: 'oral-vs-written',
    title: 'مقارنة بين التعبير الشفهي والكتابي',
    left: {
      icon: <Mic className="h-5 w-5" />,
      title: 'التعبير الشفهي',
      points: [
        'يعتمد على الكلام المنطوق والمحادثة المباشرة',
        'يتيح التفاعل الفوري مع الجمهور وقراءة ردود الفعل',
        'يستخدم لغة الجسد ونبرة الصوت لتعزيز المعنى',
        'يتطلب مهارات الإلقاء وحسن الأداء الصوتي',
      ],
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    right: {
      icon: <Pen className="h-5 w-5" />,
      title: 'التعبير الكتابي',
      points: [
        'يعتمد على الكلمة المكتوبة والصياغة المدققة',
        'يتيح مراجعة وتعديل النص قبل النشر أو التقديم',
        'يستخدم علامات الترقيم وأساليب الربط لتنظيم الأفكار',
        'يتطلب مهارات التحرير والصياغة اللغوية الدقيقة',
      ],
      colorClass: 'text-amber-700 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/30',
      borderClass: 'border-amber-200 dark:border-amber-800',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    similarities: [
      'كلاهما وسيلة تواصل لنقل الأفكار والمعلومات',
      'يتطلبان مهارة تنظيم الأفكار والترابط المنطقي',
      'يهدفان إلى الإقناع والتأثير في المتلقي',
    ],
    differences: [
      'الشفهي فوري ومباشر، بينما الكتابي يتطلب وقتاً للصياغة',
      'الشفهي يتيح التصحيح الفوري، والكتابي يحتاج مراجعة مسبقة',
      'الكتابي أكثر رسمية ودقة في التعبير من الشفهي',
    ],
  },
  {
    id: 'essay-vs-oration',
    title: 'مقارنة بين المقال والخطبة',
    left: {
      icon: <FileText className="h-5 w-5" />,
      title: 'المقال',
      points: [
        'نص نثري مكتوب يعالج موضوعاً بأسلوب حُر',
        'يقرؤه المتلقي بنفسه وفق سرعته الخاصة',
        'يُنشر في الصحف والمجلات والمنصات الرقمية',
        'يعتمد على الحجة المنطقية والأسلوب التحليلي',
        'يتيح للكاتب مراجعة وتعديل النص قبل النشر',
      ],
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    right: {
      icon: <Megaphone className="h-5 w-5" />,
      title: 'الخطبة',
      points: [
        'خطاب شفهي يُلقى أمام جمهور لغرض الإقناع',
        'يستمع إليه الجمهور في الوقت الحقيقي',
        'يُلقى في المناسبات الرسمية والدينية والسياسية',
        'يعتمد على العاطفة والمنطق معاً مع أدوات بلاغية',
        'يتطلب مهارات الإلقاء والتفاعل مع ردود الفعل',
      ],
      colorClass: 'text-amber-700 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/30',
      borderClass: 'border-amber-200 dark:border-amber-800',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    similarities: [
      'كلاهما يتكون من مقدمة وعرض وخاتمة',
      'يهدفان إلى إقناع المتلقي بفكرة معينة',
    ],
    differences: [
      'المقال مكتوب والخطبة شفهية ملقاة',
      'الخطبة تعتمد أكثر على العاطفة، والمقال على المنطق',
      'الخطبة تتطلب حضور جمهور، والمقال يُقرأ فردياً',
    ],
  },
  {
    id: 'admin-vs-personal-letter',
    title: 'مقارنة بين الرسالة الإدارية والرسالة الشخصية',
    left: {
      icon: <Mail className="h-5 w-5" />,
      title: 'الرسالة الإدارية',
      points: [
        'رسالة رسمية بين مؤسسة وأفراد أو بين مؤسستين',
        'تتبع بنية محددة: ترويسة، موضوع، تحية، متن، خاتمة',
        'لغتها رسمية ومهذبة وموجزة',
        'تحتاج مراجعة دقيقة قبل الإرسال',
      ],
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    right: {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'الرسالة الشخصية',
      points: [
        'رسالة غير رسمية بين أفراد (أصدقاء، أقارب)',
        'بنيتها مرنة: تحية، متن، خاتمة وتوقيع',
        'لغتها عفوية ودافئة وقد تتضمن عبارات عاطفية',
        'تُكتب بتلقائية دون قيود صارمة',
      ],
      colorClass: 'text-amber-700 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/30',
      borderClass: 'border-amber-200 dark:border-amber-800',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    similarities: [
      'كلاهما وسيلة تواصل مكتوبة بين طرفين',
      'يحتويان على تحية ومتن وخاتمة',
    ],
    differences: [
      'الإدارية رسمية والشخصية عفوية',
      'الإدارية تخضع لمعايير مؤسسية، والشخصية حرة',
      'لغة الإدارية مباشرة وموجزة، والشخصية تعبيرية وعاطفية',
    ],
  },
  {
    id: 'cv-vs-profile',
    title: 'مقارنة بين السيرة الذاتية والملف الشخصي',
    left: {
      icon: <User className="h-5 w-5" />,
      title: 'السيرة الذاتية',
      points: [
        'وثيقة رسمية تُلخّص المؤهلات والخبرات المهنية',
        'تُقدَّم عند التقدم لوظيفة أو قبول أكاديمي',
        'تتبع ترتيباً زمنياً أو وظيفياً محدداً',
        'تركز على الإنجازات والخبرات المهنية بشكل موضوعي',
      ],
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    right: {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'الملف الشخصي',
      points: [
        'عرض رقمي أو ورقي يبرز الهوية المهنية والإبداعية',
        'يُستخدم في المنصات المهنية والشبكات الاجتماعية',
        'يتضمن نماذج من الأعمال والمشاريع السابقة',
        'يسمح بشخصية العرض وإبراز الجانب الإبداعي',
      ],
      colorClass: 'text-amber-700 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/30',
      borderClass: 'border-amber-200 dark:border-amber-800',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    similarities: [
      'كلاهما يعرض مهارات وخبرات الفرد',
      'يهدفان إلى إبراز الكفاءات أمام جهة معينة',
    ],
    differences: [
      'السيرة الذاتية رسمية ومختصرة، والملف الشخصي أكثر تفصيلاً وإبداعاً',
      'السيرة تُرسل مباشرة، والملف يُنشر ليُطّلع عليه المهتمون',
      'السيرة تركّز على الخبرات، والملف يضم نماذج الأعمال',
    ],
  },
  {
    id: 'summary-vs-analysis',
    title: 'مقارنة بين التلخيص والتحليل',
    left: {
      icon: <ScrollText className="h-5 w-5" />,
      title: 'التلخيص',
      points: [
        'استخراج الأفكار الرئيسية من النص الأصلي وإعادة صياغتها',
        'يحافظ على المعنى الأصلي دون إضافة آراء شخصية',
        'يكون عادة ثلث طول النص الأصلي (قاعدة الثلث)',
        'يتطلب مهارة التحديد الدقيق للأفكار الجوهرية',
      ],
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    right: {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'التحليل',
      points: [
        'تفكيك النص إلى عناصره وفهم العلاقات بينها',
        'يتضمن قراءة نقدية واستنتاجات شخصية مبررة',
        'يضيف رؤية جديدة تتجاوز مضمون النص الأصلي',
        'يتطلب فهماً عميقاً واستدلالاً منطقياً ومهارات نقدية',
      ],
      colorClass: 'text-amber-700 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/30',
      borderClass: 'border-amber-200 dark:border-amber-800',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    similarities: [
      'كلاهما يتطلبان قراءة متأنية وفهماً عميقاً للنص',
      'يعتمدان على مهارات التفكير النقدي والاستنتاج',
    ],
    differences: [
      'التلخيص موضوعي والتحليل يتضمن الرأي الشخصي',
      'التلخيص يُختصر النص، والتحليل يشرح ويفكّك أعمق',
      'التلخيص لا يضيف جديداً، والتحليل يبني استنتاجات جديدة',
    ],
  },
]

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export default function ContentComparison() {
  const [activeComparison, setActiveComparison] = useState(comparisons[0].id)
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false)

  const currentComparison = comparisons.find(c => c.id === activeComparison) ?? comparisons[0]

  return (
    <Card className="border-0 shadow-lg gradient-border-animate overflow-hidden" dir="rtl">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            أداة المقارنة التفاعلية
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDifferencesOnly(prev => !prev)}
            className={`no-print gap-1.5 text-xs h-8 ${
              showDifferencesOnly
                ? 'border-primary text-primary bg-primary/5'
                : 'border-border text-muted-foreground'
            }`}
          >
            {showDifferencesOnly ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                عرض الكل
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                الاختلافات فقط
              </>
            )}
          </Button>
        </div>

        {/* Tab selector for comparisons */}
        <Tabs
          value={activeComparison}
          onValueChange={setActiveComparison}
          className="mt-3"
        >
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-muted/50 p-1">
            {comparisons.map((comp) => (
              <TabsTrigger
                key={comp.id}
                value={comp.id}
                className="flex-1 min-w-0 text-[10px] sm:text-xs px-2 py-2 leading-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
              >
                {comp.title.replace('مقارنة بين ', '')}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComparison}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
          >
            {/* Comparison Title */}
            <div className="text-center">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                {currentComparison.title}
              </h3>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-0 items-stretch">
              {/* Left side */}
              <ComparisonSideCard side={currentComparison.left} />

              {/* VS Badge - centered between columns on desktop */}
              <div className="hidden md:flex items-center justify-center px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-bl from-emerald-500 via-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-xs">VS</span>
                </div>
              </div>

              {/* VS Badge - shown between on mobile */}
              <div className="flex md:hidden items-center justify-center -my-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-emerald-500 via-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-xs">VS</span>
                </div>
              </div>

              {/* Right side */}
              <ComparisonSideCard side={currentComparison.right} />
            </div>

            {/* Similarities & Differences section */}
            <AnimatePresence>
              {!showDifferencesOnly && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Similarities */}
                  <div className="rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                        أوجه التشابه
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {currentComparison.similarities.map((point, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-200 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                          <span className="group-hover:text-emerald-900 dark:group-hover:text-emerald-100 transition-colors">
                            {point}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Differences */}
                  <div className="rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <X className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300">
                        أوجه الاختلاف
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {currentComparison.differences.map((point, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                          <span className="group-hover:text-amber-900 dark:group-hover:text-amber-100 transition-colors">
                            {point}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Differences-only view */}
            <AnimatePresence>
              {showDifferencesOnly && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <X className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300">
                      أوجه الاختلاف
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {currentComparison.differences.map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                        <span className="group-hover:text-amber-900 dark:group-hover:text-amber-100 transition-colors">
                          {point}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function ComparisonSideCard({ side }: { side: ComparisonSide }) {
  return (
    <div className={`rounded-xl border ${side.borderClass} ${side.bgClass} p-4`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${side.badgeClass}`}>
          {side.icon}
        </div>
        <h4 className={`font-bold text-sm ${side.colorClass}`}>{side.title}</h4>
      </div>

      {/* Points */}
      <ul className="space-y-2">
        {side.points.map((point, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-start gap-2 text-sm text-foreground/80 group"
          >
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
              side.badgeClass.includes('emerald') ? 'bg-emerald-500' : 'bg-amber-500'
            } group-hover:scale-150 transition-transform`} />
            <span className="group-hover:text-foreground transition-colors leading-relaxed">
              {point}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
