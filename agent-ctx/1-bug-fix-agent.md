# Task 1 - Bug Fix Agent

## Task: Fix nested `<button>` inside `<AccordionTrigger>` (INVALID HTML hydration error)

## Summary
Fixed the hydration error caused by nesting `<button>` elements inside `<AccordionTrigger>` components, which themselves render as `<button>`. This is invalid HTML per the spec.

## Files Modified
1. `/home/z/my-project/src/components/sections/OralExpressionSection.tsx` - Line ~470
2. `/home/z/my-project/src/components/sections/WrittenExpressionSection.tsx` - Line ~775

## Changes
- Replaced `<button>` with `<div role="button" tabIndex={0}>` in both files
- Added `onKeyDown` handler for Enter/Space keys to maintain keyboard accessibility
- Added `cursor-pointer` class for proper visual cursor
- Closing tags changed from `</button>` to `</div>`

## Verification
- `bun run lint` passes cleanly with no errors
