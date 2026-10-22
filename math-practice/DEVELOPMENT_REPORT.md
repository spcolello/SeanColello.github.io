# Math Practice Web Application - Development Report

## Development approach
I used an AI-assisted iterative development process. I first treated the professor-provided specification and TODO phases as the source of truth, then implemented the application in a Vite + React + TypeScript project. The work was broken into setup/routing, question generation, practice sessions, summaries, persistence, mistakes, statistics, settings, accessibility, recovery/error handling, testing, performance, privacy, and deployment.

The final source is stored in `math-practice-react/`. GitHub Actions installs dependencies, runs ESLint, runs Vitest, type-checks/builds with Vite, and only then publishes the generated production files to `math-practice/` for GitHub Pages.

## Prompting strategy
The most effective prompts were requirement-driven rather than vague:
1. Complete the assignment end-to-end using the professor's specification/TODO and prepare GitHub, deployment, testing, and submission materials.
2. Compare the implementation against the full professor-generated requirements and add missing features rather than only matching the short assignment overview.
3. Test the deployed project and require CI to block publishing unless lint, tests, TypeScript, and the production build all pass.

## Debugging
One important implementation issue was division generation. Randomly choosing both operands can produce decimals or division by zero. The generator instead chooses a nonzero divisor and whole-number quotient, then calculates the dividend. Automated tests repeatedly generate questions across all operations and difficulty levels to verify correctness and answer-choice validity.

A second debugging example happened during CI. The first React release failed because Vite's config typing did not recognize the Vitest `test` field. I added the Vitest config type reference and reran CI. Later, making lint part of the release gate exposed several code-quality errors and a component test exposed an accessibility-name mismatch. I fixed those instead of bypassing the checks. The final CI run passed lint, all 12 tests, TypeScript compilation, and the Vite production build.

## Testing
Testing combines unit, component/integration, and release checks. The automated suite checks generators, statistics, storage recovery, active-session persistence, setup options, settings, keyboard shortcuts, and reveal/self-report behavior. Manual testing covers the full user flow, persistence after refresh, mistake review/mastery, responsive layouts, accessibility, and deployment behavior.

## Reflection
AI was most useful for translating a long requirements document into implementation tasks, generating repetitive UI/service code, and identifying edge cases. The main limitation was that generated code still required verification. CI caught real issues that were not obvious by inspection. The process reinforced that AI-assisted development works best when each feature has an observable requirement and a test or verification method.
