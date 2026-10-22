# Testing and Verification

## Automated CI
The GitHub Actions release gate runs:
1. ESLint
2. Vitest
3. TypeScript production type-check
4. Vite production build

Current automated suite: 7 test files, 12 tests.

Coverage includes:
- Arithmetic generation across all four operations and four difficulty levels
- Unique answer choices, integer-safe division, non-negative subtraction
- Statistics calculations
- localStorage settings and malformed-data recovery
- Active-session snapshot save/restore
- Setup requirements and operation validation
- Settings persistence and privacy content
- Practice card rendering, keyboard number selection, reveal/self-report flow

## Manual release checklist
- [ ] Public URL opens without console errors.
- [ ] Regular and Mistake Review modes work.
- [ ] All four operations and all four difficulty levels work.
- [ ] 5/10/20/Continuous sessions work.
- [ ] Refresh during a session restores question/selection/reveal state.
- [ ] Navigating away during an active session triggers confirmation.
- [ ] Fixed sessions end at the correct length and show an accurate summary.
- [ ] Mistakes are saved, reviewed, and mastered according to threshold.
- [ ] Overall, operation, difficulty, mistake, and recent-session statistics update.
- [ ] Settings persist and affect behavior.
- [ ] Clear All Application Data resets the application.
- [ ] Phone/tablet layouts, 200% zoom, keyboard focus, and reduced-motion mode remain usable.
