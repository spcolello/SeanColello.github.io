# Math Practice Software Specification

## Purpose
Math Practice is a browser-based arithmetic practice application for children ages 7–12.

## Functional requirements
- Addition, subtraction, multiplication, and division.
- Difficulty levels 1–4: Beginner, Easy, Intermediate, Advanced.
- Session lengths: 5, 10, 20, or Continuous.
- Multiple operations may be enabled in one session.
- Every question has four unique answer choices including the correct answer.
- Division uses a nonzero divisor and whole-number quotient; introductory subtraction stays non-negative.
- Students may choose an answer or reveal the answer, then self-report whether they got it right.
- Track attempted, correct, incorrect, and accuracy.
- Fixed sessions end automatically; Continuous sessions can be ended manually.
- Persist settings, sessions, attempts, active session state, and mistake patterns in localStorage.
- Recover an active session after refresh.
- Warn before accidental navigation away from an active session.
- Track repeated mistake patterns and create similar-question review sessions.
- Master mistakes after the configured number of correct similar questions.
- Statistics include totals, accuracy by operation/difficulty, recent sessions, and mistake-review information.
- Settings include sound effects, card animation, explanations, encouraging feedback, practice defaults, and mastery threshold.
- Clear all application data with confirmation.
- Keyboard navigation, number keys 1–4, visible focus, screen-reader-friendly labels, and reduced-motion support.
- Responsive phone/tablet/desktop layout.
- No accounts, analytics, ads, or tracking.

## Reliability and release
- Validate generated questions, retry failed generation, and fall back to known-good questions.
- Recover malformed stored JSON safely and explain recovery to the user.
- Maintain a capped detailed attempt history while preserving archived aggregate totals.
- Lazy-load Statistics and Settings.
- Lint, test, type-check, and production-build in CI before publishing.
