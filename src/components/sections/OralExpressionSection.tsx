'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  Mic, Users, GraduationCap, School, BookOpen, 
  Lightbulb, MessageCircle, Eye, Hand, 
  Volume2, Presentation, Sparkles, ArrowLeft, CheckCircle2,
  Bookmark, BookmarkCheck, Share2 
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import SectionHeader from '@/components/SectionHeader'
import ShareButton from '@/components/ShareButton'
import { motion } from 'framer-motion'

type TargetAudience = 'students' | 'professors' | 'pupils'

interface ContentItem {
  title: string
  description: string
  details: string[]
  tips?: string[]
}

interface SectionContent {
  definition: ContentItem
  types: ContentItem
  skills: ContentItem
  creative: ContentItem
  bodyLanguage: ContentItem
}

const contentByAudience: Record<TargetAudience, SectionContent> = {
  students: {
    definition: {
      title: 'تعريف التعبير الشفهي',
      description: 'التعبير الشفهي هو القدرة على نقل الأفكار والمشاعر والمعلومات بطريقة منطقية ومقنعة باستخدام اللغة المنطوقة، مع مراعاة مستوى الجمهور والموقف التواصلي.',
      details: [
        'التعبير الشفهي مهارة تواصلية أساسية تُتيح للطالب التعبير عن أفكاره بوضوح وثقة',
        'يتضمن التخطيط للمحتوى وتنظيم الأفكار قبل الإلقاء',
        'يرتبط بالقدرة على الإقناع والتأثير في المتلقين',
        'يعد ركيزة أساسية في المسيرة الأكاديمية والمهنية للطالب',
      ],
      tips: [
        'تدرّب على الإلقاء أمام المرآة أو مع زملائك',
        'سجّل صوتك واستمع إليه لتحسين أدائك',
        'ابدأ بالمواضيع التي تشعر بالراحة تجاهها',
      ],
    },
    types: {
      title: 'أنواع العرض الشفهي',
      description: 'تتنوع أشكال العرض الشفهي حسب الغاية والسياق التواصلي، ولكل نوع خصائصه ومتطلباته.',
      details: [
        'العرض الأكاديمي: تقديم بحث أو دراسة أمام لجنة أو جمهور أكاديمي',
        'المناقشة والحوار: تبادل الآراء والأفكار حول موضوع معين',
        'الخطبة: إلقاء كلمة في مناسبة رسمية أو اجتماعية',
        'المحاضرة: شرح موضوع بشكل منهجي ومنظم',
        'المداخلة: المشاركة بفكرة أو رأي في نقاش جماعي',
        'المقابلة: الحوار الموجه مع شخص أو جهة حول موضوع محدد',
      ],
    },
    skills: {
      title: 'مهارات العرض الشفهي',
      description: 'مجموعة من المهارات الأساسية والفرعية التي يحتاجها الطالب لتقديم عرض شفهي ناجح ومؤثر.',
      details: [
        'مهارة التخطيط: تحديد الهدف والجمهور وإعداد المحتوى',
        'مهارة التنظيم: ترتيب الأفكار بشكل منطقي ومتسلسل',
        'مهارة الإلقاء: التحكم في نبرة الصوت وسرعة الكلام',
        'مهارة التفاعل: التواصل البصري والاستجابة لتفاعل الجمهور',
        'مهارة إدارة الوقت: الالتزام بالوقت المخصص دون إطالة أو اختصار',
        'مهارة الإقناع: استخدام الحجج والأدلة لتعزيز الموقف',
      ],
      tips: [
        'حضّر عرضك جيداً ودرّب عليه مرات عديدة',
        'استخدم وسائل بصرية لدعم أفكارك',
        'اهتم بلغة جسدك أثناء العرض',
      ],
    },
    creative: {
      title: 'الإلقاء الإبداعي',
      description: 'فن التعبير بأسلوب مبتكر وجذاب يخاطب العقل والوجدان معاً، ويجعل العرض تجربة لا تُنسى.',
      details: [
        'استخدام القصص والأمثلة الحية لتوضيح الأفكار',
        'توظيف الصور البلاغية والمجاز لتعزيز التأثير',
        'التنويع في نبرة الصوت والإيقاع حسب المحتوى',
        'إشراك الجمهور من خلال الأسئلة والتفاعل المباشر',
        'بناء لحظات تأملية وذروة في العرض',
        'الخاتمة الإبداعية التي تترك أثراً عميقاً',
      ],
      tips: [
        'اقرأ باستمرار لتثري حصيلتك اللغوية والأدبية',
        'شاهد عروضاً ناجحة وتعلم منها',
        'لا تخف من التجديد والخروج عن المألوف',
      ],
    },
    bodyLanguage: {
      title: 'لغة الجسد',
      description: 'المحاور غير اللفظية في التواصل التي تشمل حركات الجسد وتعبيرات الوجه والوقفة والمسافة الشخصية.',
      details: [
        'التواصل البصري: النظر إلى الجمهور بثقة وتوزيع النظرات بانتظام',
        'تعبيرات الوجه: الابتسامة والتفاعل الوجهي مع المحتوى',
        'حركات اليدين: استخدام إيماءات معبرة تدعم الكلام',
        'الوقفة وال posture: الوقوف باعتدال وثقة',
        'التنقل: التحرك بمرونة دون كثرة تُشتت الجمهور',
        'المسافة الشخصية: الحفاظ على مسافة مناسبة مع الجمهور',
      ],
      tips: [
        'سجّل نفسك بالفيديو ومراجعة لغة جسدك',
        'تجنب الحركات المتكررة والعصبية',
        'تدرّب على الوقفة المريحة والثابتة',
      ],
    },
  },
  professors: {
    definition: {
      title: 'تعريف التعبير الشفهي',
      description: 'في السياق الأكاديمي، يُعنى التعبير الشفهي بالقدرة على تقديم المحتوى العلمي بشكل واضح ومنهجي، مع مراعاة المعايير الأكاديمية في العرض والتواصل.',
      details: [
        'مهارة أساسية في العملية التعليمية الجامعية',
        'يشمل إعداد المحاضرات وتقديمها بأسلوب علمي رصين',
        'يرتبط بجودة التدريس وفعالية نقل المعرفة',
        'يعد معياراً من معايير تقييم الأداء الأكاديمي',
      ],
      tips: [
        'طوّر أسلوبك في العرض بشكل مستمر',
        'نوّع في طرق التدريس لتناسب مختلف أنماط التعلم',
      ],
    },
    types: {
      title: 'أنواع العرض الشفهي الأكاديمي',
      description: 'أنواع العروض الشفهية التي يحتاجها الأستاذ الجامعي في ممارسته المهنية.',
      details: [
        'المحاضرة الجامعية: تقديم مادة علمية بشكل منهجي ومتكامل',
        'عرض البحث العلمي: تقديم نتائج بحثية في مؤتمر أو ندوة',
        'إدارة الندوات: توجيه النقاش الأكاديمي وإدارة الحوار',
        'الإشراف والمناقشة: توجيه الطلبة في مشاريعهم البحثية',
        'التقارير الشفهية: عرض إنجازات ومتابعات أمام لجان',
      ],
    },
    skills: {
      title: 'مهارات العرض الأكاديمي',
      description: 'المهارات المتقدمة المطلوبة للأستاذ الجامعي في تقديم المحتوى العلمي.',
      details: [
        'القدرة على تبسيط المفاهيم المعقدة دون المساس بدقتها',
        'إدارة وقت المحاضرة بكفاءة مع تغطية جميع المحاور',
        'استخدام تقنيات العرض الحديثة بفعالية',
        'التفاعل مع أسئلة الطلبة واهتماماتهم',
        'بناء بيئة تعليمية محفزة للتفكير النقدي',
        'التكييف مع مستويات الطلبة المختلفة',
      ],
    },
    creative: {
      title: 'الإبداع في التدريس الجامعي',
      description: 'توظيف أساليب مبتاجة في تقديم المحتوى الأكاديمي يجعل المحاضرة تجربة تعليمية ممتعة ومثمرة.',
      details: [
        'استخدام طريقة السرد القصصي في تقديم المفاهيم النظرية',
        'دمج التكنولوجيا والوسائط المتعددة في العرض',
        'تصميم أنشطة تفاعلية أثناء المحاضرة',
        'ربط المادة العلمية بالواقع المعاصر وقضايا المجتمع',
        'تشجيع التعلم التعاوني والنقاش البنّاء',
      ],
    },
    bodyLanguage: {
      title: 'لغة الجسد في القاعة',
      description: 'كيفية استخدام لغة الجسد لتعزيز التواصل الفعّال مع الطلبة داخل القاعة.',
      details: [
        'الوقفة الحازمة والمريحة التي توحي بالثقة والخبرة',
        'التواصل البصري الشامل لجميع أنحاء القاعة',
        'التنقل المدروس بين منصات العرض ومنطقة التفاعل',
        'استخدام اليدين للتوضيح والتأكيد على النقاط المهمة',
        'تعابير الوجه المتفاعلة مع المحتوى والأسئلة',
      ],
    },
  },
  pupils: {
    definition: {
      title: 'ما هو التعبير الشفهي؟',
      description: 'التعبير الشفهي هو أن تتحدث أمام الناس وتشرح لهم أفكارك بوضوح وثقة، مثل عندما تقدم عرضاً في الصف أو تشارك في مسابقة.',
      details: [
        'هو مهارة تساعدك على التحدث بثقة أمام زملائك ومعلميك',
        'يعني أن تنظم أفكارك قبل أن تتحدث',
        'يساعدك على توصيل رسالتك بشكل واضح ومفهوم',
        'هو أداة مهمة لنجاحك في المدرسة وحياتك المستقبلية',
      ],
      tips: [
        'لا تخف من التحدث، كلنا نتعلم بالممارسة',
        'حضّر ما ستقوله قبل أن تقف أمام الجمهور',
        'تحدّث ببطء ووضوح',
      ],
    },
    types: {
      title: 'أنواع العرض الشفهي',
      description: 'أشكال مختلفة للتحدث أمام الجمهور يمكنك التدرب عليها.',
      details: [
        'عرض الصف: تقديم موضوع دراسي أمام زملائك',
        'المسابقة: المشاركة في مسابقات الإلقاء والخطابة',
        'القراءة الجهرية: قراءة نص بصوت واضح ومعبر',
        'الحوار المدرسي: المشاركة في نقاش أو حوار مع الزملاء',
        'الإذاعة المدرسية: تقديم فقرة في الإذاعة الصباحية',
      ],
    },
    skills: {
      title: 'مهارات تساعدك على العرض الشفهي',
      description: 'مهارات يمكنك تعلمها وتطويرها لتصبح متحدثاً أفضل.',
      details: [
        'نطق الكلمات بوضوح وصوت مسموع',
        'النظر إلى زميلائك أثناء الحديث',
        'ترتيب أفكارك قبل البدء في الكلام',
        'الابتسامة والثقة بالنفس',
        'الاستماع الجيد لأسئلة المعلم والزملاء',
        'الرد على الأسئلة بهدوء وثقة',
      ],
      tips: [
        'تدرّب في البيت أمام أهلك',
        'ابدأ بالمواضيع السهلة التي تحبها',
        'تنفس بعمق قبل البدء في العرض',
      ],
    },
    creative: {
      title: 'كيف تكون مبدعاً في إلقائك؟',
      description: 'نصائح لجعل عرضك ممتعاً ومميزاً.',
      details: [
        'استخدم القصص والأمثلة لتوضيح أفكارك',
        'غيّر نبرة صوتك لتكون ممتعاً ومثيراً',
        'اطرح أسئلة على زميلائك ليشتركوا معك',
        'استخدم صوراً ورسوماً لتساعدك في الشرح',
        'اختم بكلمة قوية يذكرها الجميع',
      ],
    },
    bodyLanguage: {
      title: 'لغة الجسد',
      description: 'كيف يتحرك جسمك وأنت تتحدث، وهذا مهم جداً!',
      details: [
        'انظر إلى زميلائك ولا تنظر إلى الأرض',
        'ابتسم فهذا يخفف التوتر عنك وعنهم',
        'حرّك يديك بشكل طبيعي لتوضيح كلامك',
        'قف مستقيماً بكتفين مفتوحتين',
        'لا تلعب بقلمك أو بملابسك أثناء الحديث',
      ],
      tips: [
        'تدرّب أمام المرآة',
        'اطلب من معلمك نصائح حول لغة جسدك',
        'شاهد متحدثين جيدين وتعلم منهم',
      ],
    },
  },
}

