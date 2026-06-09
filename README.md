# Care GP Public

Clean-room, non-regulated TypeScript demo of a public GP intake routing workflow using synthetic seed data.

## What This Is

This repository implements a small command-line tool that demonstrates how a generic GP intake experience could collect structured synthetic intake details, validate them, and produce non-clinical visit-preparation routing labels.

The implementation is intentionally narrow: it is a public clean-room reimplementation of a concept, not a production healthcare system.

## Clean-Room Notice

This project is independently implemented. It does not copy proprietary source code, private workflows, brand assets, patient data, model prompts, or non-public implementation details from any company or product.

## Non-Regulated Disclaimer

This software is for demonstration and engineering validation only. It uses synthetic data and is not medical advice, a diagnosis, a treatment plan, clinical decision support, a medical device, an emergency service, or a substitute for a qualified clinician.

Do not use this project with real patient data, protected health information, operational clinical workflows, triage decisions, emergencies, or regulated healthcare use cases. If a real person may be in danger, contact local emergency services or a qualified clinician immediately.

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
node dist/cli.js demo SYN-003
npm run validate
```

## Test

```bash
npm test
```

## Synthetic Seed Data

The bundled seed cases live in `src/seed.ts`. They are fictional and deterministic:

- `SYN-001`: routine symptom-preparation scenario
- `SYN-002`: higher-priority synthetic GP contact scenario
- `SYN-003`: safety-flag scenario that demonstrates emergency disclaimer behavior
- `SYN-004`: administrative request scenario

## Project Structure

- `PLAN.md`: implementation plan and clean-room boundaries
- `src/cli.ts`: command-line interface
- `src/seed.ts`: synthetic intake fixtures
- `src/validation.ts`: structured intake validation
- `src/router.ts`: deterministic non-clinical routing labels
- `src/*.test.ts`: Node test runner coverage

## Validation Commands

```bash
npm run build
npm run validate
npm test
```
