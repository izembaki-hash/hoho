'use client'

import { useAppStore, type SectionId } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  BookOpen, Mic, Pen, Video, User, Mail, ChevronLeft, 
  Sparkles, GraduationCap, Users, School, ArrowRight,
  PlayCircle, Calendar, Download, MessageCircle 
} from 'lucide-react'
import { motion } from 'framer-motion'

const sectionCards: { id: SectionId; label: string; description: string; icon: React.ReactNode; color: string; bgPattern: string }[] = [
  {
    id: 'about',
    label: 'نبذة عن المؤلف',
    description: 'تعرف على صاحب الموقع ومسيرته العلمية والأدبية',
    icon: <User className="h-7 w-7" />,
    color: 'from-emerald-500 to-emerald-700',
    bgPattern: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    id: 'live-lessons',
    label: 'دروس مباشرة',
    description: 'انضم إلى الدروس الحية وتفاعل مع الأساتذة مباشرة',
    icon: <Video className="h-7 w-7" />,
    color: 'from-red-500 to-red-700',
    bgPattern: 'bg-red-50 dark:bg-red-950/30',
  },
  {
    id: 'recorded-lessons',
    label: 'دروس مسجلة',
    description: 'مكتبة شاملة للدروس المسجلة مع مرفقات وملحقات',
    icon: <BookOpen className="h-7 w-7" />,
    color: 'from-amber-500 to-amber-700',
    bgPattern: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'oral-expression',
    label: 'التحرير الشفهي',
    description: 'مهارات العرض والتعبير الشفهي والإلقاء الإبداعي',
    icon: <Mic className="h-7 w-7" />,
    color: 'from-teal-500 to-teal-700',
    bgPattern: 'bg-teal-50 dark:bg-teal-950/30',
  },
  {
    id: 'written-expression',
    label: 'التحرير الكتابي',
    description: 'فنون الكتابة والتأليف من خطابة ومقال ورسائل',
    icon: <Pen className="h-7 w-7" />,
    color: 'from-primary to-emerald-800',
    bgPattern: 'bg-primary/5 dark:bg-primary/10',
  },
  {
    id: 'contact',
    label: 'اتصل بنا',
    description: 'تواصل معنا لطرح انشغالاتكم ومقترحاتكم',
    icon: <Mail className="h-7 w-7" />,
    color: 'from-slate-500 to-slate-700',
    bgPattern: 'bg-slate-50 dark:bg-slate-950/30',
  },
]

const stats = [
  { label: 'درس مسجل', value: '150+', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'طالب نشط', value: '5000+', icon: <GraduationCap className="h-5 w-5" /> },
  { label: 'أستاذ', value: '25+', icon: <Users className="h-5 w-5" /> },
  { label: 'مؤسسة تعليمية', value: '10+', icon: <School className="h-5 w-5" /> },
]

const features = [
  {
    icon: <PlayCircle className="h-6 w-6" />,
    title: 'دروس مباشرة وتفاعلية',
    description: 'بث حي مع إمكانية التواصل المباشر مع الأساتذة وطرح الأسئلة',
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: 'مرفقات وملحقات تعليمية',
    description: 'ملفات PDF وملخصات وكتب مرجعية مع كل درس مسجل',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'جدولة مرنة',
    description: 'دروس مباشرة في أوقات محددة ومسجلة متاحة على مدار الساعة',
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: 'محتوى مخصص',
    description: 'محتوى مصمم خصيصاً للطلبة والأساتذة والتلاميذ',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HeroSection() {
  const { setActiveSection } = useAppStore()

  const handleNavigate = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/75 to-emerald-900/95 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-banner.png)' }}
        />
        {/* Decorative Elements */}
        <div className="absolute inset-0 z-10 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rotate-45" />
        </div>
        <div className="relative z-20 px-6 sm:px-12 py-16 sm:py-24 min-h-[420px] flex flex-col justify-center">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-5"
            >
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span className="text-amber-200 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">منصة تعليمية متكاملة</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
            >
              التحرير الكتابي
              <br />
              <span className="text-amber-200">والشفهي</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed"
            >
              منصة شاملة لتعلّم مهارات التحرير الكتابي والشفهي، مصمّمة خصيصاً للطلبة والأساتذة الجامعيين والتلاميذ. 
              اكتسب مهارات العرض والإلقاء والكتابة الإبداعية من خلال دروس مباشرة ومسجلة.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                size="lg"
                onClick={() => handleNavigate('oral-expression')}
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105"
              >
                <Mic className="h-4 w-4 ml-2" />
                التحرير الشفهي
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleNavigate('written-expression')}
                className="border-white/30 text-white hover:bg-white/15 font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Pen className="h-4 w-4 ml-2" />
                التحرير الكتابي
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="pt-6 pb-4 px-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">لماذا تختار منصتنا؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نقدم تجربة تعليمية فريدة تجمع بين المحتوى الأكاديمي الرصين والتفاعل المباشر
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group h-full">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">استكشف أقسام الموقع</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اختر القسم الذي يناسب اهتماماتك وابدأ رحلتك التعليمية في عالم التحرير الكتابي والشفهي
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionCards.map((card) => (
            <motion.div key={card.id} variants={itemVariants}>
              <Card
                className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                onClick={() => handleNavigate(card.id)}
              >
                <CardContent className="p-0">
                  <div className={`h-1.5 bg-gradient-to-l ${card.color}`} />
                  <div className={`${card.bgPattern} p-6`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-bl ${card.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {card.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all duration-300">
                      <span>استكشف المزيد</span>
                      <ArrowRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
