'use client'

import { useAppStore, type SectionId } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AnimatedCounter from '@/components/AnimatedCounter'
import NewsletterSection from '@/components/NewsletterSection'
import DailyQuote from '@/components/DailyQuote'
import WasThisHelpful from '@/components/WasThisHelpful'
import { 
  BookOpen, Mic, Pen, Video, User, Mail, 
  Sparkles, GraduationCap, Users, School, ArrowRight,
  PlayCircle, Calendar, Download, MessageCircle, Star, Quote,
  Zap, Trophy, Target, Radio, TrendingUp, BarChart3
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState, useCallback } from 'react'

const sectionCards: { id: SectionId; label: string; description: string; icon: React.ReactNode; color: string; bgPattern: string; stat: string; isLive?: boolean; isNew?: boolean }[] = [
  {
    id: 'about',
    label: 'نبذة عن المؤلف',
    description: 'تعرف على صاحب الموقع ومسيرته العلمية والأدبية',
    icon: <User className="h-7 w-7" />,
    color: 'from-emerald-500 to-emerald-700',
    bgPattern: 'bg-emerald-50 dark:bg-emerald-950/30',
    stat: '20+ سنة خبرة',
  },
  {
    id: 'live-lessons',
    label: 'دروس مباشرة',
    description: 'انضم إلى الدروس الحية وتفاعل مع الأساتذة مباشرة',
    icon: <Video className="h-7 w-7" />,
    color: 'from-red-500 to-red-700',
    bgPattern: 'bg-red-50 dark:bg-red-950/30',
    stat: 'بث أسبوعي',
    isLive: true,
  },
  {
    id: 'recorded-lessons',
    label: 'دروس مسجلة',
    description: 'مكتبة شاملة للدروس المسجلة مع مرفقات وملحقات',
    icon: <BookOpen className="h-7 w-7" />,
    color: 'from-amber-500 to-amber-700',
    bgPattern: 'bg-amber-50 dark:bg-amber-950/30',
    stat: '150+ درس',
  },
  {
    id: 'oral-expression',
    label: 'التحرير الشفهي',
    description: 'مهارات العرض والتعبير الشفهي والإلقاء الإبداعي',
    icon: <Mic className="h-7 w-7" />,
    color: 'from-teal-500 to-teal-700',
    bgPattern: 'bg-teal-50 dark:bg-teal-950/30',
    stat: '5 مهارات أساسية',
  },
  {
    id: 'written-expression',
    label: 'التحرير الكتابي',
    description: 'فنون الكتابة والتأليف من خطابة ومقال ورسائل',
    icon: <Pen className="h-7 w-7" />,
    color: 'from-primary to-emerald-800',
    bgPattern: 'bg-primary/5 dark:bg-primary/10',
    stat: '9 موضوعات',
    isNew: true,
  },
  {
    id: 'contact',
    label: 'اتصل بنا',
    description: 'تواصل معنا لطرح انشغالاتكم ومقترحاتكم',
    icon: <Mail className="h-7 w-7" />,
    color: 'from-slate-500 to-slate-700',
    bgPattern: 'bg-slate-50 dark:bg-slate-950/30',
    stat: 'رد سريع',
  },
  {
    id: 'progress' as SectionId,
    label: 'لوحة التقدم',
    description: 'تتبع تقدمك التعليمي وحقق الإنجازات',
    icon: <BarChart3 className="h-7 w-7" />,
    color: 'from-primary to-emerald-600',
    bgPattern: 'bg-primary/5 dark:bg-primary/10',
    stat: 'تتبع إنجازاتك',
  },
]

const stats = [
  { label: 'درس مسجل', value: '150+', icon: <BookOpen className="h-5 w-5" />, color: 'from-emerald-500 to-teal-600' },
  { label: 'طالب نشط', value: '5000+', icon: <GraduationCap className="h-5 w-5" />, color: 'from-primary to-emerald-700' },
  { label: 'أستاذ', value: '25+', icon: <Users className="h-5 w-5" />, color: 'from-amber-500 to-amber-700' },
  { label: 'مؤسسة تعليمية', value: '10+', icon: <School className="h-5 w-5" />, color: 'from-teal-500 to-teal-700' },
]

const features = [
  {
    icon: <PlayCircle className="h-6 w-6" />,
    title: 'دروس مباشرة وتفاعلية',
    description: 'بث حي مع إمكانية التواصل المباشر مع الأساتذة وطرح الأسئلة',
    gradient: 'from-red-500 to-red-700',
    step: '01',
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: 'مرفقات وملحقات تعليمية',
    description: 'ملفات PDF وملخصات وكتب مرجعية مع كل درس مسجل',
    gradient: 'from-amber-500 to-amber-700',
    step: '02',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'جدولة مرنة',
    description: 'دروس مباشرة في أوقات محددة ومسجلة متاحة على مدار الساعة',
    gradient: 'from-teal-500 to-teal-700',
    step: '03',
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: 'محتوى مخصص',
    description: 'محتوى مصمم خصيصاً للطلبة والأساتذة والتلاميذ',
    gradient: 'from-primary to-emerald-800',
    step: '04',
  },
]

