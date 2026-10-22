# Math Practice

A child-friendly arithmetic practice web application for ages 7–12.

## Live application
https://spcolello.github.io/math-practice/

## Source
This folder contains the complete source for the submitted Math Practice application.

## Features
- Addition, subtraction, multiplication, and division
- Easy, medium, and hard difficulty levels
- 5, 10, or 20 question sessions
- Four-choice interactive question cards
- Reveal-answer flow with self-reporting
- Correct/incorrect feedback and end-of-session summary
- Persistent mistake tracking with similar-question practice
- Overall statistics, per-operation accuracy, and recent session history
- Browser persistence using localStorage
- Responsive, keyboard-accessible UI

## Run locally
No dependency installation is required.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/math-practice/` if serving from the repository root, or run the server from inside this folder and open `http://localhost:4173/`.

## Tests
From this folder:

```bash
npm test
```

The automated tests validate arithmetic correctness, integer-safe division, non-negative subtraction, unique multiple-choice answers, inclusion of the correct answer, and accuracy calculations. See `TESTING.md` for the manual verification checklist.

## Persistence
Practice data is stored only in the browser under the localStorage key `mathPracticeDataV1`.
