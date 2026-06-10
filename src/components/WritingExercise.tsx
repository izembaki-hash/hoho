'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy, Sparkles, BookOpen } from 'lucide-react'

interface Exercise {
  id: number
  sentence: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const exercises: Exercise[] = [
  {
    id: 1,
    sentence: 'الجملة الاسمية تتكون من _____ وخبر',
    options: ['مبتدأ', 'فاعل', 'مفعول به', 'نعت'],
    correctAnswer: 0,
    explanation: 'الجملة الاسمية تتكون من مبتدأ وخبر، فالمبتدأ هو الاسم المرفوع الواقع في أول الجملة الاسمية.',
  },
  {
    id: 2,
    sentence: 'علامة الترقيم التي توضع في نهاية الجملة التامة هي _____',
    options: ['الفاصلة', 'النقطة', 'الاستفهام', 'التعجب'],
    correctAnswer: 1,
    explanation: 'النقطة توضع في نهاية الجملة التامة التي يُستفاد منها معنىً تام، وهي من أهم علامات الترقيم.',
  },
  {
    id: 3,
    sentence: 'الفعل المضارع يدل على _____',
    options: ['الماضي', 'الحال أو المستقبل', 'الأمر', 'النهي'],
    correctAnswer: 1,
    explanation: 'الفعل المضارع يدل على حدث يقع في الحال أو المستقبل، مثل: يكتب، يدرس، سيعمل.',
  },
  {
    id: 4,
    sentence: 'أداة الربط التي تفيد التعليل هي _____',
    options: ['ثم', 'لكن', 'لأن', 'أو'],
    correctAnswer: 2,
    explanation: 'أداة الربط "لأن" تفيد التعليل والتعليل هو بيان سبب حدوث شيء، مثل: درست لأن الامتحان قريب.',
  },
  {
    id: 5,
    sentence: 'الأسلوب الخبري هو _____',
    options: ['أسلوب تقريري', 'أسلوب إنشائي', 'أسلوب استفهام', 'أسلوب تعجب'],
    correctAnswer: 0,
    explanation: 'الأسلوب الخبري هو أسلوب تقريري يمكن تصديقه أو تكذيبه، ويُقصد به إفادة المخاطب الحكم أو إظهار الاهتمام.',
  },
  {
    id: 6,
    sentence: 'الحال يكون _____ في الجملة',
    options: ['نكرة', 'معرفة', 'مضاف', 'مبدوء بلام'],
    correctAnswer: 0,
    explanation: 'الحال يكون نكرة في الغالب، وهو وصف منصوب يبيّن هيئة صاحبه عند وقوع الفعل، مثل: جاء الطالب مسروراً.',
  },
  {
    id: 7,
    sentence: 'الفعل الأمر يدل على _____',
    options: ['الطلب', 'الخبر', 'النفي', 'الاستفهام'],
    correctAnswer: 0,
    explanation: 'الفعل الأمر يدل على طلب القيام بالفعل، مثل: اكتب، ادرس، اجتهد. وهو من الأساليب الإنشائية الطلبية.',
  },
  {
    id: 8,
    sentence: 'الفاصلة المنقوطة (؛) توضع بين _____',
    options: ['جملتين مرتبطتين', 'جملتين مستقلتين', 'أسئلة', 'تعجب'],
    correctAnswer: 0,
    explanation: 'الفاصلة المنقوطة توضع بين جملتين مرتبطتين في المعنى كالسبب والنتيجة، مثل: اجتهد؛ فنجح.',
  },
  {
    id: 9,
    sentence: 'النعت يتبع المنعوت في _____',
    options: ['الرفع فقط', 'النصب فقط', 'الإعراب', 'الابتداء'],
    correctAnswer: 2,
    explanation: 'النعت يتبع المنعوت في الإعراب (رفعاً ونصباً وجراً) وفي التعريف والتنكير، فهو توابعُ للمنعوت.',
  },
  {
    id: 10,
    sentence: 'التشبيه يتكون من مشبه ومشبه به و_____',
    options: ['حرف تشبيه', 'فعل', 'اسم', 'ظرف'],
    correctAnswer: 0,
    explanation: 'التشبيه يتكون من: المشبه، المشبه به، وحرف التشبيه (مثل: الكاف، كأنّ)، وقد تُذكر أداة التشبيه أو تُحذف.',
  },
]

export default function WritingExercise() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(exercises.length).fill(null))

  const exercise = exercises[currentQuestion]
  const progressPercent = ((currentQuestion + (isAnswered ? 1 : 0)) / exercises.length) * 100

  const handleSelectAnswer = useCallback((index: number) => {
    if (isAnswered) return

    setSelectedAnswer(index)
    setIsAnswered(true)

    const isCorrect = index === exercise.correctAnswer
    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestion] = isCorrect
      return newAnswers
    })
  }, [isAnswered, exercise.correctAnswer, currentQuestion])

  const handleNext = useCallback(() => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsComplete(true)
    }
  }, [currentQuestion])

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setIsComplete(false)
    setAnswers(Array(exercises.length).fill(null))
  }, [])

  const getScoreMessage = () => {
    const percentage = (score / exercises.length) * 100
    if (percentage === 100) return { message: 'ممتاز! أداء مثالي! 🌟', color: 'text-emerald-600 dark:text-emerald-400' }
    if (percentage >= 80) return { message: 'جيد جداً! استمر في التميز! ⭐', color: 'text-emerald-600 dark:text-emerald-400' }
    if (percentage >= 60) return { message: 'جيد! حاول التحسن أكثر! 💪', color: 'text-amber-600 dark:text-amber-400' }
    if (percentage >= 40) return { message: 'لا بأس، تحتاج مزيداً من المراجعة! 📖', color: 'text-orange-600 dark:text-orange-400' }
    return { message: 'تحتاج مراجعة شاملة، لا تستسلم! 💪', color: 'text-red-600 dark:text-red-400' }
  }

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return 'border-border/60 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200'
    }

    if (index === exercise.correctAnswer) {
      return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
    }

    if (index === selectedAnswer && index !== exercise.correctAnswer) {
      return 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
    }

    return 'border-border/30 opacity-50'
  }

  const getOptionIcon = (index: number) => {
    if (!isAnswered) return null

    if (index === exercise.correctAnswer) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
    }

    if (index === selectedAnswer && index !== exercise.correctAnswer) {
      return <XCircle className="h-5 w-5 text-red-500 shrink-0" />
    }

    return null
  }

  // Results screen
  if (isComplete) {
    const scoreInfo = getScoreMessage()
    const percentage = Math.round((score / exercises.length) * 100)

    return (
      <Card className="border-0 shadow-lg gradient-border-animate overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center space-y-6"
          >
            {/* Trophy animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-bl from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30"
            >
              <Trophy className="h-10 w-10 text-amber-500" />
            </motion.div>

            {/* Score circle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative inline-flex items-center justify-center w-32 h-32"
            >
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
                  className="text-emerald-500"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - percentage / 100) }}
                  transition={{ delay: 0.6, duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-xs text-muted-foreground">من {exercises.length}</span>
              </div>
            </motion.div>

            {/* Score message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className={`text-lg font-bold ${scoreInfo.color}`}>{scoreInfo.message}</p>
              <p className="text-sm text-muted-foreground mt-1">نسبة النجاح: {percentage}%</p>
            </motion.div>

            {/* Answer summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex justify-center gap-2 flex-wrap"
            >
              {answers.map((answer, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    answer === true
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : answer === false
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </motion.div>

            {/* Restart button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                onClick={handleRestart}
                className="gap-2 bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                إعادة التمرين
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  // Exercise screen
  return (
    <Card className="border-0 shadow-lg gradient-border-animate overflow-hidden">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            تمارين تفاعلية - املأ الفراغ
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {score} / {exercises.length}
          </Badge>
        </div>
        {/* Progress bar */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>السؤال {currentQuestion + 1} من {exercises.length}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        {/* Step indicators */}
        <div className="flex gap-1 mt-2">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < currentQuestion
                  ? answers[i] === true
                    ? 'bg-emerald-500'
                    : answers[i] === false
                      ? 'bg-red-500'
                      : 'bg-muted-foreground/30'
                  : i === currentQuestion
                    ? 'bg-primary'
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-5"
          >
            {/* Question */}
            <div className="p-4 sm:p-5 rounded-xl bg-muted/40 border border-border/50">
              <p className="text-base sm:text-lg font-semibold leading-relaxed text-center" dir="rtl">
                {exercise.sentence.split('_____').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="inline-block px-3 py-0.5 mx-1 rounded-md bg-primary/10 border border-primary/30 text-primary font-bold text-sm">
                        _____
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exercise.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.25 }}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered}
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 text-right transition-all duration-200 focus-ring-enhanced ${getOptionStyle(index)}`}
                  dir="rtl"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isAnswered && index === exercise.correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : isAnswered && index === selectedAnswer && index !== exercise.correctAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {getOptionIcon(index) || String.fromCharCode(1571 + index)}
                  </span>
                  <span className="font-medium text-sm sm:text-base flex-1">{option}</span>
                </motion.button>
              ))}
            </div>

            {/* Explanation (shown after answering) */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 rounded-xl border ${
                    selectedAnswer === exercise.correctAnswer
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                  }`}>
                    <div className="flex items-start gap-2">
                      <Sparkles className={`h-5 w-5 shrink-0 mt-0.5 ${
                        selectedAnswer === exercise.correctAnswer
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`} />
                      <div>
                        <p className={`text-sm font-bold mb-1 ${
                          selectedAnswer === exercise.correctAnswer
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-amber-700 dark:text-amber-300'
                        }`}>
                          {selectedAnswer === exercise.correctAnswer ? 'إجابة صحيحة! ✓' : `إجابة خاطئة. الإجابة الصحيحة: ${exercise.options[exercise.correctAnswer]}`}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {exercise.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Next button */}
                  <div className="flex justify-start mt-4">
                    <Button
                      onClick={handleNext}
                      className="gap-2 bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    >
                      {currentQuestion < exercises.length - 1 ? 'السؤال التالي' : 'عرض النتائج'}
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
