'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'

interface ShortcutItem {
  keys: string[]
  description: string
}

interface ShortcutCategory {
  title: string
  icon: string
  shortcuts: ShortcutItem[]
}

const shortcutCategories: ShortcutCategory[] = [
  {
    title: 'التنقل',
    icon: '🧭',
    shortcuts: [
      { keys: ['1-9'], description: 'التنقل بين الأقسام' },
      { keys: ['⌘K', 'Ctrl+K'], description: 'بحث' },
      { keys: ['Escape'], description: 'إغلاق النوافذ' },
    ],
  },
  {
    title: 'الميزات',
    icon: '✨',
    shortcuts: [
      { keys: ['R'], description: 'وضع القراءة' },
      { keys: ['?'], description: 'عرض الاختصارات' },
    ],
  },
  {
    title: 'العرض',
    icon: '🖥️',
    shortcuts: [
      { keys: ['D'], description: 'تبديل المظهر' },
    ],
  },
]

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Listen for custom event to open shortcuts panel
  useEffect(() => {
    const handleOpenShortcuts = () => setIsOpen(true)
    const handleCloseShortcuts = () => setIsOpen(false)
    window.addEventListener('open-shortcuts', handleOpenShortcuts)
    window.addEventListener('close-shortcuts', handleCloseShortcuts)
    return () => {
      window.removeEventListener('open-shortcuts', handleOpenShortcuts)
      window.removeEventListener('close-shortcuts', handleCloseShortcuts)
    }
  }, [])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Card with gradient border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
          >
            {/* Gradient border wrapper */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-bl from-emerald-500 via-amber-500 to-teal-500 opacity-75" />
            <div className="relative bg-background rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-bl from-primary to-emerald-700 flex items-center justify-center shadow-md">
                    <Keyboard className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">اختصارات لوحة المفاتيح</h2>
                    <p className="text-xs text-muted-foreground">استخدم الاختصارات للتنقل السريع</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Shortcut categories */}
              <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {shortcutCategories.map((category) => (
                  <div key={category.title}>
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{category.icon}</span>
                      <h3 className="text-sm font-bold text-foreground">{category.title}</h3>
                    </div>

                    {/* Shortcuts grid */}
                    <div className="grid gap-2">
                      {category.shortcuts.map((shortcut) => (
                        <div
                          key={shortcut.description}
                          className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm text-muted-foreground">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1" dir="ltr">
                            {shortcut.keys.map((key, idx) => (
                              <span key={idx}>
                                <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-foreground shadow-sm">
                                  {key}
                                </kbd>
                                {idx < shortcut.keys.length - 1 && (
                                  <span className="mx-1 text-[10px] text-muted-foreground">/</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border bg-muted/30">
                <p className="text-[11px] text-muted-foreground text-center">
                  اضغط <kbd className="inline-flex h-4 items-center rounded border bg-background px-1 font-mono text-[9px] font-medium mx-0.5">?</kbd> في أي وقت لعرض هذه اللوحة
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
