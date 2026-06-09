# Care GP Public Admin-Only Clean-Room Reimplementation Plan

## Scope

Build a runnable TypeScript command-line demo inspired by the public YC description of Care GP as "AI agents to run primary healthcare operations." The implementation is admin-only healthcare operations software: synthetic clinic tasks, scheduling queues, approval workflows, audit logs, and mocked communications/EHR-like admin connectors.

## Clean-Room Boundaries

- Do not copy proprietary source code, assets, private workflows, private prompts, or non-public product details.
- Implement only generic healthcare operations/admin workflows: task assignment, appointment slot coordination, approval status changes, admin connector sync previews, and immutable audit events.
- Use synthetic clinics, staff, schedules, tasks, and admin messages only.
- Do not implement diagnosis, treatment, triage, clinical intake, acuity scoring, medical advice, clinical decision support, medical-device behavior, PHI handling, real patient data, or real EHR/clinic integrations.
- Include explicit disclaimers that the project is non-clinical, non-regulated, synthetic-only, and admin-only.

## Implementation Steps

1. Create a minimal TypeScript Node CLI with no runtime service dependency.
2. Add typed operations models, validation, deterministic synthetic seed data, and an admin workflow engine.
3. Expose commands for listing synthetic work items, validating seed data, running an operations demo, and previewing mocked admin connector payloads.
4. Add automated tests covering validation, workflow assignment, approvals, audit logs, connector mocks, and disclaimers.
5. Document installation, usage, clean-room limits, and non-regulated status in `README.md`.

## Verification

- `npm run build` must type-check and emit runnable JavaScript.
- `npm test` must execute automated tests against the compiled output.
- `npm run validate` must validate all synthetic operations seed data.
- Before finishing, commit on `main`, push to `origin`, and verify the worktree is clean with local `HEAD` equal to `origin/main`.
