'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Clock, CheckCircle2, XCircle, ArrowLeft,
  RotateCcw, Share2, Star, Trophy, Mic, Pen,
  Sparkles, ChevronLeft, Lightbulb, Award,
  BookOpen, Target, Zap, MessageCircle
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizCategory {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  gradientFrom: string
  gradientTo: string
  bgLight: string
  bgDark: string
  borderColor: string
  textColor: string
  questions: QuizQuestion[]
}

type QuizState = 'category' | 'question' | 'results'

// ─── Quiz Data ────────────────────────────────────────────────────
const quizCategories: QuizCategory[] = [
  {
    id: 'oral',
    title: 'التحرير الشفهي',
    description: 'اختبر معلوماتك في مهارات العرض والإلقاء والتعبير الشفهي',
    icon: Mic,
    color: 'text-emerald-600 dark:text-emerald-400',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-emerald-700',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    questions: [
      {
        id: 1,
        question: 'ما هو تعريف التعبير الشفهي؟',
        options: [
          'نقل الأفكار والمشاعر بالكتابة فقط',
          'نقل الأفكار والمشاعر بالكلام واللغة المنطوقة',
          'نقل الأفكار عبر لغة الإشارة فقط',
          'التعبير عن المشاعر بالرسم والفنون'
        ],
        correctIndex: 1,
        explanation: 'التعبير الشفهي هو عملية نقل الأفكار والمشاعر والآراء باستخدام الكلام واللغة المنطوقة، وهو مهارة أساسية في التواصل الفعّال.'
      },
      {
        id: 2,
        question: 'أي من التالي يُعدّ من أنواع العرض الشفهي؟',
        options: [
          'المقال التحليلي',
          'الرسالة الإدارية',
          'الخطابة والندوة',
          'التلخيص الكتابي'
        ],
        correctIndex: 2,
        explanation: 'الخطابة والندوة من أبرز أنواع العرض الشفهي، وتشمل أيضاً المحادثة والمناقشة والمحاورة والمشاركة في الحوار الجماعي.'
      },
      {
        id: 3,
        question: 'ما هي أهم مهارة يجب أن يتقنها المتحدث الناجح؟',
        options: [
          'الكتابة بسرعة',
          'الإلقاء الواضح والتواصل البصري',
          'الحفظ الأعمق للنص',
          'استخدام المفردات المعقدة'
        ],
        correctIndex: 1,
        explanation: 'الإلقاء الواضح والتواصل البصري من أهم المهارات التي يجب أن يتقنها المتحدث، فهما يساعدان على إيصال الرسالة بفعالية وإبقاء المستمعين منتبهين.'
      },
      {
        id: 4,
        question: 'ما دور لغة الجسد في العرض الشفهي؟',
        options: [
          'لا تأثير لها على المتلقي',
          'تُعقّد الرسالة المُراد إيصالها',
          'تُعزّز الرسالة وتُقوّي التأثير على المستمعين',
          'تُشتّت انتباه المستمعين فقط'
        ],
        correctIndex: 2,
        explanation: 'لغة الجسد تُعزّز الرسالة اللفظية وتُقوّي تأثيرها، فحركات اليدين وتعبيرات الوجه ووضعية الجسم كلها تساهم في إقناع المستمعين وجذب انتباههم.'
      },
      {
        id: 5,
        question: 'أي من التالي يُعدّ من أسس فن الخطابة؟',
        options: [
          'تجاهل ردود فعل الجمهور',
          'الإلقاء الرتيب بدون تغيير النبرة',
          'التمهيد ثم العرض ثم الخاتمة',
          'التحدث بسرعة كبيرة لإنهاء الموضوع'
        ],
        correctIndex: 2,
        explanation: 'من أسس فن الخطابة البناء المنطقي للخطاب: التمهيد (جذب الانتباه) ثم العرض (تقديم الأفكار) ثم الخاتمة (الخلاصة والدعوة للعمل).'
      },
      {
        id: 6,
        question: 'ما الفرق بين المحادثة والخطابة؟',
        options: [
          'لا فرق بينهما',
          'المحادثة ثنائية الطرف بينما الخطابة أحادية الطرف',
          'الخطابة أقصر من المحادثة',
          'المحادثة رسمية والخطابة غير رسمية'
        ],
        correctIndex: 1,
        explanation: 'المحادثة تبادل حواري بين طرفين أو أكثر، بينما الخطابة إلقاء أحادي من متحدث واحد إلى جمهور، مع إمكانية التفاعل في النهاية.'
      },
      {
        id: 7,
        question: 'كيف يمكن التغلب على رهبة المسرح قبل الإلقاء؟',
        options: [
          'تجنّب التحدث أمام الناس نهائياً',
          'التحضير الجيد والتدريب المستمر',
          'تناول المنبهات بكثرة',
          'قراءة النص بسرعة دون توقف'
        ],
        correctIndex: 1,
        explanation: 'التحضير الجيد والتدريب المستمر من أفضل الطرق للتغلب على رهبة المسرح، فالثقة تأتي من الإلمام بالموضوع والتمرّن على الإلقاء.'
      },
      {
        id: 8,
        question: 'ما هي الندوة؟',
        options: [
          'حوار بين شخصين فقط',
          'مسرحية تمثيلية تعليمية',
          'لقاء جماعي يتناول موضوعاً معيناً يشارك فيه متحدثون',
          'نوع من الكتابة الإبداعية'
        ],
        correctIndex: 2,
        explanation: 'الندوة هي لقاء جماعي يتناول موضوعاً محدداً، يشارك فيه عدّة متحدثين متخصصين، ويديرها رئيس يوجّه النقاش ويلخّص النتائج.'
      },
      {
        id: 9,
        question: 'أي مهارة تُعدّ أساسية في المناقشة الجماعية؟',
        options: [
          'مقاطعة الآخرين عند التحدث',
          'الاستماع الفعّال والردّ بأسلوب موضوعي',
          'فرض الرأي الشخصي بقوة',
          'الصمت التام طوال المناقشة'
        ],
        correctIndex: 1,
        explanation: 'الاستماع الفعّال والردّ بأسلوب موضوعي من أهم مهارات المناقشة الجماعية، فالمناقشة الناجحة تتطلب احترام آراء الآخرين والردّ عليها بمنطقية.'
      },
      {
        id: 10,
        question: 'ما أهمية التحضير قبل العرض الشفهي؟',
        options: [
          'لا أهمية له إذا كان المتحدث موهوباً',
          'يساعد على تنظيم الأفكار وإدارة الوقت بفعالية',
          'يُقلّل من عفوية المتحدث',
          'يُضيّع الوقت دون فائدة'
        ],
        correctIndex: 1,
        explanation: 'التحضير الجيد يساعد على تنظيم الأفكار وتسلسلها منطقياً، وإدارة الوقت بفعالية، والتنبؤ بالأسئلة المحتملة والإجابة عنها.'
      },
      {
        id: 11,
        question: 'ما المقصود بالإلقاء الإبداعي؟',
        options: [
          'إلقاء النصوص بشكل حرفي دون تغيير',
          'إلقاء يتضمن تخيّلاً وتشويقاً وأساليب بلاغية مؤثرة',
          'إلقاء يقتصر على قراءة الملاحظات',
          'إلقاء سريع لإنهاء الموضوع في أقصر وقت'
        ],
        correctIndex: 1,
        explanation: 'الإلقاء الإبداعي هو إلقاء يتضمن استخدام الخيال والتشويق والأساليب البلاغية المؤثرة كالاستعارة والكناية والمجاز لإيصال الرسالة بجمال وفعالية.'
      },
      {
        id: 12,
        question: 'أي من التالي يُحسّن من ثقة المتحدث بنفسه؟',
        options: [
          'التجنّب الدائم للتحدث أمام الآخرين',
          'المقارنة المستمرة مع المتحدثين المحترفين',
          'التعرف على نقاط القوة والضعف والعمل على تحسينها',
          'الاعتماد على الآخرين في إعداد العرض'
        ],
        correctIndex: 2,
        explanation: 'التعرف على نقاط القوة والضعف والعمل على تحسينها من أنجح الطرق لبناء الثقة بالنفس، فالتطوير المستمر يعزّز القدرات ويقلّل القلق.'
      },
      {
        id: 13,
        question: 'ما هو دور الصمت الإيجابي في العرض؟',
        options: [
          'يدلّ على نسيان المتحدث',
          'يُعطي المستمعين فرصة لاستيعاب المعلومات',
          'يُشتّت انتباه الجمهور',
          'يُظهر ضعف المتحدث'
        ],
        correctIndex: 1,
        explanation: 'الصمت الإيجابي أو الوقفات المخططة تُعطي المستمعين فرصة لاستيعاب المعلومات المقدّمة، وتُضفي على العرض إيقاعاً متوازناً ومؤثراً.'
      },
      {
        id: 14,
        question: 'كيف يمكن جذب انتباه الجمهور في بداية العرض؟',
        options: [
          'بدء العرض باعتذار طويل',
          'بدء العرض بسؤال مثير أو قصة قصيرة مشوّقة',
          'بدء العرض بقراءة قائمة طويلة من المعلومات',
          'بدء العرض بصمت طويل'
        ],
        correctIndex: 1,
        explanation: 'بدء العرض بسؤال مثير أو قصة قصيرة مشوّقة من أفضل الطرق لجذب انتباه الجمهور، فهذا يخلق فضولاً ويحفّز الاستماع الفعّال.'
      },
      {
        id: 15,
        question: 'ما هي أفضل طريقة لإنهاء عرض شفهي؟',
        options: [
          'التوقف فجأة دون خاتمة',
          'تلخيص النقاط الرئيسية والدعوة للعمل',
          'طرح أسئلة جديدة لم تُناقش',
          'الاعتذار عن الإطالة'
        ],
        correctIndex: 1,
        explanation: 'أفضل طريقة لإنهاء العرض هي تلخيص النقاط الرئيسية التي تمّت مناقشتها مع الدعوة للعمل، فهذا يعزّز الرسالة ويترك أثراً لدى المستمعين.'
      }
    ]
  },
  {
    id: 'written',
    title: 'التحرير الكتابي',
    description: 'اختبر معلوماتك في فنون الكتابة والتأليف والتعبير الكتابي',
    icon: Pen,
    color: 'text-amber-600 dark:text-amber-400',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-700',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
    questions: [
      {
        id: 1,
        question: 'ما هو فن الخطابة؟',
        options: [
          'فن كتابة الرسائل الإدارية',
          'فن التأثير في الجمهور بالكلام والإقناع',
          'فن تلخيص النصوص الطويلة',
          'فن كتابة التقارير العلمية'
        ],
        correctIndex: 1,
        explanation: 'فن الخطابة هو فن التأثير في الجمهور بالكلام والإقناع، وهو من أقدم فنون التعبير الكتابي والشفهي، يجمع بين البلاغة والمنطق والإقناع.'
      },
      {
        id: 2,
        question: 'ما هي أركان المقال الأساسية؟',
        options: [
          'العنوان فقط',
          'المقدمة والعرض والخاتمة',
          'الخاتمة فقط',
          'المقدمة والخاتمة فقط'
        ],
        correctIndex: 1,
        explanation: 'يتكوّن المقال من ثلاثة أركان أساسية: المقدمة (تقديم الموضوع وجذب القارئ)، العرض (تناول الأفكار بالتفصيل)، والخاتمة (تلخيص النتائج والخلاصة).'
      },
      {
        id: 3,
        question: 'ما هو التلخيص؟',
        options: [
          'إعادة كتابة النص بكلمات مختلفة بنفس الطول',
          'استخراج الأفكار الأساسية من النص بأسلوب مختصر',
          'نسخ النص الأصلي كما هو',
          'ترجمة النص إلى لغة أخرى'
        ],
        correctIndex: 1,
        explanation: 'التلخيص هو مهارة استخراج الأفكار الأساسية والرئيسية من النص الأصلي وإعادة صياغتها بأسلوب مختصر دون الإخلال بالمعنى.'
      },
      {
        id: 4,
        question: 'ما الفرق بين التقرير والمقال؟',
        options: [
          'لا فرق بينهما',
          'التقرير يعتمد على البيانات والحقائق بينما المقال يعتمد على الرأي والتحليل',
          'المقال أقصر من التقرير دائماً',
          'التقرير أدبي والمقال علمي'
        ],
        correctIndex: 1,
        explanation: 'التقرير يعتمد بشكل أساسي على البيانات والحقائق والإحصائيات ويكون موضوعياً، بينما المقال يعتمد على الرأي والتحليل والاستدلال وقد يكون ذاتياً.'
      },
      {
        id: 5,
        question: 'ما هي السيرة الذاتية؟',
        options: [
          'قصة خيالية عن حياة شخص',
          'وثيقة تُلخّص المؤهلات والخبرات المهنية لشخص',
          'مقال نقدي عن شخصية معروفة',
          'تقرير عن إنجازات شركة'
        ],
        correctIndex: 1,
        explanation: 'السيرة الذاتية هي وثيقة رسمية تُلخّص المؤهلات الأكاديمية والخبرات المهنية والمهارات لشخص، وتُستخدم عادةً عند التقديم للوظائف.'
      },
      {
        id: 6,
        question: 'أي من التالي يُعدّ من شروط الكتابة الإبداعية؟',
        options: [
          'استخدام مفردات معقدة وصعبة',
          'الأصالة والابتكار في طرح الأفكار',
          'تقليد الكتّاب المشهورين',
          'الكتابة بسرعة دون مراجعة'
        ],
        correctIndex: 1,
        explanation: 'من أهم شروط الكتابة الإبداعية الأصالة والابتكار في طرح الأفكار، أي تقديم رؤية جديدة ومختلفة تعبّر عن شخصية الكاتب وموهبته.'
      },
      {
        id: 7,
        question: 'ما هو المقال التحليلي؟',
        options: [
          'مقال يروي قصة خيالية',
          'مقال يفكّك ظاهرة أو مشكلة إلى عناصرها ويدرسها بعمق',
          'مقال يعرض وجهتي نظر متعارضة',
          'مقال يصف مناظر طبيعية'
        ],
        correctIndex: 1,
        explanation: 'المقال التحليلي هو مقال يفكّك ظاهرة أو مشكلة إلى عناصرها المكوّنة ويدرسها بعمق وتفصيل، بهدف الوصول إلى فهم أعمق وتقديم استنتاجات منطقية.'
      },
      {
        id: 8,
        question: 'ما هي الرسالة الإدارية؟',
        options: [
          'رسالة عاطفية بين صديقين',
          'مقال أدبي منشور في مجلة',
          'مراسلة رسمية بين جهات إدارية تخضع لقواعد محددة',
          'تدوينة على وسائل التواصل الاجتماعي'
        ],
        correctIndex: 2,
        explanation: 'الرسالة الإدارية هي مراسلة رسمية بين جهات إدارية أو مؤسسات، تخضع لقواعد وشكليات محددة من حيث البنية واللغة والتنسيق.'
      },
      {
        id: 9,
        question: 'ما هو المقال الجدلي؟',
        options: [
          'مقال يصف الأماكن السياحية',
          'مقال يدافع عن فكرة أو وجهة نظر بالحجج والبراهين',
          'مقال يروي أحداثاً تاريخية',
          'مقال يلخّص كتاباً معيّناً'
        ],
        correctIndex: 1,
        explanation: 'المقال الجدلي هو مقال يدافع عن فكرة أو وجهة نظر معيّنة باستخدام الحجج والبراهين المنطقية، بهدف إقناع القارئ بصحة الموقف المطروح.'
      },
      {
        id: 10,
        question: 'أي من التالي يُعدّ خطأ شائعاً في كتابة التقارير؟',
        options: [
          'استخدام لغة رسمية ودقيقة',
          'تقديم البيانات والأرقام بشكل واضح',
          'إغفال المصادر والمراجع',
          'تنظيم التقرير في أقسام منطقية'
        ],
        correctIndex: 2,
        explanation: 'إغفال المصادر والمراجع من الأخطاء الشائعة في كتابة التقارير، فالتقرير الجيد يجب أن يوثّق مصادره لضمان المصداقية وإمكانية التحقق.'
      },
      {
        id: 11,
        question: 'ما هي أهمية المراجعة والتصحيح في الكتابة؟',
        options: [
          'إضاعة للوقت لا فائدة منها',
          'تُحسّن جودة النص وتُقلّل الأخطاء',
          'تُغيّر معنى النص بالكامل',
          'تُطيل النص دون داعٍ'
        ],
        correctIndex: 1,
        explanation: 'المراجعة والتصحيح خطوة أساسية في عملية الكتابة، فهي تُحسّن جودة النص وتُقلّل الأخطاء اللغوية والنحوية وتضمن وضوح الأفكار وتسلسلها.'
      },
      {
        id: 12,
        question: 'ما هو البحث العلمي؟',
        options: [
          'مقال رأي قصير',
          'دراسة منهجية لمشكلة معيّنة بأسلوب علمي مُنظّم',
          'ملخص لكتاب منشور',
          'قصة أدبية عن عالم'
        ],
        correctIndex: 1,
        explanation: 'البحث العلمي هو دراسة منهجية لمشكلة أو ظاهرة معيّنة باستخدام أسلوب علمي مُنظّم، يهدف إلى الوصول إلى نتائج جديدة يمكن التحقق منها والبناء عليها.'
      },
      {
        id: 13,
        question: 'ما الفرق بين المقال والمداخلة؟',
        options: [
          'لا فرق بينهما',
          'المداخلة أقصر وتركّز على نقطة محددة، والمقال أشمل وأطول',
          'المقال شفهي والمداخلة كتابية',
          'المداخلة علمية فقط والمقال أدبي فقط'
        ],
        correctIndex: 1,
        explanation: 'المداخلة أقصر من المقال وتركّز على نقطة أو جانب محدد من موضوع ما، بينما المقال أشمل ويتناول الموضوع بتفصيل أكبر ويمكن أن يكون أطول.'
      },
      {
        id: 14,
        question: 'كيف تُكتب خاتمة فعّالة لمقال؟',
        options: [
          'بإضافة معلومات جديدة لم تُذكر في العرض',
          'بتلخيص النقاط الرئيسية وطرح توصية أو سؤال مفتوح',
          'بالتوقف فجأة دون خاتمة',
          'بإعادة كتابة المقدمة حرفياً'
        ],
        correctIndex: 1,
        explanation: 'الخاتمة الفعّالة تلخّص النقاط الرئيسية التي طُرحت في المقال، وتُقدّم توصية أو تطرح سؤالاً مفتوحاً يُحفّز القارئ على التفكير.'
      },
      {
        id: 15,
        question: 'أي من التالي يُعدّ من مبادئ الكتابة الأكاديمية؟',
        options: [
          'استخدام اللغة العامية لسهولة الفهم',
          'الموضوعية والدقة والمصادر الموثوقة',
          'نسخ الأفكار من مصادر متعددة دون توثيق',
          'الاعتماد على الرأي الشخصي فقط'
        ],
        correctIndex: 1,
        explanation: 'من أهم مبادئ الكتابة الأكاديمية: الموضوعية في الطرح، والدقة في المعلومات، والاعتماد على مصادر موثوقة مع توثيقها بشكل صحيح.'
      }
    ]
  },
  {
    id: 'general',
    title: 'مهارات عامة',
    description: 'اختبر معلوماتك في علامات الترقيم وقواعد الكتابة وأساليب التعبير',
    icon: BookOpen,
    color: 'text-teal-600 dark:text-teal-400',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-teal-700',
    bgLight: 'bg-teal-50',
    bgDark: 'dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-400',
    questions: [
      {
        id: 1,
        question: 'ما هي علامة الترقيم المستخدمة في نهاية الجملة الخبرية؟',
        options: [
          'علامة الاستفهام (؟)',
          'النقطة (.)',
          'علامة التعجب (!)',
          'الفاصلة (،)'
        ],
        correctIndex: 1,
        explanation: 'النقطة (.) تُستخدم في نهاية الجملة الخبرية التامّة، وتدلّ على انتهاء المعنى واكتمال الفكرة.'
      },
      {
        id: 2,
        question: 'متى تُستخدم الفاصلة المنقوطة (؛)؟',
        options: [
          'في نهاية كل جملة',
          'للفصل بين جملتين مرتبطتين في المعنى',
          'بعد كل حرف عطف',
          'في بداية الفقرة'
        ],
        correctIndex: 1,
        explanation: 'الفاصلة المنقوطة (؛) تُستخدم للفصل بين جملتين مرتبطتين في المعنى ومستقلّتين في الإعراب، وهي أقوى من الفاصلة العادية وأضعف من النقطة.'
      },
      {
        id: 3,
        question: 'ما الفرق بين الهمزة والألف في الكتابة العربية؟',
        options: [
          'لا فرق بينهما',
          'الألف ساكنة دائماً والهمزة متحرّكة وقد تقع في وسط الكلمة',
          'الهمزة تأتي في أول الكلمة فقط',
          'الألف تأتي في آخر الكلمة فقط'
        ],
        correctIndex: 1,
        explanation: 'الألف المدّية ساكنة دائماً وتأتي غالباً في بداية الكلمة أو وسطها، بينما الهمزة متحرّكة وقد تقع في أي موضع من الكلمة (أول، وسط، آخر).'
      },
      {
        id: 4,
        question: 'أي من التالي يُعدّ أسلوباً إنشائياً طلبياً؟',
        options: [
          'الأسلوب الخبري',
          'الأسلوب الاستفهامي',
          'الأمر والنهي',
          'أسلوب التعجب'
        ],
        correctIndex: 2,
        explanation: 'الأسلوب الإنشائي الطلبي يتضمّن: الأمر والنهي والاستفهام والتمني والنداء، والأمر والنهي من أوضح أنواع الأسلوب الإنشائي الطلبي.'
      },
      {
        id: 5,
        question: 'ما هي وظيفة علامتي التنصيص (« »)؟',
        options: [
          'الفصل بين الجمل',
          'إحاطة النصوص المقتبسة والعناوين',
          'التعجب من شيء',
          'إنهاء الفقرة'
        ],
        correctIndex: 1,
        explanation: 'علامتا التنصيص (« ») تُستخدمان لإحاطة النصوص المقتبسة حرفياً من مصدر آخر، وأيضاً لإحاطة عناوين الكتب والمقالات والقصائد.'
      },
      {
        id: 6,
        question: 'ما هو التشبيه في البلاغة العربية؟',
        options: [
          'تكرار نفس الكلمة مرتين',
          'عقد مشاركة بين شيئين بجامع مشترك',
          'إطلاق صفة خيالية على شيء',
          'تضاد بين معنيين'
        ],
        correctIndex: 1,
        explanation: 'التشبيه هو عقد مشاركة بين شيئين (المشبّه والمشبّه به) في صفة أو أكثر بجامع مشترك بينهما، مثل: العلم نور. وهو من أبرز أساليب التعبير البلاغي.'
      },
      {
        id: 7,
        question: 'متى تُكتب التاء المربوطة بدلاً من التاء المفتوحة؟',
        options: [
          'في جميع الكلمات دون استثناء',
          'في الأسماء المفردة وبعض الجموع التي تُنطق تاءً عند الوقف وهاءً عند الوصل',
          'في الأفعال الماضية فقط',
          'في الحروف فقط'
        ],
        correctIndex: 1,
        explanation: 'التاء المربوطة تُكتب في الأسماء المفردة وبعض جموع التكسير، وتُنطق تاءً عند الوصل وهاءً عند الوقف. بينما التاء المفتوحة تُنطق تاءً في الحالين.'
      },
      {
        id: 8,
        question: 'ما هو الاستعارة في البلاغة؟',
        options: [
          'استعارة كتاب من مكتبة',
          'تشبيه حُذف أحد طرفيه مع بقاء قرينة تدلّ عليه',
          'تكرار الكلمة لتأكيد المعنى',
          'تضاد بين معنيين متناقضين'
        ],
        correctIndex: 1,
        explanation: 'الاستعارة هي تشبيه بليغ حُذف أحد طرفيه (المشبّه أو المشبّه به) وأُبقيت قرينة تدلّ على المحذوف، مثل: بنى المجدَ (استعارة تصريحية).'
      },
      {
        id: 9,
        question: 'أي من التالي يُعدّ خطأ إملائياً شائعاً؟',
        options: [
          'كتابة الهمزة على ألف في أول الكلمة',
          'كتابة التاء المربوطة بدلاً من الهاء أو العكس',
          'استخدام النقطة في نهاية الجملة الخبرية',
          'وضع الفاصلة بين المعطوف والمعطوف عليه'
        ],
        correctIndex: 1,
        explanation: 'الخلط بين التاء المربوطة والهاء من أكثر الأخطاء الإملائية شيوعاً في الكتابة العربية، فالكثير يكتبونهما بشكل واحد دون التمييز بينهما.'
      },
      {
        id: 10,
        question: 'ما أهمية علامات الترقيم في النص المكتوب؟',
        options: [
          'للزينة والتجميل فقط',
          'تُوضّح المعنى وتُنظّم الجمل وتُرشد القارئ',
          'تُطيل النص وتزيد حجمه',
          'لا أهمية لها في الكتابة الحديثة'
        ],
        correctIndex: 1,
        explanation: 'علامات الترقيم تُوضّح المعنى وتُنظّم الجمل وتُرشد القارئ إلى نبرة النص وإيقاعه، وبدونها قد يختلط المعنى وتصبح القراءة صعبة ومربكة.'
      },
      {
        id: 11,
        question: 'ما هو الكناية في البلاغة؟',
        options: [
          'استعارة طويلة',
          'لفظ أُطلق وأُريد به لازم معناه مع جواز إرادة المعنى الأصلي',
          'تكرار نفس الكلمة بمعنيين مختلفين',
          'أسلوب سؤال لا يُراد به الجواب'
        ],
        correctIndex: 1,
        explanation: 'الكناية هي لفظ أُطلق وأُريد به لازم معناه مع جواز إرادة المعنى الأصلي، مثل: فلان كثير الرماد (كناية عن الكرم).'
      },
      {
        id: 12,
        question: 'ما هو أسلوب القصر في النص العربي؟',
        options: [
          'أسلوب حصر صفة في موصوف أو عكسه بأداة خاصة',
          'أسلوب كتابة الجمل القصيرة فقط',
          'أسلوب اختصار النصوص الطويلة',
          'أسلوب ترتيب الأفكار تصاعدياً'
        ],
        correctIndex: 0,
        explanation: 'أسلوب القصر هو حصر صفة في موصوف أو موصوف في صفة بأداة خاصة مثل "إنما" أو "لا... إلا"، وهو من الأساليب البلاغية المؤثرة في التعبير.'
      },
      {
        id: 13,
        question: 'ما الفرق بين الفاصلة (،) والنقطة (.)؟',
        options: [
          'لا فرق بينهما',
          'الفاصلة للفصل بين أجزاء الجملة والنقطة لنهاية الجملة التامة',
          'النقطة للفصل بين الكلمات والفاصلة للفصل بين الجمل',
          'الفاصلة في أول الجملة والنقطة في آخرها'
        ],
        correctIndex: 1,
        explanation: 'الفاصلة (،) تُستخدم للفصل بين أجزاء الجملة الواحدة أو بين جمل قصيرة مترابطة، بينما النقطة (.) تُستخدم لنهاية الجملة التامة المستقلة في المعنى.'
      },
      {
        id: 14,
        question: 'ما المقصود بالأسلوب الخبري؟',
        options: [
          'أسلوب يُستخدم للأمر والنهي فقط',
          'أسلوب يحمل معنى يمكن تصديقه أو تكذيبه',
          'أسلوب يُستخدم في السؤال فقط',
          'أسلوب يُستخدم في التعجب فقط'
        ],
        correctIndex: 1,
        explanation: 'الأسلوب الخبري هو الأسلوب الذي يحمل معنى يمكن تصديقه أو تكذيبه، أي أنه يُخبر عن شيء يمكن التحقق من صحته أو عدمها، وهو مقابل الأسلوب الإنشائي.'
      },
      {
        id: 15,
        question: 'ما هي الأفعال الخمسة في النحو العربي؟',
        options: [
          'أفعال الأمر فقط',
          'الأفعال المتصلة بواو الجماعة أو ألف الاثنين أو ياء المخاطبة',
          'الأفعال الماضية فقط',
          'الأفعال المجردة فقط'
        ],
        correctIndex: 1,
        explanation: 'الأفعال الخمسة هي كل فعل مضارع اتصل به ألف الاثنين أو واوالجماعة أو ياء المخاطبة، مثل: يكتبان، يكتبون، تكتبين. وعلامة رفعها ثبوت النون.'
      }
    ]
  }
]

