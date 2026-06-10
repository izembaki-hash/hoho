'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import ThemeProvider from '@/components/ThemeProvider'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import ContentReader from '@/components/ContentReader'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import LiveLessonsSection from '@/components/sections/LiveLessonsSection'
import RecordedLessonsSection from '@/components/sections/RecordedLessonsSection'
import OralExpressionSection from '@/components/sections/OralExpressionSection'
import WrittenExpressionSection from '@/components/sections/WrittenExpressionSection'
import ContactSection from '@/components/sections/ContactSection'
import { useAppStore } from '@/lib/store'
import { HomeIcon, ChevronLeft, Printer, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sectionComponents: Record<string, React.ComponentType> = {
  home: HeroSection,
  about: AboutSection,
  'live-lessons': LiveLessonsSection,
  'recorded-lessons': RecordedLessonsSection,
  'oral-expression': OralExpressionSection,
  'written-expression': WrittenExpressionSection,
  contact: ContactSection,
}

const sectionTitles: Record<string, string> = {
  home: 'الرئيسية',
  about: 'نبذة عن المؤلف',
  'live-lessons': 'دروس مباشرة',
  'recorded-lessons': 'دروس مسجلة',
  'oral-expression': 'التحرير الشفهي',
  'written-expression': 'التحرير الكتابي',
  contact: 'اتصل بنا',
}

const sectionIcons: Record<string, string> = {
  home: '🏠',
  about: '👨‍🏫',
  'live-lessons': '📡',
  'recorded-lessons': '📚',
  'oral-expression': '🎤',
  'written-expression': '✍️',
  contact: '✉️',
}

const sectionContent: Record<string, string> = {
  home: 'منصة التحرير الكتابي والشفهي. منصة شاملة لتعلّم مهارات التحرير الكتابي والشفهي، مصمّمة خصيصاً للطلبة والأساتذة الجامعيين والتلاميذ. اكتسب مهارات العرض والإلقاء والكتابة الإبداعية من خلال دروس مباشرة ومسجلة. نوفر دروساً مباشرة وتفاعلية مع بث حي وإمكانية التواصل المباشر مع الأساتذة. مرفقات وملحقات تعليمية تشمل ملفات وملخصات وكتب مرجعية مع كل درس مسجل. جدولة مرنة مع دروس مباشرة في أوقات محددة ومسجلة متاحة على مدار الساعة. محتوى مخصص مصمم خصيصاً للطلبة والأساتذة والتلاميذ.',
  about: 'نبذة عن المؤلف. أستاذ التعليم العالي في تخصص اللغة العربية وآدابها، ومختص في فنون التحرير الكتابي والشفهي. حاصل على دكتوراه دولة في اللسانيات العربية وتحليل الخطاب، مع خبرة تزيد عن عشرين عاماً في ميدان التعليم الجامعي والبحث العلمي. شارك في العديد من المؤتمرات العلمية الدولية والوطنية، وأشرف على عشرات المذكرات والرسائل الجامعية. نشر أبحاثاً في مجلات محكّمة متخصصة، وألّف كتباً في مجالات التحرير والبلاغة والتواصل الفعّال. يؤمن بأن إتقان مهارات التعبير الكتابي والشفهي هو مفتاح النجاح في الحياة الأكاديمية والمهنية.',
  'live-lessons': 'دروس مباشرة. انضم إلى الدروس الحية وتفاعل مع الأساتذة مباشرة. يمكنك المشاركة في البث المباشر وطرح الأسئلة والتفاعل مع المحتوى في الوقت الحقيقي. الجدول الأسبوعي يتضمن دروساً في التحرير الكتابي والشفهي ومهارات العرض والتقديم. سجّل الآن للحصول على رابط الحصة المباشرة.',
  'recorded-lessons': 'دروس مسجلة. مكتبة شاملة للدروس المسجلة مع مرفقات وملحقات تعليمية. تصفّح الدروس حسب المستوى والموضوع. كل درس يتضمن شرحاً مفصلاً مع أمثلة تطبيقية وتمارين عملية. أكثر من مئة وخمسين درس مسجل متاح على مدار الساعة.',
  'oral-expression': 'التحرير الشفهي. تعلّم مهارات العرض والتعبير الشفهي والإلقاء الإبداعي. يشمل التعريف بالتعبير الشفهي وأنواعه ومهاراته الأساسية. تعلّم فن الإلقاء الإبداعي ولغة الجسد في العرض التقديمي. محتوى مصمم للطلبة الجامعيين والأساتذة والتلاميذ.',
  'written-expression': 'التحرير الكتابي. فنون الكتابة والتأليف من خطابة ومقال ورسائل. يشمل تعلّم فن الخطابة وكتابة المقال والتلخيص وكتابة التقرير والرسالة الإدارية والمقال التحليلي والمقال الجدلي والسيرة الذاتية والبحث العلمي. تسعة موضوعات شاملة لتطوير مهارات الكتابة. محتوى مصمم للطلبة الجامعيين والأساتذة والتلاميذ.',
  contact: 'اتصل بنا. تواصل معنا لطرح انشغالاتكم ومقترحاتكم. نحن هنا لمساعدتكم والإجابة على جميع استفساراتكم. يمكنكم التواصل عبر نموذج الاتصال أو عبر البريد الإلكتروني أو الهاتف. نلتزم بالرد على جميع الرسائل في أقرب وقت ممكن.',
}

// Estimated reading time per section (in minutes)
const readingTime: Record<string, number> = {
  home: 5,
  about: 8,
  'live-lessons': 6,
  'recorded-lessons': 7,
  'oral-expression': 15,
  'written-expression': 20,
  contact: 4,
}

export default function Home() {
  const { activeSection } = useAppStore()
  const ActiveSectionComponent = sectionComponents[activeSection] || HeroSection
  const readerContent = sectionContent[activeSection] || ''
  const estimatedTime = readingTime[activeSection] || 5

  const handlePrint = () => {
    window.print()
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <ReadingProgressBar />
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">
          {/* Breadcrumb */}
          {activeSection !== 'home' && (
            <div className="bg-muted/30 border-b border-border/50 animate-in fade-in slide-in-from-top-2 duration-300 print:bg-white print:border-none">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <button
                      onClick={() => useAppStore.getState().setActiveSection('home')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <HomeIcon className="h-3.5 w-3.5" />
                      الرئيسية
                    </button>
                    <ChevronLeft className="h-3 w-3" />
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <span className="text-xs">{sectionIcons[activeSection]}</span>
                      {sectionTitles[activeSection]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 print:hidden">
                    {/* Reading Time */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      <span>{estimatedTime} دقائق قراءة</span>
                    </div>
                    {/* Print Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrint}
                      className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">طباعة</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div
            key={activeSection}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          >
            <ActiveSectionComponent />
          </div>
        </main>
        <Footer />
        <ContentReader content={readerContent} />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  )
}
