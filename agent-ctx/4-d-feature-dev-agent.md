# Task 4-d: Reading Time Estimation + Print Feature

## Agent: Feature Development Agent

### Work Completed:

#### 1. Created useReadingTime hook (`/src/hooks/useReadingTime.ts`)
- Custom hook for estimating Arabic reading time
- Arabic reading speed: ~180 words per minute (slower than English due to RTL complexity)
- Input: `string` text or `number` word count
- Output: `{ minutes: number, words: number, displayText: string }`
- `displayText` format: Arabic grammar-aware:
  - 0 → "0 دقائق قراءة"
  - 1 → "دقيقة قراءة"
  - 2 → "دقيقتان قراءة"
  - 3-10 → "X دقائق قراءة"
  - 11+ → "X دقيقة قراءة"
- Exports: `useReadingTime(text)` and `useReadingTimeFromWordCount(wordCount)`
- Handles edge cases: empty text (0), very short text (1 min minimum)
- Helper function `countArabicWords()` properly counts words by splitting on whitespace

#### 2. Created PrintButton component (`/src/components/PrintButton.tsx`)
- Button with Printer icon and "طباعة المحتوى" label (hidden text on mobile)
- Before printing: adds `printing` class to body + injects print header with site name and section title
- After printing: removes class + cleans up injected header via `afterprint` event + timeout fallback
- Uses `useAppStore` to get current active section for print header
- Has `no-print` class on the button itself (hidden during print)
- `dir="rtl"` for proper Arabic rendering
- Responsive: icon only on mobile, icon + text on desktop

#### 3. Added Enhanced Print Styles to globals.css
- Appended `@media print` block at end of file with:
  - Hides: `.no-print`, `[data-floating-button]`, `.scroll-to-top`, `.chatbot-widget`, `.glossary-widget`, `.mobile-bottom-nav`, `.achievement-toast`, `.share-system`, `.keyboard-shortcuts-modal`, `.reading-mode-toolbar`, `.print-button`, etc.
  - Body `.printing` class: white background, black text, 12pt font, 1.8 line-height
  - `main` reset: no padding/margin, 100% max-width
  - Shadow removal for `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`
  - Page break utilities: `.page-break-before`, `.page-break-after`, `.no-page-break`
  - Print header display: `.print-header` with centered text, border-bottom, padding

#### 4. Integrated Reading Time into 6 Section Components
Each section now shows a Badge with 📖 reading time estimate:

1. **OralExpressionSection.tsx**: ~2700 words → "15 دقيقة قراءة" (teal-themed badge)
2. **WrittenExpressionSection.tsx**: ~3600 words → "20 دقيقة قراءة" (primary-themed badge)
3. **AboutSection.tsx**: ~1800 words → "10 دقائق قراءة" (primary-themed badge)
4. **ContactSection.tsx**: ~1200 words → "7 دقائق قراءة" (primary-themed badge)
5. **LiveLessonsSection.tsx**: ~1500 words → "9 دقائق قراءة" (red-themed badge matching section)
6. **RecordedLessonsSection.tsx**: ~2100 words → "12 دقيقة قراءة" (amber-themed badge matching section)

All badges use `useReadingTimeFromWordCount()` hook, wrapped in `motion.div` with `itemVariants`, have `Clock` icon, and use section-appropriate color theming.

#### 5. Updated page.tsx
- Replaced inline `Printer` icon import with `PrintButton` component import
- Replaced inline print `Button` with `<PrintButton />` component in breadcrumb area
- Removed unused `handlePrint` callback and `Printer` import

### Lint Status:
- ✅ `bun run lint` passes with no errors
- ✅ Dev server compiling successfully
- ✅ GET / 200