// ─── Animation Variants ───────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] } },
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  }),
}

// ─── Timer Ring Component ─────────────────────────────────────────
function TimerRing({ seconds, maxSeconds }: { seconds: number; maxSeconds: number }) {
  const percentage = (seconds / maxSeconds) * 100
  const isLow = seconds <= 10
  const isCritical = seconds <= 5
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percentage / 100)

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke={isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#10b981'}
          strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      <span className={`absolute text-sm font-bold tabular-nums ${
        isCritical ? 'text-red-500 animate-pulse' : isLow ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
      }`}>
        {seconds}
      </span>
    </div>
  )
}

// ─── Circular Score Component ─────────────────────────────────────
function CircularScore({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  const getColor = () => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="-rotate-90" viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="currentColor"
          className="text-muted/20" strokeWidth="10"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={getColor()} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold number-pop"
          style={{ color: getColor() }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-muted-foreground mt-1">النتيجة</span>
      </div>
    </div>
  )
}

// ─── Stars Rating Component ───────────────────────────────────────
function StarsRating({ score }: { score: number }) {
  const stars = score >= 90 ? 5 : score >= 75 ? 4 : score >= 55 ? 3 : score >= 35 ? 2 : 1

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 + i * 0.1 }}
        >
          <Star
            className={`h-7 w-7 ${
              i < stars
                ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                : 'text-muted/30'
            }`}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Confetti Component ───────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  if (!active) return null

  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -20,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
            rotate: Math.random() * 720 - 360,
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Option Letter Badge ──────────────────────────────────────────
const optionLetters = ['أ', 'ب', 'ج', 'د']

