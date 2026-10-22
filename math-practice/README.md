# Math Practice

A Vite + React + TypeScript arithmetic practice app for children ages 7–12.

## Features
- Addition, subtraction, multiplication, and division
- Four difficulty levels: Beginner, Easy, Intermediate, Advanced
- 5, 10, 20, and continuous sessions
- Four-choice question cards, reveal-answer flow, and self-reporting
- Session summaries, mistake review, similar-question practice, mastery tracking
- Statistics by operation and recent practice history
- Settings/defaults, sound, animation, explanations, and encouraging feedback
- localStorage persistence plus active-session recovery
- Navigation protection during active sessions
- Storage recovery and question-generation fallback behavior
- Keyboard shortcuts 1–4, accessible labels, and reduced-motion support
- Responsive mobile/tablet design
- Privacy notice; no accounts, analytics, ads, or tracking

## Development
```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
npm run verify
```

## Deployment
Source is stored in `math-practice-react/`. GitHub Actions builds the Vite production bundle and publishes generated files into `math-practice/` for GitHub Pages.
