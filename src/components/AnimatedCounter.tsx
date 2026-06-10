'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: string
  duration?: number
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const hasAnimatedRef = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasAnimatedRef.current) return

    const numericPart = parseInt(value.replace(/[^0-9]/g, ''))
    const suffix = value.replace(/[0-9]/g, '')

    if (numericPart === 0) return

    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true
      setDisplayValue('0')
      const startTime = Date.now()

      const step = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.floor(eased * numericPart)
        setDisplayValue(`${current}${suffix}`)
        
        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          setDisplayValue(value)
        }
      }

      requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
      if (isInViewport) {
        startAnimation()
        return
      }
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration])

  return <div ref={ref}>{displayValue}</div>
}
