import { create } from 'zustand'

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
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section, mobileMenuOpen: false }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}))
