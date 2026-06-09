import { CONTACT_PREFERENCES, type SyntheticIntake } from "./types.js";

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

function requireText(record: Record<string, unknown>, key: string, issues: ValidationIssue[], path = key): void {
  if (!hasText(record[key])) {
    issues.push({ path, message: "must be a non-empty string" });
  }
}

function requireStringArray(
  record: Record<string, unknown>,
  key: string,
  issues: ValidationIssue[],
  minItems = 0
): void {
  const value = record[key];
  if (!Array.isArray(value) || value.length < minItems || !value.every(hasText)) {
    issues.push({
      path: key,
      message: `must be an array of non-empty strings with at least ${minItems} item(s)`
    });
  }
}

function requireIntegerRange(
  record: Record<string, unknown>,
  key: string,
  min: number,
  max: number,
  issues: ValidationIssue[],
  path = key
): void {
  const value = record[key];
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) {
    issues.push({ path, message: `must be an integer from ${min} to ${max}` });
  }
}

function requireNumberRange(
  record: Record<string, unknown>,
  key: string,
  min: number,
  max: number,
  issues: ValidationIssue[],
  path = key
): void {
  const value = record[key];
  if (typeof value !== "number" || Number.isNaN(value) || value < min || value > max) {
    issues.push({ path, message: `must be a number from ${min} to ${max}` });
  }
}

export function validateIntake(value: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!isRecord(value)) {
    return { valid: false, issues: [{ path: "$", message: "must be an object" }] };
  }

  requireText(value, "id", issues);
  requireStringArray(value, "concerns", issues, 1);
  requireStringArray(value, "symptoms", issues, 1);
  requireIntegerRange(value, "durationDays", 0, 3650, issues);
  requireIntegerRange(value, "severity", 1, 10, issues);
  requireStringArray(value, "riskFactors", issues);
  requireStringArray(value, "redFlags", issues);
  requireStringArray(value, "medications", issues);
  requireStringArray(value, "allergies", issues);

  if (!CONTACT_PREFERENCES.includes(value.contactPreference as never)) {
    issues.push({ path: "contactPreference", message: "must be phone, video, or in-person" });
  }

  if (!isRecord(value.patient)) {
    issues.push({ path: "patient", message: "must be an object" });
  } else {
    requireText(value.patient, "displayName", issues, "patient.displayName");
    requireIntegerRange(value.patient, "ageYears", 0, 120, issues, "patient.ageYears");
    if (value.patient.pronouns !== undefined && !hasText(value.patient.pronouns)) {
      issues.push({ path: "patient.pronouns", message: "must be a non-empty string when provided" });
    }
    if (value.patient.region !== undefined && !hasText(value.patient.region)) {
      issues.push({ path: "patient.region", message: "must be a non-empty string when provided" });
    }
  }

  if (value.vitals !== undefined) {
    if (!isRecord(value.vitals)) {
      issues.push({ path: "vitals", message: "must be an object when provided" });
    } else {
      const vitals = value.vitals;
      if (vitals.temperatureC !== undefined) {
        requireNumberRange(vitals, "temperatureC", 30, 45, issues, "vitals.temperatureC");
      }
      if (vitals.heartRateBpm !== undefined) {
        requireNumberRange(vitals, "heartRateBpm", 20, 240, issues, "vitals.heartRateBpm");
      }
      if (vitals.systolicBp !== undefined) {
        requireNumberRange(vitals, "systolicBp", 50, 260, issues, "vitals.systolicBp");
      }
      if (vitals.oxygenSaturationPct !== undefined) {
        requireNumberRange(vitals, "oxygenSaturationPct", 50, 100, issues, "vitals.oxygenSaturationPct");
      }
    }
  }

  if (value.notes !== undefined && !hasText(value.notes)) {
    issues.push({ path: "notes", message: "must be a non-empty string when provided" });
  }

  return { valid: issues.length === 0, issues };
}

export function validateAllIntakes(values: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!Array.isArray(values)) {
    return { valid: false, issues: [{ path: "$", message: "must be an array" }] };
  }

  const seenIds = new Set<string>();
  values.forEach((value, index) => {
    const result = validateIntake(value);
    for (const issue of result.issues) {
      issues.push({ path: `[${index}].${issue.path}`, message: issue.message });
    }

    if (isRecord(value) && hasText(value.id)) {
      if (seenIds.has(value.id)) {
        issues.push({ path: `[${index}].id`, message: "must be unique" });
      }
      seenIds.add(value.id);
    }
  });

  return { valid: issues.length === 0, issues };
}

export function assertValidIntake(value: unknown): asserts value is SyntheticIntake {
  const result = validateIntake(value);
  if (!result.valid) {
    const detail = result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ");
    throw new Error(`Invalid synthetic intake: ${detail}`);
  }
}
