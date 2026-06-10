import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SectionId = 
  | 'home' 
  | 'about' 
  | 'live-lessons' 
  | 'recorded-lessons' 
  | 'oral-expression' 
  | 'written-expression' 
  | 'contact'

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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeSection: 'home',
      setActiveSection: (section) => set({ activeSection: section, mobileMenuOpen: false }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
        }
      },
      bookmarks: [],
      toggleBookmark: (id) => {
        const bookmarks = get().bookmarks
        if (bookmarks.includes(id)) {
          set({ bookmarks: bookmarks.filter(b => b !== id) })
        } else {
          set({ bookmarks: [...bookmarks, id] })
        }
      },
      isBookmarked: (id) => get().bookmarks.includes(id),
    }),
    {
      name: 'alta7reer-store',
      partialize: (state) => ({ 
        theme: state.theme, 
        bookmarks: state.bookmarks 
      }),
    }
  )
)