const testimonials = [
  {
    name: 'أحمد بلقاسم',
    role: 'طالب ماجستير',
    text: 'ساعدتني الدروس المباشرة على تطوير مهارات العرض التقديمي بشكل كبير. أنصح بها كل طالب جامعي.',
    rating: 5,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'فاطمة الزهراء',
    role: 'أستاذة جامعية',
    text: 'محتوى متقن ومنهجي يوفر للأساتذة أدوات تعليمية قيمة في مجال التحرير الكتابي.',
    rating: 5,
    color: 'from-amber-500 to-amber-700',
  },
  {
    name: 'يوسف مرابط',
    role: 'تلميذ في الثانوية',
    text: 'الشروحات مبسطة وواضحة، تعلمت كيف أكتب مقالاً منظماً بفضل الدروس المسجلة.',
    rating: 5,
    color: 'from-primary to-emerald-800',
  },
]

const achievements = [
  { icon: <Zap className="h-5 w-5" />, text: 'تعلم تفاعلي', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { icon: <Trophy className="h-5 w-5" />, text: 'شهادات معتمدة', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { icon: <Target className="h-5 w-5" />, text: 'أهداف واضحة', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

// Arabic-inspired geometric SVG pattern for hero overlay
function ArabesquePattern() {
  return (
    <svg className="absolute inset-0 w-full h-full z-[6] opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="arabesque" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Eight-pointed star base */}
          <path d="M40 0 L44 16 L60 16 L48 26 L52 42 L40 32 L28 42 L32 26 L20 16 L36 16 Z" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white" />
          {/* Inner star */}
          <path d="M40 12 L42 20 L50 20 L44 24 L46 32 L40 28 L34 32 L36 24 L30 20 L38 20 Z" fill="currentColor" fillOpacity="0.3" stroke="none" className="text-white" />
          {/* Connecting lines - horizontal */}
          <line x1="0" y1="40" x2="20" y2="40" stroke="currentColor" strokeWidth="0.4" className="text-white" />
          <line x1="60" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.4" className="text-white" />
          {/* Connecting lines - vertical */}
          <line x1="40" y1="0" x2="40" y2="16" stroke="currentColor" strokeWidth="0.4" className="text-white" />
          <line x1="40" y1="42" x2="40" y2="80" stroke="currentColor" strokeWidth="0.4" className="text-white" />
          {/* Corner diamonds */}
          <path d="M0 0 L4 4 L0 8 L-4 4 Z" fill="currentColor" fillOpacity="0.2" className="text-white" transform="translate(0,36)" />
          <path d="M0 0 L4 4 L0 8 L-4 4 Z" fill="currentColor" fillOpacity="0.2" className="text-white" transform="translate(80,36)" />
          {/* Side circles */}
          <circle cx="10" cy="10" r="2" fill="currentColor" fillOpacity="0.15" className="text-white" />
          <circle cx="70" cy="70" r="2" fill="currentColor" fillOpacity="0.15" className="text-white" />
          {/* Interlocking arcs */}
          <path d="M20 40 Q30 30 40 40 Q30 50 20 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
          <path d="M40 40 Q50 30 60 40 Q50 50 40 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#arabesque)" />
    </svg>
  )
}

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
  }))

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/30 animate-float-up"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            '--float-delay': `${p.delay}s`,
            '--float-duration': `${p.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// Spotlight card with mouse tracking
function SpotlightCard({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  return (
    <div ref={cardRef} className={`card-spotlight ${className || ''}`} onMouseMove={handleMouseMove} onClick={onClick}>
      {children}
    </div>
  )
}

// 3D tilt card for testimonials
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * -8
    const tiltY = (x - 0.5) * 8
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`)
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty('--tilt-x', '0deg')
    cardRef.current.style.setProperty('--tilt-y', '0deg')
  }, [])

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// Wave SVG separator component
function WaveSeparator({ color = '#10b981', flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div className="wave-separator" style={flip ? { transform: 'scaleY(-1)' } : undefined}>
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 60 L0 35 Q150 0 300 30 Q450 60 600 30 Q750 0 900 30 Q1050 60 1200 35 L1200 60 Z"
          fill={color}
          fillOpacity="0.08"
        />
        <path
          d="M0 60 L0 40 Q150 10 300 35 Q450 55 600 35 Q750 10 900 35 Q1050 55 1200 40 L1200 60 Z"
          fill={color}
          fillOpacity="0.05"
        />
      </svg>
    </div>
  )
}

