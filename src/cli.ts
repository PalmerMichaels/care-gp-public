#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { fullDisclaimer } from "./disclaimer.js";
import { routeIntake } from "./router.js";
import { syntheticIntakes } from "./seed.js";
import type { RouteResult, SyntheticIntake } from "./types.js";
import { validateAllIntakes } from "./validation.js";

interface CliIO {
  write: (message: string) => void;
  error: (message: string) => void;
}

function formatListItem(intake: SyntheticIntake): string {
  return `${intake.id} | ${intake.patient.displayName} | ${intake.concerns.join(", ")}`;
}

export function renderList(): string {
  return ["Synthetic seed intakes:", ...syntheticIntakes.map(formatListItem)].join("\n");
}

function renderRoute(route: RouteResult): string {
  return [
    `Recommended non-clinical route: ${route.label}`,
    `Acuity key: ${route.acuity}`,
    "Rationale:",
    ...route.rationale.map((item) => `- ${item}`),
    "Suggested preparation:",
    ...route.suggestedPreparation.map((item) => `- ${item}`),
    "Disclaimer:",
    route.disclaimer
  ].join("\n");
}

function renderIntake(intake: SyntheticIntake): string {
  return [
    `Case: ${intake.id}`,
    `Synthetic patient: ${intake.patient.displayName}, age ${intake.patient.ageYears}`,
    `Concerns: ${intake.concerns.join(", ")}`,
    `Symptoms/request details: ${intake.symptoms.join(", ")}`,
    `Duration: ${intake.durationDays} day(s)`,
    `Self-reported severity: ${intake.severity}/10`,
    `Preferred contact: ${intake.contactPreference}`
  ].join("\n");
}

export function renderDemo(caseId?: string): string {
  const intake = caseId
    ? syntheticIntakes.find((candidate) => candidate.id === caseId)
    : syntheticIntakes[0];

  if (!intake) {
    throw new Error(`Unknown synthetic intake id: ${caseId ?? "none"}`);
  }

  const route = routeIntake(intake);
  return [fullDisclaimer(), "", renderIntake(intake), "", renderRoute(route)].join("\n");
}

export function renderHelp(): string {
  return [
    "care-gp-public",
    "",
    "Commands:",
    "  list                 List synthetic seed intakes",
    "  demo [SYN-ID]        Render a non-clinical route for a synthetic case",
    "  validate             Validate all synthetic seed intakes",
    "  help                 Show this help",
    "",
    "Examples:",
    "  node dist/cli.js list",
    "  node dist/cli.js demo SYN-003",
    "  npm run validate"
  ].join("\n");
}

export function runCli(args: string[], io: CliIO = { write: console.log, error: console.error }): number {
  const [command = "help", caseId] = args;

  if (command === "list") {
    io.write(renderList());
    return 0;
  }

  if (command === "demo") {
    try {
      io.write(renderDemo(caseId));
      return 0;
    } catch (error) {
      io.error(error instanceof Error ? error.message : String(error));
      return 1;
    }
  }

  if (command === "validate") {
    const result = validateAllIntakes(syntheticIntakes);
    if (result.valid) {
      io.write(`Validated ${syntheticIntakes.length} synthetic intakes.`);
      return 0;
    }
    io.error(result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
    return 1;
  }

  if (command === "help" || command === "--help" || command === "-h") {
    io.write(renderHelp());
    return 0;
  }

  io.error(`Unknown command: ${command}\n\n${renderHelp()}`);
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runCli(process.argv.slice(2));
}
