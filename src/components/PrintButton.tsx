'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const sectionTitles: Record<string, string> = {
  home: 'الرئيسية',
  about: 'نبذة عن المؤلف',
  'live-lessons': 'دروس مباشرة',
  'recorded-lessons': 'دروس مسجلة',
  'oral-expression': 'التحرير الشفهي',
  'written-expression': 'التحرير الكتابي',
  contact: 'اتصل بنا',
  progress: 'لوحة التقدم',
  quiz: 'اختبار المعرفة',
}

export default function PrintButton() {
  const { activeSection } = useAppStore()
  const sectionTitle = sectionTitles[activeSection] || 'التحرير الكتابي والشفهي'

  const handlePrint = useCallback(() => {
    // Add print class to body before printing
    document.body.classList.add('printing')

    // Create a print header element
    const printHeader = document.createElement('div')
    printHeader.className = 'print-header'
    printHeader.innerHTML = `
      <h1 style="font-size: 18pt; font-weight: bold; margin: 0 0 4px 0; color: #10b981;">التحرير الكتابي والشفهي</h1>
      <p style="font-size: 12pt; margin: 0; color: #555;">${sectionTitle}</p>
    `

    // Insert print header at the beginning of main
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.insertBefore(printHeader, mainElement.firstChild)
    }

    // Trigger print
    window.print()

    // Clean up after print dialog closes
    const cleanup = () => {
      document.body.classList.remove('printing')
      if (printHeader.parentNode) {
        printHeader.parentNode.removeChild(printHeader)
      }
    }

    // Clean up after a small delay to ensure print dialog has processed
    setTimeout(cleanup, 1000)

    // Also listen for afterprint event for immediate cleanup
    const afterPrintHandler = () => {
      cleanup()
      window.removeEventListener('afterprint', afterPrintHandler)
    }
    window.addEventListener('afterprint', afterPrintHandler)
  }, [sectionTitle])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handlePrint}
      className="no-print h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      dir="rtl"
    >
      <Printer className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">طباعة المحتوى</span>
    </Button>
  )
}