export default function HeroSection() {
  const { setActiveSection } = useAppStore()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const handleNavigate = (id: SectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-16">
      {/* Hero Banner with Glassmorphism + Particles + Parallax + Arabesque + Noise */}
      <motion.section 
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl noise-texture"
      >
        {/* Parallax background image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-banner.png)', y: parallaxY }}
        />
        {/* Multi-stop dynamic gradient overlay - emerald/teal tones */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/85 via-emerald-900/75 to-teal-900/85 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-950/40 z-10" />
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 z-10 glassmorphism" />
        {/* Arabesque geometric pattern overlay */}
        <ArabesquePattern />
        {/* Floating particles */}
        <FloatingParticles />
        {/* Decorative Elements - refined with slow rotation */}
        <div className="absolute inset-0 z-10 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full animate-slow-rotate" />
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full animate-slow-rotate-reverse" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rotate-45 animate-slow-rotate" style={{ animationDuration: '20s' }} />
          <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-white rounded-full opacity-60" />
          <div className="absolute bottom-1/3 left-[15%] w-6 h-6 bg-white rotate-45 opacity-50" />
          {/* Additional refined decorative rings */}
          <div className="absolute top-[15%] right-[10%] w-20 h-20 border border-white/50 rounded-full animate-slow-rotate" style={{ animationDuration: '22s' }} />
          <div className="absolute bottom-[15%] left-[20%] w-16 h-16 border-2 border-white/30 rotate-45 animate-slow-rotate-reverse" style={{ animationDuration: '28s' }} />
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
              className="text-base sm:text-lg text-white/80 mb-6 leading-relaxed"
            >
              منصة شاملة لتعلّم مهارات التحرير الكتابي والشفهي، مصمّمة خصيصاً للطلبة والأساتذة الجامعيين والتلاميذ. 
              اكتسب مهارات العرض والإلقاء والكتابة الإبداعية من خلال دروس مباشرة ومسجلة.
            </motion.p>
            {/* Achievement badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {achievements.map((a, idx) => (
                <span key={idx} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${a.color}`}>
                  {a.icon}
                  {a.text}
                </span>
              ))}
            </motion.div>
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

      {/* Decorative separator above stats */}
      <div className="decorative-separator">
        <span className="relative z-10 bg-background px-4 text-muted-foreground/40 text-xs">✦</span>
      </div>

      {/* Stats with animated counters + glassmorphism + animated gradient bg */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative rounded-2xl p-1"
      >
        {/* Animated gradient background for stats section */}
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-100 via-teal-50 to-amber-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-amber-950/20 animate-gradient-shift rounded-2xl opacity-60" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="text-center border-0 glassmorphism-stat shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden">
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-l ${stat.color}`} />
                <CardContent className="pt-8 pb-6 px-4">
                  {/* Icon with decorative ring */}
                  <div className="stat-icon-ring w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-bl ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Wave separator between stats and features */}
      <WaveSeparator color="#10b981" />

      {/* Features Section with numbered steps + timeline + gradient borders */}
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
        {/* Feature grid with timeline line */}
        <div className="relative">
          {/* Timeline connecting line (visible on sm+ screens) */}
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-l from-transparent via-emerald-300/30 dark:via-emerald-700/20 to-transparent -translate-y-1/2 z-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className="feature-gradient-border feature-icon-hover h-full rounded-lg">
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-500 group h-full relative overflow-hidden rounded-lg">
                    {/* Hover gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-bl ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    <CardContent className="p-6 flex items-start gap-4 relative z-10">
                      {/* Step number indicator */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-bl ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 feature-icon-inner`}>
                            {feature.icon}
                          </div>
                        </div>
                        <span className="text-[0.65rem] font-bold text-muted-foreground/50 tabular-nums">{feature.step}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Wave separator between features and cards */}
      <WaveSeparator color="#f59e0b" />

      {/* Section Cards with Spotlight + LIVE indicator + glow + dots pattern + new badge */}
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
              <SpotlightCard
                className={`cursor-pointer ${card.isNew ? 'new-badge' : ''}`}
                onClick={() => handleNavigate(card.id)}
              >
                <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden card-glow-hover card-dots-pattern">
                  <CardContent className="p-0 relative z-10">
                    <div className={`h-1.5 bg-gradient-to-l ${card.color}`} />
                    <div className={`${card.bgPattern} p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-bl ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                          {card.icon}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* LIVE pulse indicator */}
                          {card.isLive && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                              </span>
                              مباشر
                            </span>
                          )}
                          <span className="text-xs font-medium text-muted-foreground bg-background/60 px-2.5 py-1 rounded-full backdrop-blur-sm">{card.stat}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
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
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials with 3D Tilt + quote watermark + star glow + gradient bg */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative"
      >
        {/* Subtle background gradient for testimonials section */}
        <div className="absolute inset-0 -m-4 bg-gradient-to-b from-emerald-50/50 via-transparent to-amber-50/50 dark:from-emerald-950/20 dark:via-transparent dark:to-amber-950/20 rounded-3xl" />
        <div className="relative text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">ماذا يقول طلابنا؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            آراء حقيقية من مستخدمي المنصة الذين استفادوا من المحتوى التعليمي
          </p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <TiltCard>
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden group quote-watermark">
                  {/* Gradient top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-l ${testimonial.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  <CardContent className="p-6 pt-7 relative z-10">
                    {/* Star rating with glow */}
                    <div className="flex items-center gap-1 mb-3 star-glow">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="mb-4">
                      <Quote className="h-5 w-5 text-primary/30 mb-2" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.text}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-bl ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Daily Quote */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <DailyQuote />
      </motion.section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* Was this helpful */}
      <WasThisHelpful sectionId="home" title="الصفحة الرئيسية" />
    </div>
  )
}