// ─── Main QuizSection Component ───────────────────────────────────
export default function QuizSection() {
  const { setActiveSection } = useAppStore()

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>('category')
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [skippedCount, setSkippedCount] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [direction, setDirection] = useState(1)

  // Timer state
  const [timeLeft, setTimeLeft] = useState(30)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Quiz scores history from localStorage (lazy init)
  const [quizHistory, setQuizHistory] = useState<Record<string, { bestScore: number; attempts: number }>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = localStorage.getItem('alta7reer-quiz-history')
      if (stored) return JSON.parse(stored)
    } catch {}
    return {}
  })

  // Save quiz history
  const saveQuizHistory = useCallback((categoryId: string, newScore: number) => {
    try {
      const current = quizHistory
      const existing = current[categoryId]
      const updated = {
        ...current,
        [categoryId]: {
          bestScore: Math.max(newScore, existing?.bestScore ?? 0),
          attempts: (existing?.attempts ?? 0) + 1,
        }
      }
      setQuizHistory(updated)
      localStorage.setItem('alta7reer-quiz-history', JSON.stringify(updated))
    } catch {}
  }, [quizHistory])

  const handleTimeUp = useCallback(() => {
    setIsAnswered(true)
    setSkippedCount(prev => prev + 1)
    setAnswers(prev => [...prev, null])
  }, [])

  // Timer logic
  useEffect(() => {
    if (quizState !== 'question' || isAnswered) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto-skip
          clearInterval(timerRef.current!)
          timerRef.current = null
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [quizState, currentQuestionIndex, isAnswered, handleTimeUp])

  const startQuiz = useCallback((category: QuizCategory) => {
    // Shuffle and take 10 questions
    const shuffled = [...category.questions].sort(() => Math.random() - 0.5).slice(0, 10)
    const catWithShuffled = { ...category, questions: shuffled }
    setSelectedCategory(catWithShuffled)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setCorrectCount(0)
    setWrongCount(0)
    setSkippedCount(0)
    setAnswers([])
    setTimeLeft(30)
    setDirection(1)
    setQuizState('question')
  }, [])

  const handleSelectAnswer = useCallback((index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
    setIsAnswered(true)

    const question = selectedCategory!.questions[currentQuestionIndex]
    if (index === question.correctIndex) {
      setScore(prev => prev + 10)
      setCorrectCount(prev => prev + 1)
    } else {
      setWrongCount(prev => prev + 1)
    }
    setAnswers(prev => [...prev, index])

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [isAnswered, selectedCategory, currentQuestionIndex])

  const handleNextQuestion = useCallback(() => {
    if (!selectedCategory) return
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= selectedCategory.questions.length) {
      // Show results
      const finalScore = Math.round((score / (selectedCategory.questions.length * 10)) * 100)
      saveQuizHistory(selectedCategory.id, finalScore)
      setQuizState('results')
    } else {
      setDirection(1)
      setCurrentQuestionIndex(nextIndex)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setTimeLeft(30)
    }
  }, [selectedCategory, currentQuestionIndex, score, saveQuizHistory])

  const handleRetry = useCallback(() => {
    if (selectedCategory) {
      startQuiz(selectedCategory)
    }
  }, [selectedCategory, startQuiz])

  const handleBack = useCallback(() => {
    setQuizState('category')
    setSelectedCategory(null)
  }, [])

  const handleShare = useCallback(() => {
    const text = `حصلت على ${score} نقطة في اختبار ${selectedCategory?.title ?? ''} على منصة التحرير الكتابي والشفهي! 🎯`
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'نتيجة الاختبار', text }).catch(() => {})
    } else {
      try {
        navigator.clipboard.writeText(text)
      } catch {}
    }
  }, [score, selectedCategory])

  // ─── Category Selection Screen ────────────────────────────────
  if (quizState === 'category') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex flex-col"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-bl from-primary to-emerald-800 flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/20 mb-4">
              <Brain className="h-9 w-9" />
            </div>
            <motion.div
              className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Sparkles className="h-3 w-3 text-amber-900" />
            </motion.div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">اختبار المعرفة</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-2">
            اختبر معلوماتك في التحرير الكتابي والشفهي ومهارات التعبير
          </p>
          <p className="text-sm text-muted-foreground/70">
            10 أسئلة لكل اختبار • 30 ثانية لكل سؤال • نتائج فورية
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizCategories.map((category) => {
            const CategoryIcon = category.icon
            const history = quizHistory[category.id]

            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Card
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden h-full"
                  onClick={() => startQuiz(category)}
                >
                  <div className={`h-1.5 bg-gradient-to-l ${category.gradientFrom} ${category.gradientTo}`} />
                  <CardContent className="p-6">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-bl ${category.gradientFrom} ${category.gradientTo} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <CategoryIcon className="h-7 w-7" />
                      </motion.div>
                      {history && (
                        <Badge variant="outline" className={`${category.textColor} border-current/20 text-xs`}>
                          أفضل: {history.bestScore}%
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" />
                          <span>{category.questions.length} سؤال</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>30 ثانية</span>
                        </div>
                      </div>
                      {history && (
                        <span className="text-[10px] text-muted-foreground/60">
                          {history.attempts} محاولة
                        </span>
                      )}
                    </div>

                    {/* Start button */}
                    <Button
                      className={`w-full mt-4 bg-gradient-to-l ${category.gradientFrom} ${category.gradientTo} hover:opacity-90 text-white shadow-md group-hover:shadow-lg transition-all duration-300`}
                    >
                      <Zap className="h-4 w-4 ml-2" />
                      ابدأ الاختبار
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Tips Section */}
        <motion.div variants={itemVariants} className="mt-10">
          <Card className="border-0 shadow-sm bg-gradient-to-l from-emerald-50/50 to-amber-50/50 dark:from-emerald-950/20 dark:to-amber-950/20">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                نصائح للنجاح في الاختبار
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">أدر الوقت جيداً</p>
                    <p className="text-xs text-muted-foreground">لديك 30 ثانية فقط لكل سؤال</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">راجع المحتوى أولاً</p>
                    <p className="text-xs text-muted-foreground">اقرأ الأقسام التعليمية قبل الاختبار</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">تعلّم من الأخطاء</p>
                    <p className="text-xs text-muted-foreground">اقرأ الشرح بعد كل إجابة خاطئة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
  }

  // ─── Question Screen ──────────────────────────────────────────
  if (quizState === 'question' && selectedCategory) {
    const question = selectedCategory.questions[currentQuestionIndex]
    const totalQuestions = selectedCategory.questions.length
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100
    const isCorrect = selectedAnswer === question.correctIndex
    const isSkipped = isAnswered && selectedAnswer === null

    return (
      <div className="min-h-screen flex flex-col">
        {/* Top Bar: Progress + Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة
              </Button>
              <Badge variant="outline" className={`${selectedCategory.textColor} border-current/20`}>
                {selectedCategory.title}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
              <TimerRing seconds={timeLeft} maxSeconds={30} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-l ${selectedCategory.gradientFrom} ${selectedCategory.gradientTo}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1"
          >
            <Card className="border-0 shadow-lg overflow-hidden mb-6 card-hover-glow">
              <div className={`h-1.5 bg-gradient-to-l ${selectedCategory.gradientFrom} ${selectedCategory.gradientTo}`} />
              <CardContent className="p-6 sm:p-8">
                {/* Question number & Score */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-bl ${selectedCategory.gradientFrom} ${selectedCategory.gradientTo} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {currentQuestionIndex + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">السؤال {currentQuestionIndex + 1} من {totalQuestions}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
                    <Trophy className="h-4 w-4" />
                    {score} نقطة
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-lg sm:text-xl font-bold mb-6 leading-relaxed">
                  {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx
                    const isCorrectOption = idx === question.correctIndex
                    const showCorrect = isAnswered && isCorrectOption
                    const showWrong = isAnswered && isSelected && !isCorrectOption
                    const showSelected = isSelected && !isAnswered

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isAnswered}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all duration-300 btn-ripple ${
                          showCorrect
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 shadow-md shadow-emerald-500/10'
                            : showWrong
                            ? 'border-red-400 bg-red-50 dark:bg-red-950/30 shadow-md shadow-red-500/10'
                            : showSelected
                            ? 'border-primary bg-primary/5'
                            : isAnswered
                            ? 'border-border/50 opacity-50 cursor-not-allowed'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer active:scale-[0.98]'
                        }`}
                        whileHover={!isAnswered ? { scale: 1.01 } : {}}
                        whileTap={!isAnswered ? { scale: 0.99 } : {}}
                      >
                        {/* Letter badge */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                          showCorrect
                            ? 'bg-emerald-500 text-white'
                            : showWrong
                            ? 'bg-red-500 text-white'
                            : showSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {showCorrect ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : showWrong ? (
                            <XCircle className="h-5 w-5" />
                          ) : (
                            optionLetters[idx]
                          )}
                        </div>

                        {/* Option text */}
                        <span className={`flex-1 font-medium transition-colors duration-300 ${
                          showCorrect ? 'text-emerald-700 dark:text-emerald-400' :
                          showWrong ? 'text-red-700 dark:text-red-400' : ''
                        }`}>
                          {option}
                        </span>

                        {/* Indicator */}
                        {showCorrect && (
                          <Badge className="bg-emerald-500 text-white text-[10px] shrink-0">صحيح</Badge>
                        )}
                        {showWrong && (
                          <Badge className="bg-red-500 text-white text-[10px] shrink-0">خطأ</Badge>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Explanation Panel */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                >
                  <Card className={`border-0 shadow-md overflow-hidden mb-6 ${
                    isSkipped ? 'ring-2 ring-amber-400/50' :
                    isCorrect ? 'ring-2 ring-emerald-400/50' :
                    'ring-2 ring-red-400/50'
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSkipped ? 'bg-amber-100 dark:bg-amber-900/30' :
                          isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                          'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {isSkipped ? (
                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          ) : isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-sm mb-1 ${
                            isSkipped ? 'text-amber-700 dark:text-amber-400' :
                            isCorrect ? 'text-emerald-700 dark:text-emerald-400' :
                            'text-red-700 dark:text-red-400'
                          }`}>
                            {isSkipped ? '⏰ انتهى الوقت!' : isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة!'}
                          </h4>
                          {!isSkipped && !isCorrect && (
                            <p className="text-sm text-muted-foreground mb-2">
                              الإجابة الصحيحة: <span className="font-bold text-emerald-600 dark:text-emerald-400">{optionLetters[question.correctIndex]}) {question.options[question.correctIndex]}</span>
                            </p>
                          )}
                          <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-muted/30">
                            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next / Results Button */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={handleNextQuestion}
                        className={`bg-gradient-to-l ${selectedCategory.gradientFrom} ${selectedCategory.gradientTo} hover:opacity-90 text-white shadow-lg px-8 h-12 text-base`}
                      >
                        {currentQuestionIndex + 1 >= totalQuestions ? (
                          <>
                            <Award className="h-5 w-5 ml-2" />
                            عرض النتائج
                          </>
                        ) : (
                          <>
                            السؤال التالي
                            <ChevronLeft className="h-5 w-5 mr-1" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // ─── Results Screen ───────────────────────────────────────────
  if (quizState === 'results' && selectedCategory) {
    const totalQuestions = selectedCategory.questions.length
    const percentage = Math.round((score / (totalQuestions * 10)) * 100)
    const isHighScore = percentage >= 80
    const CategoryIcon = selectedCategory.icon

    return (
      <>
        <Confetti active={isHighScore} />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-h-screen flex flex-col items-center"
        >
          {/* Results Card */}
          <motion.div variants={itemVariants} className="w-full max-w-xl">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-l ${selectedCategory.gradientFrom} ${selectedCategory.gradientTo}`} />
              <CardContent className="p-6 sm:p-8 text-center">
                {/* Category Badge */}
                <div className="flex justify-center mb-4">
                  <Badge className={`${selectedCategory.textColor} bg-gradient-to-l ${selectedCategory.bgLight} ${selectedCategory.bgDark} border ${selectedCategory.borderColor} gap-1.5 px-3 py-1`}>
                    <CategoryIcon className="h-3.5 w-3.5" />
                    {selectedCategory.title}
                  </Badge>
                </div>

                {/* Score Circle */}
                <div className="flex justify-center mb-4">
                  <CircularScore score={percentage} size={160} />
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-4">
                  <StarsRating score={percentage} />
                </div>

                {/* Score message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-bold mb-1">
                    {percentage >= 90 ? '🏆 ممتاز! أداء استثنائي!' :
                     percentage >= 75 ? '🌟 رائع! أداء متقدم!' :
                     percentage >= 55 ? '👍 جيد! يمكنك التحسن!' :
                     percentage >= 35 ? '💪 لا بأس! تدرّب أكثر!' :
                     '📚 تحتاج مراجعة! لا تستسلم!'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isHighScore
                      ? 'تهانينا! لقد أظهرت معرفة متميزة في هذا المجال.'
                      : 'راجع المحتوى التعليمي وحاول مرة أخرى لتحسين نتيجتك.'}
                  </p>
                </motion.div>

                {/* Score Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-3 gap-3 mb-6"
                >
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">صحيحة</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">خاطئة</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{wrongCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">تخطيت</span>
                    </div>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{skippedCount}</span>
                  </div>
                </motion.div>

                {/* Score Points */}
                <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-muted/30">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="font-bold">{score}</span>
                  <span className="text-muted-foreground text-sm">من</span>
                  <span className="font-bold">{totalQuestions * 10}</span>
                  <span className="text-muted-foreground text-sm">نقطة</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleRetry}
                    className={`flex-1 bg-gradient-to-l ${selectedCategory.gradientFrom} ${selectedCategory.gradientTo} hover:opacity-90 text-white shadow-md`}
                  >
                    <RotateCcw className="h-4 w-4 ml-2" />
                    إعادة المحاولة
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    مشاركة النتيجة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back Button */}
          <motion.div variants={itemVariants} className="mt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للاختبارات
            </Button>
          </motion.div>

          {/* Wrong answers review */}
          {wrongCount > 0 && (
            <motion.div variants={itemVariants} className="w-full max-w-xl mt-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    مراجعة الإجابات الخاطئة
                  </h4>
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {selectedCategory.questions.map((q, idx) => {
                      const userAnswer = answers[idx]
                      const wasWrong = userAnswer !== null && userAnswer !== q.correctIndex
                      const wasSkipped = userAnswer === null

                      if (!wasWrong && !wasSkipped) return null

                      return (
                        <div key={q.id} className={`p-4 rounded-lg border ${
                          wasSkipped
                            ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                            : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'
                        }`}>
                          <p className="font-medium text-sm mb-2">{idx + 1}. {q.question}</p>
                          {wasWrong && (
                            <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                              إجابتك: {optionLetters[userAnswer!]}) {q.options[userAnswer!]}
                            </p>
                          )}
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            الإجابة الصحيحة: {optionLetters[q.correctIndex]}) {q.options[q.correctIndex]}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick navigation to content sections */}
          <motion.div variants={itemVariants} className="w-full max-w-xl mt-6">
            <Card className="border-0 shadow-sm bg-gradient-to-l from-emerald-50/50 to-amber-50/50 dark:from-emerald-950/20 dark:to-amber-950/20">
              <CardContent className="p-5">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  راجع المحتوى التعليمي
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex-col gap-1.5"
                    onClick={() => setActiveSection('oral-expression')}
                  >
                    <Mic className="h-5 w-5 text-emerald-500" />
                    <span className="text-xs">التحرير الشفهي</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex-col gap-1.5"
                    onClick={() => setActiveSection('written-expression')}
                  >
                    <Pen className="h-5 w-5 text-amber-500" />
                    <span className="text-xs">التحرير الكتابي</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </>
    )
  }

  return null
}
