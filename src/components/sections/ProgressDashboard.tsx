'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, Mic, Pen, Trophy, Target, Flame, 
  GraduationCap, Users, School, Star, TrendingUp,
  CheckCircle2, Lock
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

const learningPaths = [
  {
    id: 'oral-basics',
    title: 'أساسيات التعبير الشفهي',
    icon: <Mic className="h-5 w-5" />,
    color: 'from-teal-500 to-teal-700',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    textColor: 'text-teal-600 dark:text-teal-400',
    totalTopics: 5,
    category: 'oral-expression',
  },
  {
    id: 'oral-advanced',
    title: 'الإلقاء الإبداعي المتقدم',
    icon: <Star className="h-5 w-5" />,
    color: 'from-purple-500 to-purple-700',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    totalTopics: 3,
    category: 'oral-expression',
  },
  {
    id: 'written-basics',
    title: 'أساسيات الكتابة الإبداعية',
    icon: <Pen className="h-5 w-5" />,
    color: 'from-primary to-emerald-800',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    totalTopics: 5,
    category: 'written-expression',
  },
  {
    id: 'written-advanced',
    title: 'الكتابة الأكاديمية والمهنية',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'from-amber-500 to-amber-700',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    totalTopics: 4,
    category: 'written-expression',
  },
]

const achievements = [
  { id: 'first-visit', title: 'الزيارة الأولى', description: 'زرت المنصة لأول مرة', icon: <Target className="h-5 w-5" />, unlocked: true, color: 'text-emerald-500' },
  { id: 'reader', title: 'قارئ نهم', description: 'حفظت 5 محتويات', icon: <BookOpen className="h-5 w-5" />, unlocked: false, color: 'text-amber-500' },
  { id: 'listener', title: 'مستمع جيد', description: 'استمعت لمحتوى صوتي', icon: <Mic className="h-5 w-5" />, unlocked: false, color: 'text-teal-500' },
  { id: 'scholar', title: 'باحث متميز', description: 'استكشفت جميع الأقسام', icon: <GraduationCap className="h-5 w-5" />, unlocked: false, color: 'text-purple-500' },
  { id: 'writer', title: 'كاتب مبتدئ', description: 'أعطيت تقييماً إيجابياً', icon: <Pen className="h-5 w-5" />, unlocked: false, color: 'text-primary' },
  { id: 'master', title: 'أستاذ الخطابة', description: 'أكملت مسار التعبير الشفهي', icon: <Trophy className="h-5 w-5" />, unlocked: false, color: 'text-amber-500' },
]

