'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { BookOpen, X, Search, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Category = 'بلاغة' | 'نحو' | 'صرف' | 'أدب' | 'أسلوب'

interface GlossaryTerm {
  term: string
  definition: string
  category: Category
  relatedTerms: string[]
  letter: string
}

const CATEGORY_COLORS: Record<Category, string> = {
  'بلاغة': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'نحو': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'صرف': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  'أدب': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'أسلوب': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
}

const CATEGORY_DOT_COLORS: Record<Category, string> = {
  'بلاغة': 'bg-emerald-500',
  'نحو': 'bg-amber-500',
  'صرف': 'bg-teal-500',
  'أدب': 'bg-purple-500',
  'أسلوب': 'bg-sky-500',
}

const ARABIC_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز',
  'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك',
  'ل', 'م', 'ن', 'هـ', 'و', 'ي',
]

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'استعارة',
    definition: 'نوع من المجاز اللغوي يُستخدم فيه لفظ في غير معناه الأصلي لعلاقة المشابهة، مثل "أسدٌ في المعركة" أي شجاع. من أهم أبواب البلاغة العربية وأكثرها استخداماً في الشعر والنثر.',
    category: 'بلاغة',
    relatedTerms: ['تشبيه', 'كناية', 'مجاز', 'تورية'],
    letter: 'أ',
  },
  {
    term: 'إطناب',
    definition: 'أسلوب بلاغي يعتمد على الإطالة في التعبير وزيادة الألفاظ على المعنى المراد، بحيث لا يكون في الكلام حشو أو تكرار بلا فائدة. يُستخدم لتأكيد المعنى أو توضيحه.',
    category: 'بلاغة',
    relatedTerms: ['إيجاز', 'مساواة', 'أسلوب خبري'],
    letter: 'أ',
  },
  {
    term: 'إيجاز',
    definition: 'أسلوب بلاغي يعتمد على اختصار العبارة وإيصال المعنى بأقل عدد من الألفاظ، مع الحفاظ على وضوح المعنى واكتماله. وهو من محاسن الكلام.',
    category: 'بلاغة',
    relatedTerms: ['إطناب', 'مساواة', 'تلخيص'],
    letter: 'أ',
  },
  {
    term: 'أسلوب خبري',
    definition: 'نوع من الأساليب اللغوية يُخبر فيه المتكلم عن شيء أو يصف حالة أو يقرر حقيقة، ويمكن تصديقه أو تكذيبه. يتميز بالوضوع والموضوعية.',
    category: 'أسلوب',
    relatedTerms: ['أسلوب إنشائي', 'إطناب', 'إيجاز'],
    letter: 'أ',
  },
  {
    term: 'أسلوب إنشائي',
    definition: 'نوع من الأساليب اللغوية لا يحمل معنى يمكن تصديقه أو تكذيبه، مثل الأمر والنهي والاستفهام والتمني والنداء. يُستخدم للتأثير النفسي في المتلقي.',
    category: 'أسلوب',
    relatedTerms: ['أسلوب خبري', 'خطابة', 'بلاغة'],
    letter: 'أ',
  },
  {
    term: 'اقتباس',
    definition: 'أخذ عبارة من القرآن الكريم أو الحديث الشريف أو كلام مشهور وتضمينها في النثر أو الشعر، مع الإشارة إلى المصدر أو بدون إشارة. يُعد من المحسنات البديعية.',
    category: 'أدب',
    relatedTerms: ['استشهاد', 'شعر', 'نثر'],
    letter: 'أ',
  },
  {
    term: 'استشهاد',
    definition: 'الاحتجاج بآية قرآنية أو حديث نبوي أو بيت شعري أو قول مأثور لتأكيد فكرة أو إثبات حجة. يُستخدم في المقالات والخطب والرسائل العلمية.',
    category: 'أدب',
    relatedTerms: ['اقتباس', 'خطابة', 'مقدمة'],
    letter: 'أ',
  },
  {
    term: 'بلاغة',
    definition: 'فن التواصل الفعّال عبر مطابقة الكلام لمقتضى الحال مع فصاحته. هي علم يعني بتحسين العبارة وإيصال المعنى بشكل مؤثر. قال الرسول ﷺ: "إن من البيان لسحراً".',
    category: 'بلاغة',
    relatedTerms: ['فصاحة', 'بيان', 'خطابة'],
    letter: 'ب',
  },
  {
    term: 'بيان',
    definition: 'قسم من أقسام البلاغة العربية يختص بإيضاح المعنى وإبرازه بأفضل صورة ممكنة. يشمل التشبيه والاستعارة والمجاز المرسل والكناية.',
    category: 'بلاغة',
    relatedTerms: ['بلاغة', 'فصاحة', 'استعارة', 'تشبيه'],
    letter: 'ب',
  },
  {
    term: 'تشبيه',
    definition: 'أسلوب بلاغي يعتمد على المقارنة بين شيئين يشتركان في صفة أو أكثر، باستخدام أداة تشبيه مثل "كـ" أو "مثل". من أبسط صور البيان وأكثرها وضوحاً.',
    category: 'بلاغة',
    relatedTerms: ['استعارة', 'كناية', 'مجاز'],
    letter: 'ت',
  },
  {
    term: 'تورية',
    definition: 'محسن بديعي يعتمد على استخدام لفظ يحمل معنيين: قريب يفهمه السامع وبعيد هو المقصود. تُسمى أيضاً "الاستخدام" وتعتبر من أبدع فنون البلاغة.',
    category: 'بلاغة',
    relatedTerms: ['جناس', 'استعارة', 'مجاز'],
    letter: 'ت',
  },
  {
    term: 'تلخيص',
    definition: 'مهارة كتابية تعتمد على استخراج الأفكار الرئيسية من نص طويل وإعادة صياغتها بأسلوب موجز مع الحفاظ على المعنى الأساسي. من أهم مهارات التحرير الكتابي.',
    category: 'أسلوب',
    relatedTerms: ['إيجاز', 'اقتباس', 'عرض'],
    letter: 'ت',
  },
  {
    term: 'جناس',
    definition: 'محسن بديعي يعتمد على الاتفاق في اللفظ واختلاف المعنى، كأن يتشابه لفظان في النطق ويختلفا في الدلالة. أنواعه: تام، ناقص، خطي، محرّف.',
    category: 'بلاغة',
    relatedTerms: ['تورية', 'سجع', 'طباق'],
    letter: 'ج',
  },
  {
    term: 'حقيقة',
    definition: 'استخدام اللفظ في معناه الأصلي الذي وُضع له في اللغة، بدون نقل أو تجاوز. مقابل المجاز، وتُعد الأساس الذي تُبنى عليه لغة التواصل.',
    category: 'بلاغة',
    relatedTerms: ['مجاز', 'مجاز مرسل', 'استعارة'],
    letter: 'ح',
  },
  {
    term: 'خطابة',
    definition: 'فن مخاطبة الجمهور وإقناعهم بالأفكار والآراء باستخدام أساليب بلاغية متنوعة. من أقدم الفنون النثرية العربية، وتتطلب مهارات الإلقاء والإقناع والتأثير.',
    category: 'أدب',
    relatedTerms: ['بلاغة', 'أسلوب إنشائي', 'فصاحة'],
    letter: 'خ',
  },
  {
    term: 'خاتمة',
    definition: 'القسم الأخير من المقال أو الخطبة أو البحث، يُلخّص فيه الكاتب الأفكار الرئيسية ويقدّم توصياته أو استنتاجاته. يجب أن تكون قوية ومؤثرة.',
    category: 'أسلوب',
    relatedTerms: ['مقدمة', 'عرض', 'تلخيص'],
    letter: 'خ',
  },
  {
    term: 'شخصية',
    definition: 'في النقد الأدبي، تعني الصفات المميزة للشخصية في العمل الأدبي، سواء كانت حقيقية أو خيالية. تشمل البناء النفسي والاجتماعي والفكري للشخصية.',
    category: 'أدب',
    relatedTerms: ['شعر', 'نثر', 'خطابة'],
    letter: 'ش',
  },
  {
    term: 'شعر',
    definition: 'فن الكلام الموزون المقفى الذي يعبر عن العواطف والأفكار بصور جمالية. من أقدم الفنون الأدبية العربية وأعرقها، يقوم على الوزن والقافية والتصوير الفني.',
    category: 'أدب',
    relatedTerms: ['نثر', 'قافية', 'وزن', 'سجع'],
    letter: 'ش',
  },
  {
    term: 'سجع',
    definition: 'اتفاق الفواصل في النثر على حرف واحد في آخرها، مما يخلق إيقاعاً موسيقياً جميلاً. يُستخدم كثيراً في الخطب والمواعظ والرسائل. من محاسن النثر العربي.',
    category: 'بلاغة',
    relatedTerms: ['جناس', 'قافية', 'وزن'],
    letter: 'س',
  },
  {
    term: 'صرف',
    definition: 'علم يبحث في بنية الكلمة العربية وتحولاتها الصرفية من خلال الزيادة والنقصان والإعلال والإبدال. يُعد الركيزة الأساسية لفهم بنية اللغة العربية.',
    category: 'صرف',
    relatedTerms: ['نحو', 'بلاغة', 'فصاحة'],
    letter: 'ص',
  },
  {
    term: 'طباق',
    definition: 'محسن بديعي يجمع بين الكلمة وضدها في عبارة واحدة، مثل "بيضٌ سودٌ". يُبرز المعنى بالتضاد ويُقوّي التأثير النفسي. أنواعه: إيجاب وسلب.',
    category: 'بلاغة',
    relatedTerms: ['مقابلة', 'جناس', 'تورية'],
    letter: 'ط',
  },
  {
    term: 'فصاحة',
    definition: 'صفة تُوصف بها الكلمة والكلام والمتكلم، وتعني الوضوح والبيان وسهولة النطق. الفصاحة جزء من البلاغة وشرط أساسي فيها. يُقال: أفصح الرجل إذا أبان عن مقصوده.',
    category: 'بلاغة',
    relatedTerms: ['بلاغة', 'بيان', 'خطابة'],
    letter: 'ف',
  },
  {
    term: 'قافية',
    definition: 'آخر ما يُلفظ من البيت الشعري من حروف وحركات، وهي ما يُتمم الوزن الشعري ويُعطيه إيقاعه الموسيقي. تختلف باختلاف البحور الشعرية.',
    category: 'أدب',
    relatedTerms: ['وزن', 'شعر', 'سجع'],
    letter: 'ق',
  },
  {
    term: 'كناية',
    definition: 'أسلوب بلاغي يُذكر فيه اللفظ ويُراد به لازم معناه مع إمكان إرادة المعنى الأصلي. مثل "كثير الرماد" كناية عن الكرم. من أبلغ الصور البيانية.',
    category: 'بلاغة',
    relatedTerms: ['استعارة', 'تشبيه', 'مجاز مرسل'],
    letter: 'ك',
  },
  {
    term: 'مجاز',
    definition: 'استخدام اللفظ في غير معناه الأصلي لعلاقة غير المشابهة مع قرينة مانعة من إرادة المعنى الحقيقي. يشمل المجاز المرسل والاستعارة.',
    category: 'بلاغة',
    relatedTerms: ['حقيقة', 'استعارة', 'مجاز مرسل', 'كناية'],
    letter: 'م',
  },
  {
    term: 'مجاز مرسل',
    definition: 'نوع من المجاز يعتمد على علاقة غير المشابهة بين المعنى الحقيقي والمجازي، مثل السببية أو المسببية أو الجزئية أو الكلية. يختلف عن الاستعارة التي تعتمد على المشابهة.',
    category: 'بلاغة',
    relatedTerms: ['مجاز', 'حقيقة', 'استعارة', 'كناية'],
    letter: 'م',
  },
  {
    term: 'مقدمة',
    definition: 'القسم الأول من المقال أو الخطبة أو البحث، يُمهّد فيه الكاتب لموضوعه ويجذب انتباه القارئ. يجب أن تكون مشوقة وواضحة ومتصلة بالموضوع.',
    category: 'أسلوب',
    relatedTerms: ['خاتمة', 'عرض', 'اقتباس'],
    letter: 'م',
  },
  {
    term: 'مقابلة',
    definition: 'محسن بديعي يعتمد على ذكر شيئين أو أكثر ثم ذكر ما يقابلها على الترتيب، مثل "فأمّا من أعطى واتقى وصدّق بالحسنى فسنيسره لليسرى". تُقوّي المعنى بالتضاد.',
    category: 'بلاغة',
    relatedTerms: ['طباق', 'جناس', 'تورية'],
    letter: 'م',
  },
  {
    term: 'نثر',
    definition: 'الكلام غير الموزون وغير المقفى، يشمل المقالة والخطبة والرسالة والقصة. يتميز بالحرية في التعبير والتنوع في الأساليب. يُعد أساس الكتابة النثرية العربية.',
    category: 'أدب',
    relatedTerms: ['شعر', 'قافية', 'وزن'],
    letter: 'ن',
  },
  {
    term: 'نحو',
    definition: 'علم يبحث في أحوال أواخر الكلمات العربية من حيث الإعراب والبناء. يُعد ركيزة اللغة العربية وأساسها، ويحفظ اللسان من الخطأ في التعبير.',
    category: 'نحو',
    relatedTerms: ['صرف', 'بلاغة', 'فصاحة'],
    letter: 'ن',
  },
  {
    term: 'وزن',
    definition: 'الإيقاع الموسيقي المنتظم الذي يقوم عليه الشعر العربي، وُضعت له الخليل بن أحمد ستة عشر بحراً شعرياً. الوزن شرط أساسي في الشعر العربي.',
    category: 'أدب',
    relatedTerms: ['قافية', 'شعر', 'سجع'],
    letter: 'و',
  },
  {
    term: 'عرض',
    definition: 'القسم الأوسط من المقال أو الخطبة، يُعرض فيه الكاتب أفكاره بالتفصيل مع الأدلة والشواهد. يُعد جوهر العمل الكتابي وأطول أقسامه.',
    category: 'أسلوب',
    relatedTerms: ['مقدمة', 'خاتمة', 'استشهاد'],
    letter: 'ع',
  },
]

