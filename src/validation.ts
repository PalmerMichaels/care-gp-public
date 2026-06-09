import { CONNECTOR_TYPES, STAFF_ROLES, TASK_STATUSES, TASK_TYPES, type SyntheticClinicData } from "./types.js";

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value: unknown): value is string {
  return hasText(value) && !Number.isNaN(Date.parse(value));
}

function requireText(record: Record<string, unknown>, key: string, issues: ValidationIssue[], path: string): void {
  if (!hasText(record[key])) {
    issues.push({ path, message: "must be a non-empty string" });
  }
}

function requireStringArray(record: Record<string, unknown>, key: string, issues: ValidationIssue[], path: string): void {
  const value = record[key];
  if (!Array.isArray(value) || !value.every(hasText)) {
    issues.push({ path, message: "must be an array of non-empty strings" });
  }
}

function requirePositiveInteger(record: Record<string, unknown>, key: string, issues: ValidationIssue[], path: string): void {
  const value = record[key];
  if (!Number.isInteger(value) || (value as number) <= 0) {
    issues.push({ path, message: "must be a positive integer" });
  }
}

function requireEnum<T extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  allowed: T,
  issues: ValidationIssue[],
  path: string
): void {
  if (!allowed.includes(record[key] as never)) {
    issues.push({ path, message: `must be one of: ${allowed.join(", ")}` });
  }
}

function rejectClinicalTerms(value: string, issues: ValidationIssue[], path: string): void {
  const clinicalTerms = [
    "diagnosis",
    "diagnose",
    "treatment",
    "treat",
    "triage",
    "symptom",
    "acuity",
    "medical advice",
    "clinical decision",
    "patient"
  ];
  const lowerValue = value.toLowerCase();
  const matched = clinicalTerms.find((term) => lowerValue.includes(term));
  if (matched) {
    issues.push({ path, message: `must not contain clinical or patient-care term: ${matched}` });
  }
}

export function validateClinicData(value: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!isRecord(value)) {
    return { valid: false, issues: [{ path: "$", message: "must be an object" }] };
  }

  requireText(value, "clinicId", issues, "clinicId");
  requireText(value, "clinicName", issues, "clinicName");

  const staffIds = new Set<string>();
  if (!Array.isArray(value.staff) || value.staff.length === 0) {
    issues.push({ path: "staff", message: "must contain at least one synthetic staff member" });
  } else {
    value.staff.forEach((member, index) => {
      const path = `staff[${index}]`;
      if (!isRecord(member)) {
        issues.push({ path, message: "must be an object" });
        return;
      }
      requireText(member, "id", issues, `${path}.id`);
      requireText(member, "displayName", issues, `${path}.displayName`);
      requireEnum(member, "role", STAFF_ROLES, issues, `${path}.role`);
      requirePositiveInteger(member, "maxOpenTasks", issues, `${path}.maxOpenTasks`);
      if (hasText(member.id)) {
        if (staffIds.has(member.id)) {
          issues.push({ path: `${path}.id`, message: "must be unique" });
        }
        staffIds.add(member.id);
      }
    });
  }

  const slotIds = new Set<string>();
  if (!Array.isArray(value.slots)) {
    issues.push({ path: "slots", message: "must be an array" });
  } else {
    value.slots.forEach((slot, index) => {
      const path = `slots[${index}]`;
      if (!isRecord(slot)) {
        issues.push({ path, message: "must be an object" });
        return;
      }
      requireText(slot, "id", issues, `${path}.id`);
      if (!isIsoDate(slot.startsAt)) {
        issues.push({ path: `${path}.startsAt`, message: "must be an ISO date string" });
      }
      requirePositiveInteger(slot, "durationMinutes", issues, `${path}.durationMinutes`);
      requireEnum(slot, "staffRole", STAFF_ROLES, issues, `${path}.staffRole`);
      if (typeof slot.available !== "boolean") {
        issues.push({ path: `${path}.available`, message: "must be a boolean" });
      }
      if (hasText(slot.id)) {
        if (slotIds.has(slot.id)) {
          issues.push({ path: `${path}.id`, message: "must be unique" });
        }
        slotIds.add(slot.id);
      }
    });
  }

  const taskIds = new Set<string>();
  if (!Array.isArray(value.tasks) || value.tasks.length === 0) {
    issues.push({ path: "tasks", message: "must contain at least one synthetic admin task" });
  } else {
    value.tasks.forEach((task, index) => {
      const path = `tasks[${index}]`;
      if (!isRecord(task)) {
        issues.push({ path, message: "must be an object" });
        return;
      }
      requireText(task, "id", issues, `${path}.id`);
      requireText(task, "clinicId", issues, `${path}.clinicId`);
      requireText(task, "title", issues, `${path}.title`);
      requireEnum(task, "type", TASK_TYPES, issues, `${path}.type`);
      requireEnum(task, "status", TASK_STATUSES, issues, `${path}.status`);
      requireText(task, "requestedBy", issues, `${path}.requestedBy`);
      requireEnum(task, "requiredRole", STAFF_ROLES, issues, `${path}.requiredRole`);
      if (!isIsoDate(task.dueAt)) {
        issues.push({ path: `${path}.dueAt`, message: "must be an ISO date string" });
      }
      if (typeof task.needsApproval !== "boolean") {
        issues.push({ path: `${path}.needsApproval`, message: "must be a boolean" });
      }
      requireStringArray(task, "adminNotes", issues, `${path}.adminNotes`);
      if (hasText(task.title)) {
        rejectClinicalTerms(task.title, issues, `${path}.title`);
      }
      if (Array.isArray(task.adminNotes)) {
        task.adminNotes.forEach((note, noteIndex) => {
          if (hasText(note)) {
            rejectClinicalTerms(note, issues, `${path}.adminNotes[${noteIndex}]`);
          }
        });
      }
      if (task.assignedTo !== undefined && (!hasText(task.assignedTo) || !staffIds.has(task.assignedTo))) {
        issues.push({ path: `${path}.assignedTo`, message: "must reference a synthetic staff member" });
      }
      if (task.relatedSlotId !== undefined && (!hasText(task.relatedSlotId) || !slotIds.has(task.relatedSlotId))) {
        issues.push({ path: `${path}.relatedSlotId`, message: "must reference a synthetic slot" });
      }
      if (hasText(task.id)) {
        if (taskIds.has(task.id)) {
          issues.push({ path: `${path}.id`, message: "must be unique" });
        }
        taskIds.add(task.id);
      }
    });
  }

  void CONNECTOR_TYPES;
  return { valid: issues.length === 0, issues };
}

export function assertValidClinicData(value: unknown): asserts value is SyntheticClinicData {
  const result = validateClinicData(value);
  if (!result.valid) {
    const detail = result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ");
    throw new Error(`Invalid synthetic clinic data: ${detail}`);
  }
}
