'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { 
  Pen, Users, GraduationCap, School, BookOpen, 
  Lightbulb, Mic, FileText, ScrollText, 
  ClipboardList, MessageSquare, Briefcase, UserCheck, Newspaper, MessagesSquare,
  CheckCircle2, ArrowLeft, Bookmark, BookmarkCheck
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import SectionHeader from '@/components/SectionHeader'
import ShareButton from '@/components/ShareButton'
import { motion } from 'framer-motion'

type TargetAudience = 'students' | 'professors' | 'pupils'

interface TopicContent {
  title: string
  description: string
  details: string[]
  tips?: string[]
}

interface AudienceContent {
  [key: string]: TopicContent
}

const topics = [
  { key: 'oratory', label: 'الخطابة', icon: <Mic className="h-5 w-5" /> },
  { key: 'summary', label: 'التلخيص', icon: <ScrollText className="h-5 w-5" /> },
  { key: 'report', label: 'التقرير', icon: <ClipboardList className="h-5 w-5" /> },
  { key: 'textBuilding', label: 'بناء النص', icon: <FileText className="h-5 w-5" /> },
  { key: 'punctuation', label: 'علامات الترقيم', icon: <MessageSquare className="h-5 w-5" /> },
  { key: 'adminLetters', label: 'الرسائل الإدارية', icon: <Briefcase className="h-5 w-5" /> },
  { key: 'cv', label: 'السيرة الذاتية', icon: <UserCheck className="h-5 w-5" /> },
  { key: 'essay', label: 'المقال', icon: <Newspaper className="h-5 w-5" /> },
  { key: 'intervention', label: 'المداخلة', icon: <MessagesSquare className="h-5 w-5" /> },
]

