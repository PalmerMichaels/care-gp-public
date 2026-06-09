# Care GP Public

Clean-room, non-clinical TypeScript demo of synthetic primary healthcare operations/admin workflows.

This implementation follows the public YC source at `https://www.ycombinator.com/companies/care-gp`, which describes Care GP as "AI agents to run primary healthcare operations." The project stays strictly inside healthcare operations/admin scope.

## What This Is

This repository implements a small command-line tool that demonstrates generic admin operations for a synthetic clinic workspace:

- Synthetic staff task assignment
- Synthetic scheduling/admin work items
- Human approval queues
- Immutable-style audit log events
- Mocked communications and EHR-like admin connector dry-run payloads
- Seed data validation that rejects clinical/patient-care wording inside admin task text

## Hard Scope Limits

This is not an AI doctor, clinical product, intake triage product, diagnosis/treatment tool, or clinical decision support system.

Do not use this project for diagnosis, treatment, triage, PHI, medical advice, clinical decision support, medical-device behavior, real patient data, or real EHR/clinic integrations.

## Clean-Room Notice

This project is independently implemented from public information only. It does not copy proprietary source code, private workflows, private prompts, brand assets, patient data, model outputs, or non-public implementation details from any company or product.

## Non-Clinical Disclaimer

This software is for demonstration and engineering validation only. It uses synthetic clinic, staff, scheduling, approval, audit, and connector data. It is admin-only and non-regulated.

All connector behavior is mocked and dry-run only. No real messages are sent, no real EHRs are contacted, and no real clinic systems are updated.

## Requirements

- Node.js 20 or newer
- npm

## Install

```bash
npm install
```

## Run

```bash
npm run build
npm start
```

Useful CLI commands:

```bash
node dist/cli.js list
node dist/cli.js demo
node dist/cli.js connectors
npm run validate
```

## Test

```bash
npm test
```

## Synthetic Seed Data

The bundled seed workspace lives in `src/seed.ts` and is fictional:

- Synthetic clinic metadata
- Synthetic staff members and roles
- Synthetic appointment/admin slots
- Synthetic admin tasks for rescheduling, referral packet follow-up, message approval, and insurance admin checks

There is no PHI and no real person, practice, EHR, payer, or clinic integration.

## Project Structure

- `PLAN.md`: admin-only clean-room implementation plan and boundaries
- `src/cli.ts`: command-line interface
- `src/seed.ts`: synthetic operations fixtures
- `src/validation.ts`: operations seed validation and clinical-term rejection for task text
- `src/operations.ts`: deterministic admin workflow engine
- `src/*.test.ts`: Node test runner coverage

## Validation Commands

```bash
npm run build
npm run validate
npm test
```
