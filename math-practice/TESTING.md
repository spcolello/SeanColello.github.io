# Testing and Verification

## Automated tests
Run from the `math-practice` folder:

```bash
npm test
```

Expected: **8 test groups passed**.

Coverage includes:
1. Four arithmetic operations.
2. All four required difficulty levels.
3. Mathematical correctness across operation × difficulty combinations.
4. Whole-number division with nonzero divisors.
5. Non-negative subtraction.
6. Four unique choices including the correct answer.
7. Zero/small-answer edge cases.
8. Accuracy calculations and rounding.

## Manual browser checklist
- [ ] Public GitHub Pages URL loads.
- [ ] Addition, subtraction, multiplication, and division can each be selected.
- [ ] Mixed-operation selection works.
- [ ] Beginner, Easy, Intermediate, and Advanced can each be selected.
- [ ] 5, 10, 20, and Continuous sessions work.
- [ ] A fixed session automatically reaches the summary.
- [ ] Continuous practice can be ended manually.
- [ ] Every card shows four choices and correct math.
- [ ] Number keys 1–4 select the corresponding answer.
- [ ] Reveal Answer shows the answer and asks for self-reporting.
- [ ] Correct/incorrect counts and accuracy are correct.
- [ ] Session summary shows accuracy, correct, incorrect, and follow-up actions.
- [ ] Missed facts appear in Mistake Review.
- [ ] Similar practice updates mastery progress.
- [ ] Mastered mistakes can be viewed separately.
- [ ] Statistics update overall and by operation.
- [ ] Mistake insights and history populate after use.
- [ ] Settings save automatically.
- [ ] Default operations/difficulty/session length affect the setup screen.
- [ ] Sound, animation, and explanation preferences change behavior.
- [ ] Refreshing preserves statistics, history, mistakes, mastery, and settings.
- [ ] Clear All Application Data resets stored state after confirmation.
- [ ] Keyboard focus is visible; reduced-motion preference is respected.
- [ ] Layout remains usable at phone width and at browser zoom.
