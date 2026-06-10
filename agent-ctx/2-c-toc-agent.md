# Task 2-c: TableOfContents Sidebar Component

## Task Summary
Created a TableOfContents sidebar component and integrated it into the oral/written expression sections of the Arabic RTL educational website.

## Files Created
- `/src/components/TableOfContents.tsx` - Sticky TOC sidebar component

## Files Modified
- `/src/components/sections/OralExpressionSection.tsx` - Added TOC integration with IDs and flex layout
- `/src/components/sections/WrittenExpressionSection.tsx` - Added TOC integration with IDs and flex layout
- `/src/app/globals.css` - Added TOC-specific CSS styles

## Key Implementation Details

### TableOfContents Component
- Uses IntersectionObserver to track which heading is currently in viewport
- Sticky positioning (`sticky top-24`) with desktop-only visibility (`hidden lg:block`)
- Glassmorphism background (`bg-card/80 backdrop-blur-md`)
- Active heading has primary color, right border (RTL), and indicator dot
- Smooth scroll on click with navbar offset
- Progress indicator showing position (e.g., 2/5)
- Compact text sizes with scroll overflow support

### Integration Pattern
- Content sections wrapped in `flex gap-6` layout
- Main content uses `flex-1 min-w-0`
- TOC placed as sibling element on the left (in RTL: appears on left side visually)
- ID format: `oral-{audience}-{key}` and `written-{audience}-{key}`
- `scroll-mt-24` added to each content card for proper scroll offset
- TOC items update dynamically when audience tab changes

## Verification
- ESLint passes cleanly
- Dev server compiles without errors
- All pages return 200 status
