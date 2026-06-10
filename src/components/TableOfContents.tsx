'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { List } from 'lucide-react'

interface TableOfContentsProps {
  items: { id: string; label: string; level?: number }[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the first intersecting entry that is visible
    const visibleEntries = entries.filter(entry => entry.isIntersecting)
    if (visibleEntries.length > 0) {
      // Pick the topmost visible element
      const sorted = visibleEntries.sort((a, b) => {
        const rectA = a.boundingClientRect
        const rectB = b.boundingClientRect
        return rectA.top - rectB.top
      })
      setActiveId(sorted[0].target.id)
    }
  }, [])

  useEffect(() => {
    if (items.length === 0) return

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 0.25, 0.5],
    })

    // Observe all section elements
    items.forEach(item => {
      const element = document.getElementById(item.id)
      if (element) {
        observerRef.current!.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [items, handleIntersection])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Slightly offset for fixed navbar
      window.scrollBy({ top: -80, behavior: 'smooth' })
    }
  }

  if (items.length === 0) return null

  return (
    <nav
      className="hidden lg:block sticky top-24 w-56 shrink-0"
      aria-label="جدول المحتويات"
    >
      <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-md p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
          <List className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold text-foreground">جدول المحتويات</h4>
        </div>

        {/* Items */}
        <ul className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`
                    w-full text-right px-3 py-2 rounded-lg text-xs transition-all duration-200
                    flex items-center gap-2 group relative
                    ${item.level === 2 ? 'pr-6' : ''}
                    ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold border-r-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-r-2 border-transparent'
                    }
                  `}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {/* Active indicator dot */}
                  <span
                    className={`
                      shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-200
                      ${isActive ? 'bg-primary' : 'bg-muted-foreground/40 group-hover:bg-muted-foreground'}
                    `}
                  />
                  <span className="line-clamp-2 leading-relaxed">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Progress indicator */}
        {activeId && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="shrink-0">
                {items.findIndex(i => i.id === activeId) + 1}/{items.length}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width: `${((items.findIndex(i => i.id === activeId) + 1) / items.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
