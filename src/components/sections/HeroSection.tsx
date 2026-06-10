'use client'

import { useAppStore, type SectionId } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  BookOpen, Mic, Pen, Video, User, Mail, ChevronLeft, 
  Sparkles, GraduationCap, Users, School 
} from 'lucide-react'

const sectionCards: { id: SectionId; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'about',
    label: 'نبذة عن المؤلف',
    description: 'تعرف على صاحب الموقع ومسيرته العلمية والأدبية',
    icon: <User className="h-8 w-8" />,
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    id: 'live-lessons',
    label: 'دروس مباشرة',
    description: 'انضم إلى الدروس الحية وتفاعل مع الأساتذة مباشرة',
    icon: <Video className="h-8 w-8" />,
    color: 'from-red-500 to-red-700',
  },
  {
    id: 'recorded-lessons',
    label: 'دروس مسجلة',
    description: 'مكتبة شاملة للدروس المسجلة مع مرفقات وملحقات',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'from-amber-500 to-amber-700',
  },
  {
    id: 'oral-expression',
    label: 'التحرير الشفهي',
    description: 'مهارات العرض والتعبير الشفهي والإلقاء الإبداعي',
    icon: <Mic className="h-8 w-8" />,
    color: 'from-teal-500 to-teal-700',
  },
  {
    id: 'written-expression',
    label: 'التحرير الكتابي',
    description: 'فنون الكتابة والتأليف من خطابة ومقال ورسائل',
    icon: <Pen className="h-8 w-8" />,
    color: 'from-primary to-emerald-800',
  },
  {
    id: 'contact',
    label: 'اتصل بنا',
    description: 'تواصل معنا لطرح انشغالاتكم ومقترحاتكم',
    icon: <Mail className="h-8 w-8" />,
    color: 'from-slate-500 to-slate-700',
  },
]

const stats = [
  { label: 'درس مسجل', value: '150+', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'طالب نشط', value: '5000+', icon: <GraduationCap className="h-5 w-5" /> },
  { label: 'أستاذ', value: '25+', icon: <Users className="h-5 w-5" /> },
  { label: 'مؤسسة تعليمية', value: '10+', icon: <School className="h-5 w-5" /> },
]

export default function HeroSection() {
  const { setActiveSection } = useAppStore()

  const handleNavigate = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/70 to-emerald-900/90 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-banner.png)' }}
        />
        <div className="relative z-20 px-6 sm:px-12 py-16 sm:py-24 min-h-[400px] flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span className="text-amber-200 text-sm font-medium">منصة تعليمية متكاملة</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              التحرير الكتابي والشفهي
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
              منصة شاملة لتعلّم مهارات التحرير الكتابي والشفهي، مصمّمة خصيصاً للطلبة والأساتذة الجامعيين والتلاميذ. 
              اكتسب مهارات العرض والإلقاء والكتابة الإبداعية من خلال دروس مباشرة ومسجلة.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => handleNavigate('oral-expression')}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <Mic className="h-4 w-4 ml-2" />
                التحرير الشفهي
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleNavigate('written-expression')}
                className="border-white/40 text-white hover:bg-white/10 font-semibold"
              >
                <Pen className="h-4 w-4 ml-2" />
                التحرير الكتابي
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-4 px-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Section Cards */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">استكشف أقسام الموقع</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اختر القسم الذي يناسب اهتماماتك وابدأ رحلتك التعليمية في عالم التحرير الكتابي والشفهي
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionCards.map((card) => (
            <Card
              key={card.id}
              className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              onClick={() => handleNavigate(card.id)}
            >
              <CardContent className="p-0">
                <div className={`h-2 bg-gradient-to-l ${card.color}`} />
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-bl ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {card.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {card.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>استكشف المزيد</span>
                    <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
