import { NON_REGULATED_NOTICE } from "./disclaimer.js";
import type { RouteResult, SyntheticIntake } from "./types.js";
import { validateIntake } from "./validation.js";

const ADMIN_TERMS = ["repeat prescription", "letter", "form", "certificate", "sick note"];

function includesAnyTerm(values: string[], terms: string[]): boolean {
  const lowerValues = values.map((value) => value.toLowerCase());
  return terms.some((term) => lowerValues.some((value) => value.includes(term)));
}

function vitalSafetySignals(intake: SyntheticIntake): string[] {
  const signals: string[] = [];
  const vitals = intake.vitals;

  if (!vitals) {
    return signals;
  }

  if (vitals.oxygenSaturationPct !== undefined && vitals.oxygenSaturationPct < 94) {
    signals.push("low synthetic oxygen saturation value");
  }
  if (vitals.temperatureC !== undefined && vitals.temperatureC >= 40) {
    signals.push("very high synthetic temperature value");
  }
  if (vitals.heartRateBpm !== undefined && vitals.heartRateBpm >= 130) {
    signals.push("very high synthetic heart rate value");
  }
  if (vitals.systolicBp !== undefined && vitals.systolicBp < 90) {
    signals.push("low synthetic blood pressure value");
  }

  return signals;
}

function basePreparation(intake: SyntheticIntake): string[] {
  return [
    `Bring a timeline for ${intake.durationDays} day(s) of symptoms or requests.`,
    "Have current medications, allergies, and recent measurements ready.",
    "Use local emergency services instead if the situation becomes urgent or unsafe."
  ];
}

export function routeIntake(intake: SyntheticIntake): RouteResult {
  const validation = validateIntake(intake);
  if (!validation.valid) {
    return {
      intakeId: String(intake.id ?? "unknown"),
      acuity: "admin_review",
      label: "Manual review required before routing",
      rationale: validation.issues.map((issue) => `${issue.path}: ${issue.message}`),
      suggestedPreparation: ["Correct the structured intake fields before using the demo route."],
      disclaimer: NON_REGULATED_NOTICE
    };
  }

  const vitalSignals = vitalSafetySignals(intake);
  if (intake.redFlags.length > 0 || intake.severity >= 9 || vitalSignals.length > 0) {
    return {
      intakeId: intake.id,
      acuity: "emergency_prompt",
      label: "Safety prompt: do not use this demo for urgent symptoms",
      rationale: [
        ...intake.redFlags.map((flag) => `reported safety flag: ${flag}`),
        ...vitalSignals,
        ...(intake.severity >= 9 ? ["very high self-reported synthetic severity"] : [])
      ],
      suggestedPreparation: [
        "For a real person, stop using this demo and contact local emergency services or a qualified clinician.",
        ...basePreparation(intake)
      ],
      disclaimer: NON_REGULATED_NOTICE
    };
  }

  if (intake.severity >= 7 || intake.riskFactors.length > 0) {
    return {
      intakeId: intake.id,
      acuity: "same_day_gp",
      label: "Higher-priority GP contact preparation",
      rationale: [
        ...(intake.severity >= 7 ? ["higher self-reported synthetic severity"] : []),
        ...intake.riskFactors.map((factor) => `context factor: ${factor}`)
      ],
      suggestedPreparation: basePreparation(intake),
      disclaimer: NON_REGULATED_NOTICE
    };
  }

  if (includesAnyTerm(intake.concerns, ADMIN_TERMS)) {
    return {
      intakeId: intake.id,
      acuity: "admin_review",
      label: "Administrative request preparation",
      rationale: ["request appears administrative rather than symptom-led"],
      suggestedPreparation: [
        "Prepare the relevant document, medication name, requested date, and preferred contact route.",
        "A real practice would still need to verify identity, eligibility, and clinician sign-off."
      ],
      disclaimer: NON_REGULATED_NOTICE
    };
  }

  return {
    intakeId: intake.id,
    acuity: "routine_gp",
    label: "Routine GP visit preparation",
    rationale: ["no synthetic safety flags and lower self-reported severity"],
    suggestedPreparation: basePreparation(intake),
    disclaimer: NON_REGULATED_NOTICE
  };
}
