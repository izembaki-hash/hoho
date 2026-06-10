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

export const useAppStore = create<AppState>()((set, get) => ({
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section, mobileMenuOpen: false }),
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
}))
