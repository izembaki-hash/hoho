# Task 8 - ContentReader Component

## Agent: Content Reader Agent

## Task
Create a ContentReader component that allows users to listen to educational content being read aloud via a floating button.

## Work Completed

### 1. Created `/api/tts` API Route
- **File**: `src/app/api/tts/route.ts`
- Uses z-ai-web-dev-sdk for TTS generation
- Supports Arabic text input with configurable voice (default: tongtong) and speed (0.5-2.0)
- Text chunking for content exceeding 1024 characters (splits by Arabic/general sentence punctuation)
- Returns WAV audio format
- Proper validation and error handling with Arabic error messages

### 2. Created ContentReader Component
- **File**: `src/components/ContentReader.tsx`
- Floating circular button (fixed, bottom-left for RTL) with Volume2 icon when idle
- Loading state: spinner with "جاري إنشاء الصوت..." text
- Playing/paused state: mini audio player with play/pause/stop controls and animated progress bar
- Error toast with dismiss button
- Uses HTML5 Audio API for playback
- Smooth framer-motion animations (AnimatePresence)
- Dark mode compatible (bg-card, border-border, text-muted-foreground)
- RTL-aware positioning (left-6 for RTL)
- Proper cleanup on unmount (revokes object URLs, pauses audio)

### 3. Updated ScrollToTop Position
- **File**: `src/components/ScrollToTop.tsx`
- Changed from `left-6` to `right-6` to avoid overlap with ContentReader
- In RTL: ContentReader at bottom-left, ScrollToTop at bottom-right

### 4. Integrated ContentReader into page.tsx
- **File**: `src/app/page.tsx`
- Added Arabic content summaries for each of the 7 sections
- Content passed as prop based on active section
- All content strings are under 1024 characters for single TTS API call

### 5. Bug Fix
- TTS API initially used mp3 format which wasn't supported; changed to wav format

## Files Modified
- `src/app/api/tts/route.ts` (new)
- `src/components/ContentReader.tsx` (new)
- `src/components/ScrollToTop.tsx` (modified - position change)
- `src/app/page.tsx` (modified - added ContentReader integration)
- `worklog.md` (updated with task 8 entry)
