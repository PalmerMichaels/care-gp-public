# Care GP Public Clean-Room Reimplementation Plan

## Scope

Build a runnable TypeScript command-line demo that reimplements a public-facing GP intake workflow concept in a clean-room manner. The tool will use only synthetic data, produce non-diagnostic routing suggestions, and avoid regulated medical functionality.

## Clean-Room Boundaries

- Do not copy proprietary source code, assets, private workflows, or non-public product details.
- Implement a generic public-facing concept: structured GP intake, basic safety flagging, and visit-preparation summaries.
- Use synthetic seed patients and synthetic symptoms only.
- Include explicit disclaimers that the project is not medical advice, not a medical device, not a clinical decision support product, and not for emergency or regulated use.

## Implementation Steps

1. Create a minimal TypeScript Node CLI with no runtime service dependency.
2. Add typed intake models, validation, deterministic synthetic seed data, and a lightweight routing engine.
3. Expose commands for listing seed cases, validating seed data, and running a demo intake summary.
4. Add automated tests covering validation, routing, and disclaimers.
5. Document installation, usage, clean-room limits, and non-regulated status in `README.md`.

## Verification

- `npm run build` must type-check and emit runnable JavaScript.
- `npm test` must execute automated tests against the compiled output.
- `npm run validate` must validate all synthetic seed intakes.
- Before finishing, commit on `main`, push to `origin`, and verify the worktree is clean with local `HEAD` equal to `origin/main`.