export default function ProgressDashboard() {
  const { bookmarks } = useAppStore()

  // Calculate progress
  const oralBookmarks = bookmarks.filter(b => b.startsWith('oral-')).length
  const writtenBookmarks = bookmarks.filter(b => b.startsWith('written-')).length
  const totalBookmarks = bookmarks.length
  const totalSectionsVisited = 7 // This could be tracked dynamically
  
  // Simple progress calculation
  const overallProgress = Math.min(100, Math.round((totalBookmarks / 14) * 100))

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-bl from-primary to-emerald-800 flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/20 mb-4">
          <TrendingUp className="h-9 w-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">لوحة التقدم التعليمي</h2>
        <p className="text-muted-foreground">تتبع تقدمك في رحلة تعلّم مهارات التحرير الكتابي والشفهي</p>
      </motion.div>

      {/* Overall Progress Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-l from-primary via-emerald-500 to-amber-500" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke="currentColor"
                    className="text-primary" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallProgress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
                  <span className="text-[10px] text-muted-foreground">مكتمل</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-right">
                <h3 className="text-xl font-bold mb-2">تقدمك العام</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {overallProgress < 25
                    ? 'ابدأ رحلتك التعليمية باستكشاف المحتوى المتاح!'
                    : overallProgress < 50
                    ? 'أنت في الطريق الصحيح! واصل الاستكشاف والتعلّم.'
                    : overallProgress < 75
                    ? 'تقدم ممتاز! لقد أنجزت أكثر من النصف.'
                    : 'مذهل! أنت قريب من إتمام رحلتك التعليمية!'}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <div className="flex items-center gap-1.5 text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">{totalBookmarks}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs">محتوى محفوظ</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-400 font-medium">{totalSectionsVisited}</span>
                    <span className="text-amber-600 dark:text-amber-400 text-xs">أقسام مستكشفة</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Paths */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          مسارات التعلّم
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {learningPaths.map((path, idx) => {
            const pathBookmarks = path.category === 'oral-expression' ? oralBookmarks : writtenBookmarks
            const progress = Math.min(100, Math.round((pathBookmarks / path.totalTopics) * 100))
            return (
              <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-bl ${path.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {path.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1">{path.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{pathBookmarks}/{path.totalTopics} موضوع</span>
                        <Badge variant="outline" className={`text-[10px] h-4 ${path.textColor}`}>
                          {progress}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Audience Stats */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          تقدم حسب الفئة
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'الطلبة الجامعيين', icon: <GraduationCap className="h-6 w-6" />, bookmarkPrefix: 'students', color: 'from-emerald-500 to-emerald-700', topics: 14 },
            { label: 'الأساتذة الجامعيين', icon: <Users className="h-6 w-6" />, bookmarkPrefix: 'professors', color: 'from-amber-500 to-amber-700', topics: 14 },
            { label: 'التلاميذ', icon: <School className="h-6 w-6" />, bookmarkPrefix: 'pupils', color: 'from-teal-500 to-teal-700', topics: 14 },
          ].map((audience, idx) => {
            const audienceBookmarks = bookmarks.filter(b => b.includes(audience.bookmarkPrefix)).length
            const progress = Math.min(100, Math.round((audienceBookmarks / audience.topics) * 100))
            return (
              <Card key={idx} className="border-0 shadow-sm text-center group hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className={`h-1 bg-gradient-to-l ${audience.color}`} />
                <CardContent className="p-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-bl ${audience.color} flex items-center justify-center text-white mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {audience.icon}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{audience.label}</h4>
                  <p className="text-2xl font-bold text-primary mb-1">{progress}%</p>
                  <p className="text-xs text-muted-foreground">{audienceBookmarks}/{audience.topics} موضوع محفوظ</p>
                  <Progress value={progress} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          الإنجازات
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`border-0 shadow-sm text-center transition-all duration-300 overflow-hidden ${
                achievement.unlocked
                  ? 'hover:shadow-md cursor-default'
                  : 'opacity-60 grayscale'
              }`}
            >
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-gradient-to-bl from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30'
                    : 'bg-muted'
                }`}>
                  {achievement.unlocked ? (
                    <span className={achievement.color}>{achievement.icon}</span>
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <h4 className="font-bold text-xs mb-0.5">{achievement.title}</h4>
                <p className="text-[10px] text-muted-foreground leading-tight">{achievement.description}</p>
                {achievement.unlocked && (
                  <Badge className="mt-1.5 bg-amber-100 text-amber-700 border-0 text-[9px] h-4">
                    <CheckCircle2 className="h-2.5 w-2.5 ml-0.5" />
                    مفتوح
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-sm bg-gradient-to-l from-primary/5 via-transparent to-emerald-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold mb-2 flex items-center justify-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              نصائح لتحسين تقدمك
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-background shadow-sm">
                <p className="text-xs text-muted-foreground">💡 احفظ المحتويات المهمة بالضغط على أيقونة الحفظ</p>
              </div>
              <div className="p-3 rounded-xl bg-background shadow-sm">
                <p className="text-xs text-muted-foreground">🎧 استخدم ميزة الاستماع الصوتي للتعلم أثناء التنقل</p>
              </div>
              <div className="p-3 rounded-xl bg-background shadow-sm">
                <p className="text-xs text-muted-foreground">📖 اقرأ محتوى الفئات الثلاث لتحصل على رؤية شاملة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
