'use client'

import { motion } from 'framer-motion'
import ShareButton from '@/components/ShareButton'

interface SectionHeaderProps {
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  shareTitle?: string
}

export default function SectionHeader({ title, description, icon, gradient, shareTitle }: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4"
    >
      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-bl ${gradient} flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/20`}>
        {icon}
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{description}</p>
      </div>
      {shareTitle && (
        <div className="flex justify-center pt-2">
          <ShareButton title={shareTitle} />
        </div>
      )}
    </motion.div>
  )
}
