'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface AnimatedCounterProps {
  value: string
  duration?: number
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const animateValue = useCallback(() => {
    const numericPart = parseInt(value.replace(/[^0-9]/g, ''))
    const suffix = value.replace(/[0-9]/g, '')
    const startTime = Date.now()

    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
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
  }, [value, duration])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateValue()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, animateValue])

  return <div ref={ref}>{displayValue}</div>
}
