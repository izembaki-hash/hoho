import { create } from 'zustand'

export type SectionId = 
  | 'home' 
  | 'about' 
  | 'live-lessons' 
  | 'recorded-lessons' 
  | 'oral-expression' 
  | 'written-expression' 
  | 'contact'
  | 'progress'
  | 'quiz'

interface AppState {
  activeSection: SectionId
  setActiveSection: (section: SectionId) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  bookmarks: string[]
  toggleBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean
  skeletonSection: string | null
}

function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem('alta7reer-theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch {}
  return 'light'
}

function getStoredBookmarks(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('alta7reer-bookmarks')
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

// Module-level tracking for skeleton loading (no re-render needed for this)
let skeletonTimeoutId: ReturnType<typeof setTimeout> | null = null
const loadedSections = new Set<string>(['home'])

export const useAppStore = create<AppState>()((set, get) => ({
  activeSection: 'home',
  setActiveSection: (section) => {
    // Clear any pending skeleton timeout
    if (skeletonTimeoutId) {
      clearTimeout(skeletonTimeoutId)
      skeletonTimeoutId = null
    }

    // Check if this section needs a skeleton loading state
    const needsSkeleton = !loadedSections.has(section)

    set({
      activeSection: section,
      mobileMenuOpen: false,
      skeletonSection: needsSkeleton ? section : null,
    })

    // Auto-clear skeleton after 400ms and mark section as loaded
    if (needsSkeleton) {
      skeletonTimeoutId = setTimeout(() => {
        loadedSections.add(section)
        // Only clear if still showing this section's skeleton
        if (get().skeletonSection === section) {
          set({ skeletonSection: null })
        }
        skeletonTimeoutId = null
      }, 400)
    }
  },
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  theme: getStoredTheme(),
  setTheme: (theme) => {
    set({ theme })
    if (typeof window !== 'undefined') {
      localStorage.setItem('alta7reer-theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: newTheme })
    if (typeof window !== 'undefined') {
      localStorage.setItem('alta7reer-theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
  },
  bookmarks: getStoredBookmarks(),
  toggleBookmark: (id) => {
    const bookmarks = get().bookmarks
    const newBookmarks = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id]
    set({ bookmarks: newBookmarks })
    if (typeof window !== 'undefined') {
      localStorage.setItem('alta7reer-bookmarks', JSON.stringify(newBookmarks))
    }
  },
  isBookmarked: (id) => get().bookmarks.includes(id),
  skeletonSection: null,
}))