export default function GlossaryWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)
  const [hasOpenedBefore] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return !!localStorage.getItem('glossary-opened') } catch { return false }
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const termDetailRef = useRef<HTMLDivElement>(null)

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (!hasOpenedBefore) {
      setHasOpenedBefore(true)
      try { localStorage.setItem('glossary-opened', 'true') } catch {}
    }
  }, [hasOpenedBefore])

  // Filter terms based on search and selected letter
  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS
    if (selectedLetter) {
      terms = terms.filter((t) => t.letter === selectedLetter)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      terms = terms.filter(
        (t) =>
          t.term.includes(query) ||
          t.definition.includes(query) ||
          t.category.includes(query) ||
          t.relatedTerms.some((rt) => rt.includes(query))
      )
    }
    return terms
  }, [searchQuery, selectedLetter])

  // Count terms per letter
  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const letter of ARABIC_LETTERS) {
      counts[letter] = GLOSSARY_TERMS.filter((t) => t.letter === letter).length
    }
    return counts
  }, [])

  const handleRelatedTermClick = useCallback((termName: string) => {
    const found = GLOSSARY_TERMS.find((t) => t.term === termName)
    if (found) {
      setSelectedTerm(found)
      setSelectedLetter(null)
      setSearchQuery('')
      // Scroll to top of detail
      if (termDetailRef.current) {
        termDetailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [])

  const handleLetterClick = useCallback((letter: string) => {
    setSelectedLetter((prev) => (prev === letter ? null : letter))
    setSelectedTerm(null)
    setSearchQuery('')
  }, [])

  const handleBackToList = useCallback(() => {
    setSelectedTerm(null)
  }, [])

  const totalTerms = GLOSSARY_TERMS.length

  return (
    <>
      {/* Glossary Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-36 sm:bottom-52 left-3 sm:left-6 z-50 flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
            style={{
              width: 'min(420px, calc(100vw - 1.5rem))',
              height: 'min(520px, calc(100vh - 200px))',
            }}
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-emerald-600 to-teal-700 text-white">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">معجم المصطلحات</h3>
                  <p className="text-[10px] opacity-80">{totalTerms} مصطلح أدبي ولغوي</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleOpen}
                className="h-7 w-7 rounded-full hover:bg-white/20 text-white"
                aria-label="إغلاق المعجم"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="px-3 py-2 border-b border-border/50 bg-card/50">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedTerm(null)
                  }}
                  placeholder="ابحث عن مصطلح..."
                  className="pr-9 h-9 text-sm rounded-lg border-border/50 bg-background/50 focus-visible:ring-emerald-500/30"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Alphabetical Tabs */}
            <div className="px-2 py-1.5 border-b border-border/30 bg-muted/20 overflow-x-auto">
              <div className="flex gap-0.5 min-w-max">
                <button
                  onClick={() => { setSelectedLetter(null); setSelectedTerm(null) }}
                  className={`px-2 py-1 text-[11px] rounded-md transition-all font-medium ${
                    !selectedLetter
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  الكل
                </button>
                {ARABIC_LETTERS.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    className={`px-1.5 py-1 text-[11px] rounded-md transition-all relative ${
                      letterCounts[letter] === 0
                        ? 'text-muted-foreground/30 cursor-default'
                        : selectedLetter === letter
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    disabled={letterCounts[letter] === 0}
                  >
                    {letter}
                    {letterCounts[letter] > 0 && (
                      <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-3">
                {/* Term Detail View */}
                <AnimatePresence mode="wait">
                  {selectedTerm ? (
                    <motion.div
                      key={selectedTerm.term}
                      ref={termDetailRef}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Back button */}
                      <button
                        onClick={handleBackToList}
                        className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        العودة للقائمة
                      </button>

                      {/* Term header */}
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-foreground mb-1">
                            {selectedTerm.term}
                          </h4>
                          <Badge
                            className={`text-[10px] border ${CATEGORY_COLORS[selectedTerm.category]}`}
                          >
                            <span
                              className={`inline-block w-1.5 h-1.5 rounded-full ml-1.5 ${CATEGORY_DOT_COLORS[selectedTerm.category]}`}
                            />
                            {selectedTerm.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Definition */}
                      <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {selectedTerm.definition}
                        </p>
                      </div>

                      {/* Related Terms */}
                      {selectedTerm.relatedTerms.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            مصطلحات ذات صلة:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedTerm.relatedTerms.map((related) => {
                              const relatedTerm = GLOSSARY_TERMS.find(
                                (t) => t.term === related
                              )
                              return (
                                <button
                                  key={related}
                                  onClick={() => handleRelatedTermClick(related)}
                                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border border-border/50 bg-background/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      relatedTerm
                                        ? CATEGORY_DOT_COLORS[relatedTerm.category]
                                        : 'bg-muted-foreground'
                                    }`}
                                  />
                                  <span className="font-medium text-foreground/80">
                                    {related}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5"
                    >
                      {filteredTerms.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">لا توجد نتائج</p>
                          <p className="text-xs mt-1">جرّب حرفاً أو كلمة بحث مختلفة</p>
                        </div>
                      ) : (
                        filteredTerms.map((item, index) => (
                          <motion.button
                            key={item.term}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15, delay: index * 0.02 }}
                            onClick={() => setSelectedTerm(item)}
                            className="w-full text-right p-3 rounded-xl border border-border/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {item.term}
                                  </span>
                                  <Badge
                                    className={`text-[9px] px-1.5 py-0 border ${CATEGORY_COLORS[item.category]}`}
                                  >
                                    {item.category}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                  {item.definition}
                                </p>
                              </div>
                              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-emerald-500 transition-colors shrink-0 mt-1" />
                            </div>
                          </motion.button>
                        ))
                      )}

                      {/* Results count */}
                      {filteredTerms.length > 0 && (
                        <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/20">
                          {filteredTerms.length} من {totalTerms} مصطلح
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border/30 bg-muted/10">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  {(['بلاغة', 'نحو', 'صرف', 'أدب', 'أسلوب'] as Category[]).map((cat) => (
                    <span key={cat} className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT_COLORS[cat]}`} />
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glossary Button */}
      <div className="fixed left-6 bottom-36 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative"
            >
              {/* Pulse ring for first-time visitors */}
              {!hasOpenedBefore && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-500/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              <Button
                onClick={toggleOpen}
                size="icon"
                className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-gradient-to-bl from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white relative"
                aria-label="فتح معجم المصطلحات"
              >
                <BookOpen className="h-5 w-5" />
                {!hasOpenedBefore && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[8px] bg-amber-500 text-white border-2 border-card">
                    جديد
                  </Badge>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