const audienceTabs: { id: TargetAudience; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { id: 'students', label: 'الطلبة', icon: <GraduationCap className="h-5 w-5" />, description: 'محتوى مخصص للطلبة الجامعيين', color: 'from-primary to-emerald-800' },
  { id: 'professors', label: 'الأساتذة الجامعيين', icon: <Users className="h-5 w-5" />, description: 'محتوى مخصص للأساتذة والأكاديميين', color: 'from-amber-500 to-amber-700' },
  { id: 'pupils', label: 'التلاميذ', icon: <School className="h-5 w-5" />, description: 'محتوى مبسط وتطبيقي للتلاميذ', color: 'from-teal-500 to-teal-700' },
]

const sectionIcons: Record<string, React.ReactNode> = {
  definition: <MessageCircle className="h-5 w-5" />,
  types: <BookOpen className="h-5 w-5" />,
  skills: <Lightbulb className="h-5 w-5" />,
  creative: <Sparkles className="h-5 w-5" />,
  bodyLanguage: <Hand className="h-5 w-5" />,
}

const sectionColors: Record<string, string> = {
  definition: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  types: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  skills: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  creative: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  bodyLanguage: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
}

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

export default function OralExpressionSection() {
  const [activeAudience, setActiveAudience] = useState<TargetAudience>('students')
  const { bookmarks, toggleBookmark, isBookmarked } = useAppStore()

  const activeTabData = audienceTabs.find(t => t.id === activeAudience)!

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <SectionHeader
        title="التحرير الشفهي"
        description="قسم متخصص في مهارات التحرير الشفهي، اختر الفئة المناسبة لك واستكشف المحتوى التعليمي"
        icon={<Mic className="h-9 w-9" />}
        gradient="from-teal-500 to-teal-700"
        shareTitle="التحرير الشفهي - التحرير الكتابي والشفهي"
      />

      {/* Audience Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeAudience} onValueChange={(v) => setActiveAudience(v as TargetAudience)}>
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            {audienceTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {audienceTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-8">
              {/* Audience Description */}
              <Card className="border-0 shadow-sm bg-gradient-to-l from-teal-50 to-transparent dark:from-teal-950/20 mb-8">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">{tab.description}</p>
                </CardContent>
              </Card>

              {/* Content Sections */}
              <div className="space-y-4">
                {Object.entries(contentByAudience[tab.id]).map(([key, section]) => (
                  <Card key={key} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative group">
                    {/* Color bar top */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l from-teal-400 to-teal-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <Accordion type="single" collapsible>
                      <AccordionItem value={key} className="border-0">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sectionColors[key]}`}>
                              {sectionIcons[key]}
                            </div>
                            <div className="text-right flex-1">
                              <h3 className="font-bold text-base">{section.title}</h3>
                            </div>
                            {/* Bookmark */}
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(`oral-${tab.id}-${key}`); }}
                              className="p-1 rounded hover:bg-muted transition-colors"
                              title={isBookmarked(`oral-${tab.id}-${key}`) ? 'إزالة من المحفوظات' : 'حفظ المحتوى'}
                            >
                              {isBookmarked(`oral-${tab.id}-${key}`) ? (
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <Bookmark className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                            <Separator />
                            <ul className="space-y-3">
                              {section.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                                  <span className="text-sm text-foreground leading-relaxed">{detail}</span>
                                </li>
                              ))}
                            </ul>
                            {section.tips && section.tips.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    نصائح عملية
                                  </h4>
                                  <ul className="space-y-2">
                                    {section.tips.map((tip, idx) => (
                                      <li key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                                        <ArrowLeft className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                        <span className="text-sm text-amber-900 dark:text-amber-200">{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
