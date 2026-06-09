#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { fullDisclaimer } from "./disclaimer.js";
import { runOperationsWorkflow } from "./operations.js";
import { syntheticClinic } from "./seed.js";
import type { AdminConnectorPayload, AuditEvent, SyntheticAdminTask } from "./types.js";
import { validateClinicData } from "./validation.js";

interface CliIO {
  write: (message: string) => void;
  error: (message: string) => void;
}

function formatTask(task: SyntheticAdminTask): string {
  const assignee = task.assignedTo ? ` assigned=${task.assignedTo}` : " unassigned";
  return `${task.id} | ${task.status} | ${task.type} | role=${task.requiredRole}${assignee} | ${task.title}`;
}

function formatAudit(event: AuditEvent): string {
  return `${event.id} | ${event.action} | ${event.taskId} | ${event.detail}`;
}

function formatPayload(payload: AdminConnectorPayload): string {
  return `${payload.connector} | ${payload.operation} | dryRun=${payload.dryRun} | ref=${payload.externalReference}`;
}

export function renderList(): string {
  return [
    `Synthetic operations workspace: ${syntheticClinic.clinicName}`,
    "Admin tasks:",
    ...syntheticClinic.tasks.map(formatTask)
  ].join("\n");
}

export function renderDemo(): string {
  const result = runOperationsWorkflow(syntheticClinic);
  return [
    fullDisclaimer(),
    "",
    `Operations run for ${result.clinicId} at ${result.generatedAt}`,
    "",
    "Task updates:",
    ...result.taskUpdates.map(formatTask),
    "",
    "Approvals queued for human admin review:",
    ...(result.approvals.length > 0 ? result.approvals.map(formatTask) : ["None"]),
    "",
    "Audit log:",
    ...result.auditLog.map(formatAudit),
    "",
    "Mock connector dry-run payloads:",
    ...result.connectorPayloads.map(formatPayload)
  ].join("\n");
}

export function renderConnectors(): string {
  const result = runOperationsWorkflow(syntheticClinic);
  return [
    fullDisclaimer(),
    "",
    "Mock admin connector dry-run payloads:",
    JSON.stringify(result.connectorPayloads, null, 2)
  ].join("\n");
}

export function renderHelp(): string {
  return [
    "care-gp-public",
    "",
    "Commands:",
    "  list         List synthetic admin operations tasks",
    "  demo         Run the synthetic admin operations workflow",
    "  connectors   Print mocked admin connector dry-run payloads",
    "  validate     Validate all synthetic operations seed data",
    "  help         Show this help",
    "",
    "Examples:",
    "  node dist/cli.js list",
    "  node dist/cli.js demo",
    "  node dist/cli.js connectors",
    "  npm run validate"
  ].join("\n");
}

export function runCli(args: string[], io: CliIO = { write: console.log, error: console.error }): number {
  const [command = "help"] = args;

  if (command === "list") {
    io.write(renderList());
    return 0;
  }

  if (command === "demo") {
    io.write(renderDemo());
    return 0;
  }

  if (command === "connectors") {
    io.write(renderConnectors());
    return 0;
  }

  if (command === "validate") {
    const result = validateClinicData(syntheticClinic);
    if (result.valid) {
      io.write(`Validated ${syntheticClinic.tasks.length} synthetic admin tasks.`);
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