const contentByAudience: Record<TargetAudience, AudienceContent> = {
  students: {
    oratory: {
      title: 'فن الخطابة',
      description: 'الخطابة فن إقناع الجمهور من خلال الكلمة المنطوقة المبنية على حجج وأدلة، وهي من أعرق فنون التحرير الكتابي والشفهي.',
      details: [
        'أركان الخطبة: المقدمة، الموضوع، الخاتمة',
        'أنواع الخطبة: السياسية، الدينية، الاجتماعية، الأكاديمية',
        'شروط الخطيب: الإلمام بالموضوع، قوة الحجة، حسن الإلقاء',
        'أساليب الإقناع: المنطق، العاطفة، السلطة الأخلاقية',
        'بناء الحجة: المقدمة → العرض → الاستنتاج',
        'تقنيات الخطابة المؤثرة: التكرار، الاستفهام، النداء، التشبيه',
      ],
      tips: [
        'اقرأ الخطب التاريخية والعصرية لتبني حصيلتك',
        'تدرّب على كتابة خطبة كاملة قبل إلقائها',
        'اختر موضوعات تهم جمهورك وتتفاعل معها',
      ],
    },
    summary: {
      title: 'فن التلخيص',
      description: 'التلخيص مهارة أكاديمية أساسية تتضمن استخراج الأفكار الرئيسية من نص طويل وإعادة صياغتها بأسلوب موجز مع الحفاظ على المعنى الأصلي.',
      details: [
        'خطوات التلخيص: القراءة المتأنية → تحديد الأفكار الرئيسية → إعادة الصياغة',
        'قاعدة الثلث: يكون الملخص عادة ثلث النص الأصلي',
        'شروط التلخيص الجيد: الدقة، الموضوعية، الترابط، الإيجاز',
        'تجنب: إسقاط أفكار مهمة، إضافة آراء شخصية، نسخ النص حرفياً',
        'استخدم أدوات الربط المناسبة لضمان تسلسل الأفكار',
      ],
      tips: [
        'تدرّب على تلخيص نصوص من مجالات مختلفة',
        'لا تبدأ بالتلخيص قبل فهم النص بالكامل',
        'راجع ملخصك وقارنه بالنص الأصلي',
      ],
    },
    report: {
      title: 'كتابة التقرير',
      description: 'التقرير وثيقة مكتوبة تقدم معلومات وحقائق حول موضوع محدد بناءً على بحث أو دراسة أو ملاحظة.',
      details: [
        'أنواع التقارير: الأكاديمية، الإدارية، العلمية، الميدانية',
        'بنية التقرير: صفحة العنوان، المقدمة، المبحث، الخاتمة، المراجع',
        'خصائص التقرير الجيد: الموضوعية، الدقة، الوضوح، الترتيب المنطقي',
        'لغة التقرير: رسمية، مباشرة، خالية من العاطفية',
        'دعم التقرير بالبيانات والأرقام والجداول والرسوم البيانية',
      ],
      tips: [
        'حدد هدف التقرير قبل البدء في كتابته',
        'استخدم العناوين الفرعية لتسهيل القراءة',
        'راجع التقرير عدة مرات قبل تسليمه',
      ],
    },
    textBuilding: {
      title: 'بناء النص',
      description: 'فن بناء النص هو القدرة على تنظيم الأفكار والترابط بينها في نسق لغوي متماسك يحقق الغاية التواصلية.',
      details: [
        'عناصر بناء النص: التماسك (الربط)، الاتساق (المنطق)، المقصدية',
        'أنواع النصوص: السردي، الوصفي، الحجاجي، التفسيري، الإرشادي',
        'أدوات الربط: الواو، الفاء، ثم، لكن، لأن، لذلك، بالتالي...',
        'بنية النص: المدخل، العرض، الخاتمة',
        'مراحل بناء النص: التخطيط، الكتابة، المراجعة، التعديل',
      ],
      tips: [
        'ابدأ بوضع مخطط لنصك قبل الكتابة',
        'تأكد من تسلسل الأفكار منطقياً',
        'استخدم أدوات ربط مناسبة بين الفقرات',
      ],
    },
    punctuation: {
      title: 'علامات الترقيم',
      description: 'مجموعة الرموز المستخدمة في الكتابة لتنظيم النص وتوضيح المعاني وتحديد بنية الجمل.',
      details: [
        'النقطة (.) : نهاية الجملة التامة',
        'الفاصلة (،) : الفصل بين أجزاء الجملة',
        'الفاصلة المنقوطة (؛) : الربط بين جملتين مرتبطتين',
        'النقطتان (:) : التوضيح أو التفصيل بعد إجمال',
        'علامة الاستفهام (؟) : نهاية الجملة الاستفهامية',
        'علامة التعجب (!) : نهاية الجملة التعجبية أو النداء',
        'القوسان () : الإضافة أو التوضيح',
        'الشرطة (-) : الفصل أو التعداد',
        'علامات التنصيص «» : نقل النصوص حرفياً',
      ],
      tips: [
        'تدرّب على وضع علامات الترقيم في نصوص مختلفة',
        'اقرأ نصوصاً أدبية ولاحظ كيف يستخدم الكتاب علامات الترقيم',
        'انتبه إلى أن الخطأ في الترقيم قد يغير المعنى',
      ],
    },
    adminLetters: {
      title: 'الرسائل الإدارية',
      description: 'المراسلات الإدارية والمهنية هي وسيلة التواصل الرسمية بين المؤسسات والأفراد في السياق المهني.',
      details: [
        'أنواع الرسائل: الطلب، الشكوى، الاعتذار، الشكر، التوصية',
        'بنية الرسالة الإدارية: الترويسة، الموضوع، التحية، المتن، الخاتمة، التوقيع',
        'لغة الرسالة: رسمية، مهذبة، موجزة، واضحة',
        'شروط الرسالة الناجحة: تحديد الهدف، احترام التسلسل، وضوح العبارات',
        'نماذج شائعة: طلب توظيف، طلب إجازة، تقرير حادث',
      ],
      tips: [
        'احتفظ بنماذج جاهزة للرسائل المتكررة',
        'راجع الرسالة قبل إرسالها للتحقق من الأخطاء',
        'كن مهذباً ومباشراً في آن واحد',
      ],
    },
    cv: {
      title: 'كتابة السيرة الذاتية',
      description: 'السيرة الذاتية وثيقة تُلخّص المؤهلات والمهارات والخبرات المهنية للفرد بهدف التقدم لفرصة عمل أو قبول أكاديمي.',
      details: [
        'أقسام السيرة الذاتية: المعلومات الشخصية، التعليم، الخبرات، المهارات، اللغات',
        'أنواع السيرة الذاتية: الزمنية، الوظيفية، المختلطة',
        'قواعد الكتابة: الصدق، الوضوح، الإيجاز، التنظيم',
        'تجنب: المبالغة، المعلومات غير ذات الصلة، الأخطاء اللغوية',
        'خصص سيرتك الذاتية لكل وظيفة تتقدم لها',
        'أرفق رسالة تعريفية مع سيرتك الذاتية',
      ],
      tips: [
        'استخدم قالب نظيف ومنظم',
        'ركز على الإنجازات وليس فقط المهام',
        'راجع السيرة الذاتية عدة مرات',
      ],
    },
    essay: {
      title: 'فن كتابة المقال',
      description: 'المقال نص نثري يتناول موضوعاً معيناً بأسلوب حُر يعرض فيه الكاتب رأيه أو يحلل ظاهرة أو يناقش فكرة.',
      details: [
        'أنواع المقال: الأدبي، العلمي، النقدي، الفلسفي، الصحفي',
        'بنية المقال: المقدمة (التمهيد)، العرض (المناقشة)، الخاتمة (الاستنتاج)',
        'خصائص المقال الجيد: الوضوح، الترابط، الأصالة، الإقناع',
        'مراحل الكتابة: اختيار الموضوع، جمع المادة، الصياغة، المراجعة',
        'أساليب التحرير: الاستقراء، الاستنتاج، المقارنة، التحليل',
      ],
      tips: [
        'اختر موضوعاً تعرف عنه جيداً',
        'ابدأ بمخطط واضح للمقال',
        'دعم آراءك بأمثلة وحجج قوية',
      ],
    },
    intervention: {
      title: 'فن المداخلة',
      description: 'المداخلة مساهمة شفهية أو كتابية في نقاش أو حوار جماعي حول موضوع محدد، تُقدم فيها وجهة نظر مدعومة بالحجج.',
      details: [
        'أنواع المداخلة: النقدية، التأييدية، الاقتراحية، الاستفسارية',
        'بنية المداخلة: التمهيد، عرض الفكرة، الاستدلال، الخاتمة',
        'شروط المداخلة الناجحة: الإيجاز، الوضوح، الارتباط بالموضوع',
        'مهارات المداخل: حسن الاستماع، سرعة البديهة، دقة التعبير',
        'آداب المداخلة: احترام الرأي الآخر، عدم المقاطعة، الموضوعية',
      ],
      tips: [
        'استمع جيداً قبل أن تتدخل',
        'كن مختصراً ومباشراً',
        'اربط مداخلتك بما قيل قبلك',
      ],
    },
  },
  professors: {
    oratory: {
      title: 'الخطابة الأكاديمية',
      description: 'فن الخطابة في السياق الأكاديمي الجامعي، بما يشمل المحاضرات الافتتاحية والكلمات الرسمية والمشاركة في المؤتمرات.',
      details: [
        'الخطابة الأكاديمية: تقديم الكلمات الافتتاحية والختامية في المؤتمرات والندوات',
        'أساليب الإقناع العلمي: الاستدلال المنطقي، البرهنة، الاستقراء',
        'بناء الخطبة الأكاديمية: التمهيد العلمي، عرض الحجج، التركيب',
        'الفرق بين الخطابة والمحاضرة الأكاديمية',
        'توظيف البلاغة العربية في الخطابة الجامعية المعاصرة',
      ],
    },
    summary: {
      title: 'التلخيص في البحث العلمي',
      description: 'مهارة التلخيص في السياق البحثي الأكاديمي، بما يشمل تلخيص الدراسات والأبحاث وتقارير المشاريع.',
      details: [
        'تلخيص المراجع العلمية: استخراج أهداف الدراسة ومنهجيتها ونتائجها',
        'المستخلص (Abstract): تلخيص البحث في حدود 250 كلمة',
        'تلخيص تقارير المشاريع البحثية',
        'شروط التلخيص الأكاديمي: الأمانة العلمية، الدقة، الموضوعية',
        'أدوات التلخيص الحديثة وتوظيفها في البحث',
      ],
    },
    report: {
      title: 'التقارير الأكاديمية والعلمية',
      description: 'كتابة التقارير في السياق الأكاديمي والأبحاث العلمية.',
      details: [
        'تقارير الأبحاث الميدانية والتجريبية',
        'التقارير السنوية للأقسام والكليات',
        'تقارير المشاريع البحثية والتقييمية',
        'المعايير الدولية لكتابة التقارير العلمية (APA, MLA)',
        'تقنيات عرض البيانات في التقارير العلمية',
      ],
    },
    textBuilding: {
      title: 'بناء النص الأكاديمي',
      description: 'فن بناء النصوص الأكاديمية الرصينة وفق المناهج العلمية المعتمدة.',
      details: [
        'بناء البحث الأكاديمي: المشكلة، الإطار النظري، المنهجية، النتائج',
        'الترابط النصي في الكتابة الأكاديمية',
        'توظيف أدوات الربط في النص العلمي',
        'معايير الكتابة الأكاديمية: الموضوعية، الدقة، التوثيق',
        'أساليب الاقتباس والتوثيق في بناء النص الأكاديمي',
      ],
    },
    punctuation: {
      title: 'علامات الترقيم في الكتابة الأكاديمية',
      description: 'الاستخدام المتقدم لعلامات الترقيم في النصوص الأكاديمية والعلمية.',
      details: [
        'أهمية الترقيم الدقيق في النصوص العلمية',
        'الترقيم والمعنى: كيف يغير موضع الفاصلة المعنى',
        'علامات التنصيص والاقتباس في البحوث',
        'الأقواس واستخداماتها في الشروح والتعليقات',
        'الترقيم في المراجع والهوامش',
      ],
    },
    adminLetters: {
      title: 'المراسلات الإدارية الجامعية',
      description: 'فنون المراسلات الإدارية في المؤسسات الجامعية والأكاديمية.',
      details: [
        'المكاتبات الرسمية بين الأقسام والكليات',
        'التقارير الإدارية والمذكرات الداخلية',
        'مراسلات البعثات والمنح الدراسية',
        'طلبات الترقية والتقييم الأكاديمي',
        'صياغة القرارات والتعاميم الجامعية',
      ],
    },
    cv: {
      title: 'السيرة الذاتية الأكاديمية',
      description: 'إعداد السيرة الذاتية وفق المعايير الأكاديمية الدولية.',
      details: [
        'السيرة الذاتية الأكاديمية: البحوث، المنشورات، الإشراف، التدريس',
        'ملف الإنجاز الأكاديمي (Portfolio)',
        'عرض البحوث والمنشورات بشكل منهجي',
        'التوصيات ورسائل التزكية الأكاديمية',
        'تحديث السيرة الذاتية باستمرار مع كل إنجاز جديد',
      ],
    },
    essay: {
      title: 'المقال الأكاديمي والعلمي',
      description: 'كتابة المقالات في المجلات العلمية المحكّمة والمنشورات الأكاديمية.',
      details: [
        'المقال العلمي المحكّم: البنية والمعايير',
        'كتابة مقالات الرأي الأكاديمي',
        'المقال المرجعي (Review Article)',
        'معايير النشر في المجلات العلمية',
        'مراجعة الأقران (Peer Review) وتقنيات الكتابة لها',
      ],
    },
    intervention: {
      title: 'المداخلة في المؤتمرات والندوات',
      description: 'فن المشاركة بمداخلات علمية في المؤتمرات والندوات الأكاديمية.',
      details: [
        'إعداد المداخلة العلمية: البحث، التنظيم، التقديم',
        'إدارة الجلسات العلمية وتوجيه النقاش',
        'الرد على التعليقات والأسئلة بشكل أكاديمي',
        'نشر المداخلات في أعمال المؤتمرات',
        'المداخلة الافتتاحية والختامية',
      ],
    },
  },
  pupils: {
    oratory: {
      title: 'الخطابة',
      description: 'الخطابة هي فن التحدث أمام الناس لإقناعهم بشيء ما، مثل خطبة الجمعة أو كلمة في حفل مدرسي.',
      details: [
        'الخطبة تتكون من: مقدمة، موضوع، وخاتمة',
        'يجب أن يكون الخطيب واثقاً من نفسه ومن كلامه',
        'استخدم أمثلة وقصص لتقوية كلامك',
        'تحدث بصوت واضح ومسموع',
        'انظر إلى جمهورك ولا تنظر إلى الورقة فقط',
      ],
      tips: [
        'تدرّب على إلقاء خطبة قصيرة أمام أهلك',
        'اختر موضوعاً تحبه وتعرف عنه الكثير',
        'لا تتعجل في الكلام، تحدث بهدوء',
      ],
    },
    summary: {
      title: 'التلخيص',
      description: 'التلخيص يعني أن تأخذ نصاً طويلاً وتكتب أهم ما فيه بكلماتك أنت، مع الحفاظ على المعنى.',
      details: [
        'اقرأ النص كاملاً أولاً لتفهمه',
        'حدد الأفكار الرئيسية في كل فقرة',
        'اكتب الأفكار بكلماتك أنت، لا تنسخ من النص',
        'اجعل الملخص أقصر بكثير من النص الأصلي',
        'لا تنسَ أي فكرة مهمة',
      ],
      tips: [
        'استخدم أقلاماً ملونة لتحديد الأفكار المهمة',
        'تدرّب على تلخيص مقالات من الصحف',
      ],
    },
    report: {
      title: 'كتابة التقرير',
      description: 'التقرير هو وثيقة تكتبها لتخبر فيها عن شيء ما، مثل رحلة مدرسية أو تجربة علمية.',
      details: [
        'ابدأ بعنوان واضح يبين موضوع التقرير',
        'اكتب مقدمة تشرح ماذا سيكون في التقرير',
        'اعرض المعلومات بشكل منظم مع عناوين فرعية',
        'اختم بخلاصة تلخص أهم ما توصلت إليه',
        'استخدم صوراً وجداول إذا احتجت',
      ],
      tips: [
        'اكتب التقرير فوراً بعد الحدث أو التجربة',
        'اطلب من معلمك مراجعة تقريرك',
      ],
    },
    textBuilding: {
      title: 'بناء النص',
      description: 'بناء النص يعني كيف تنظم أفكارك وتكتبها بشكل مرتب ومترابط.',
      details: [
        'ابدأ بمقدمة تجذب القارئ',
        'اعرض أفكارك واحدة بعد الأخرى بشكل منطقي',
        'اربط بين الجمل والفقرات بكلمات مثل: ثم، لكن، لأن، لذلك',
        'اختم بخاتمة تلخص أهم ما قلته',
        'راجع ما كتبته وتأكد أنه واضح ومفهوم',
      ],
    },
    punctuation: {
      title: 'علامات الترقيم',
      description: 'علامات الترقيم هي رموز تساعدنا على فهم الكتابة بشكل صحيح، مثل النقطة والفاصلة.',
      details: [
        'النقطة (.) : نضعها في نهاية الجملة',
        'الفاصلة (،) : نضعها بين أجزاء الجملة',
        'علامة الاستفهام (؟) : نضعها في نهاية السؤال',
        'علامة التعجب (!) : نضعها بعد التعجب أو النداء',
        'القوسان () : نضع بينهما معلومة إضافية',
      ],
      tips: [
        'تدرّب على وضع علامات الترقيم في نصوص مختلفة',
        'انتبه: النقطة في غير مكانها قد تغير المعنى!',
      ],
    },
    adminLetters: {
      title: 'كتابة الرسائل',
      description: 'تعلّم كيف تكتب رسائل رسمية مهذبة، مثل رسالة طلب أو شكر.',
      details: [
        'ابدأ بالتاريخ والمكان',
        'اكتب اسم الشخص الذي ترسل إليه الرسالة',
        'اكتب موضوع الرسالة باختصار',
        'اكتب محتوى الرسالة بلغة مهذبة وواضحة',
        'اختم بتحية وتوقيعك',
      ],
      tips: [
        'استخدم لغة رسمية ومهذبة',
        'اجعل رسالتك قصيرة ومباشرة',
      ],
    },
    cv: {
      title: 'السيرة الذاتية',
      description: 'السيرة الذاتية هي ورقة تكتب فيها معلومات عنك، مثل تعليمك ومهاراتك، لتقدمها عند البحث عن عمل أو تدريب.',
      details: [
        'اكتب اسمك ومعلومات الاتصال بك',
        'اذكر دراستك ومؤهلاتك',
        'اذكر مهاراتك (مثل: الحاسوب، اللغات)',
        'اذكر أي خبرة عمل أو تطوع لديك',
        'كن صادقاً ولا تبالغ في ما تكتبه',
      ],
      tips: [
        'اجعل سيرتك الذاتية مرتبة ونظيفة',
        'اطلب من أهلك أو معلمك مراجعتها',
      ],
    },
    essay: {
      title: 'كتابة المقال',
      description: 'المقال هو نص تكتبه لتعبر فيه عن رأيك في موضوع معين بطريقة منظمة.',
      details: [
        'اختر موضوعاً يهمك وتعرف عنه',
        'ابدأ بمقدمة تجذب القارئ',
        'اعرض رأيك وأدعمه بأمثلة وحجج',
        'لا تنسَ ذكر الرأي المعاكس والرد عليه',
        'اختم بخاتمة تلخص رأيك بوضوح',
      ],
      tips: [
        'اقرأ مقالات كثيرة لتتعلم الأسلوب',
        'تدرّب على كتابة مقال قصير كل أسبوع',
      ],
    },
    intervention: {
      title: 'المداخلة',
      description: 'المداخلة هي أن تشارك برأيك في نقاش أو حوار مع زملائك أو في حصة دراسية.',
      details: [
        'استمع جيداً لما يقوله الآخرون قبل أن تتكلم',
        'اربط مداخلتك بما قيل قبلك',
        'كن مختصراً وواضحاً',
        'ادعم رأيك بأمثلة',
        'احترم رأي الآخرين حتى لو اختلفوا معك',
      ],
      tips: [
        'لا تخف من المشاركة، رأيك مهم!',
        'فكّر قليلاً قبل أن تتكلم',
      ],
    },
  },
}

