# Math Practice Application Specification

This implementation follows the supplied assignment and the implementation details reflected in the provided reference materials.

## Functional requirements
- Support addition, subtraction, multiplication, and division.
- Provide four levels: Beginner, Easy, Intermediate, and Advanced.
- Configure sessions for 5, 10, 20, or Continuous practice.
- Present each problem as an interactive four-choice question card.
- Allow direct answer selection or Reveal Answer followed by self-reporting.
- Provide visual/text feedback and optional explanations/sound.
- Track attempted, correct, and incorrect answers.
- Display a session summary with accuracy and follow-up actions.
- Persist missed facts as mistake patterns.
- Generate similar practice questions and track mastery progress.
- Show total statistics, per-operation accuracy, mistake insights, and history.
- Persist data and settings between browser sessions with localStorage.
- Provide settings for defaults, feedback preferences, and mastery threshold.
- Provide keyboard and screen-reader support and reduced-motion handling.
- Be responsive and appropriate for children ages 7–12.

## Question-generation rules
- Beginner: small number facts; addition/subtraction constrained to 10; multiplication/division through 5.
- Easy: addition/subtraction constrained to 20; multiplication/division through 10.
- Intermediate: addition/subtraction through 100; multiplication/division through 12.
- Advanced: larger addition/subtraction values and multiplication/division through 20, with some larger multiplication factors.
- Subtraction results remain non-negative.
- Division uses a nonzero divisor and always generates whole-number answers.
- Each question contains four unique answer choices including the correct answer.
