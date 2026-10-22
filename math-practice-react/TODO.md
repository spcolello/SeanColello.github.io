# Implementation Plan

## Phase 1 — Project Setup
- [x] Vite React TypeScript project
- [x] ESLint, Prettier, Vitest, React Testing Library
- [x] Shared TypeScript types and folder structure

## Phase 2 — Basic Interface and Routing
- [x] Shared layout, header, navigation, home page, routing

## Phase 3 — Practice Setup
- [x] Multi-select operations
- [x] Beginner, Easy, Intermediate, Advanced
- [x] 5, 10, 20, Continuous practice
- [x] Validation and config handoff

## Phase 4 — Question Generation
- [x] All four operation generators
- [x] Whole-number division and non-negative subtraction
- [x] Validation, retries, fallback questions

## Phase 5 — Answer Choices
- [x] Four unique shuffled choices containing the answer

## Phase 6 — Question Card
- [x] Answer selection, reveal, self-report
- [x] Explanations and child-friendly feedback

## Phase 7 — Practice Session Flow
- [x] Progress, fixed sessions, continuous sessions

## Phase 8 — Completion and Summary
- [x] Attempted/correct/incorrect/accuracy
- [x] Practice again, mistakes, settings, statistics, home actions

## Phase 9 — Persistence
- [x] localStorage for settings, sessions, attempts, mistakes
- [x] Validation and malformed-data recovery

## Phase 10 — Statistics
- [x] Overall totals, operation accuracy, recent sessions

## Phase 11 — Settings
- [x] Sound, animation, explanations, feedback
- [x] Default operations/difficulty/session length
- [x] Mastery threshold and clear-all-data

## Phase 12 — Mistake Tracking
- [x] Mistake pattern storage and repeat counts

## Phase 13 — Similar Questions and Mastery
- [x] Similar question generation and mastery progress

## Phase 14 — Mistake Review
- [x] Active/mastered review and targeted review sessions

## Phase 15 — Advanced Statistics
- [x] Mistake insights, frequent facts, active/mastered counts

## Phase 16 — Accessibility
- [x] Keyboard navigation and number keys 1–4
- [x] Screen-reader labels/live progress
- [x] Reduced motion and visible focus

## Phase 17 — Responsive Design and Polish
- [x] Mobile/tablet layouts and touch targets
- [x] Encouraging feedback messages

## Phase 18 — Session Recovery and Navigation Safety
- [x] Persist active session, current question, selected answer/reveal state
- [x] Restore after refresh and clear on completion
- [x] Confirmation before leaving an active session

## Phase 19 — Error Handling
- [x] Recover malformed stored data
- [x] Retry/fallback question generation
- [x] Friendly missing-session and missing-summary states

## Phase 20 — Testing
- [x] Generator, statistics, storage/recovery tests
- [x] Manual integration/accessibility/release checklist

## Phase 21 — Performance and Data Management
- [x] Lazy-load Statistics and Settings
- [x] Limit detailed recent sessions
- [x] Cap attempts at 5,000 and archive aggregate totals
- [x] Storage usage reporting

## Phase 22 — Privacy and Release
- [x] Privacy notice and PRIVACY.md
- [x] Production/release documentation
- [x] Automated Vite build and GitHub Pages publishing