const audienceTabs: { id: TargetAudience; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'students', label: 'الطلبة', icon: <GraduationCap className="h-5 w-5" />, description: 'محتوى أكاديمي مخصص للطلبة الجامعيين' },
  { id: 'professors', label: 'الأساتذة الجامعيين', icon: <Users className="h-5 w-5" />, description: 'محتوى متقدم مخصص للأساتذة والأكاديميين' },
  { id: 'pupils', label: 'التلاميذ', icon: <School className="h-5 w-5" />, description: 'محتوى مبسط وتطبيقي للتلاميذ' },
]

const topicColors: Record<string, string> = {
  oratory: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  summary: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  report: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  textBuilding: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  punctuation: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  adminLetters: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  cv: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  essay: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  intervention: 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
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

export default function WrittenExpressionSection() {
  const [activeAudience, setActiveAudience] = useState<TargetAudience>('students')
  const { bookmarks, toggleBookmark, isBookmarked } = useAppStore()

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <SectionHeader
        title="التحرير الكتابي"
        description="قسم متخصص في مهارات التحرير الكتابي، اختر الفئة المناسبة لك واستكشف المحتوى التعليمي"
        icon={<Pen className="h-9 w-9" />}
        gradient="from-primary to-emerald-800"
        shareTitle="التحرير الكتابي - التحرير الكتابي والشفهي"
      />

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">عدد الموضوعات:</span>
            <span className="font-bold">9</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <BookmarkCheck className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">المحفوظة:</span>
            <span className="font-bold">{bookmarks.filter(b => b.startsWith('written-')).length}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">3 فئات مستهدفة</span>
          </div>
        </div>
      </motion.div>

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
            <Card className="border-0 shadow-sm bg-gradient-to-l from-primary/5 to-transparent mb-8">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{tab.description}</p>
              </CardContent>
            </Card>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {topics.map((topic) => {
                const topicContent = contentByAudience[tab.id][topic.key]
                if (!topicContent) return null
                const isSaved = isBookmarked(`written-${tab.id}-${topic.key}`)
                return (
                  <Card key={topic.key} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l from-primary to-emerald-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${topicColors[topic.key] || 'bg-primary/10 text-primary'}`}>
                        {topic.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm">{topic.label}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{topicContent.title}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(`written-${tab.id}-${topic.key}`); }}
                        className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                        title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المحتوى'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Detailed Content */}
            <div className="space-y-4">
              {topics.map((topic) => {
                const topicContent = contentByAudience[tab.id][topic.key]
                if (!topicContent) return null
                const isSaved = isBookmarked(`written-${tab.id}-${topic.key}`)
                return (
                  <Card key={topic.key} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l from-primary to-emerald-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <Accordion type="single" collapsible>
                      <AccordionItem value={topic.key} className="border-0">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${topicColors[topic.key] || 'bg-primary/10 text-primary'}`}>
                              {topic.icon}
                            </div>
                            <div className="text-right flex-1">
                              <h3 className="font-bold text-base">{topicContent.title}</h3>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(`written-${tab.id}-${topic.key}`); }}
                              className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                              title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المحتوى'}
                            >
                              {isSaved ? (
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <Bookmark className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">{topicContent.description}</p>
                            <Separator />
                            <ul className="space-y-3">
                              {topicContent.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                  <span className="text-sm text-foreground leading-relaxed">{detail}</span>
                                </li>
                              ))}
                            </ul>
                            {topicContent.tips && topicContent.tips.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    نصائح عملية
                                  </h4>
                                  <ul className="space-y-2">
                                    {topicContent.tips.map((tip, idx) => (
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
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      </motion.div>
    </motion.div>
  )
}
