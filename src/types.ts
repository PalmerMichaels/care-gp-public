export const CONTACT_PREFERENCES = ["phone", "video", "in-person"] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

export const ROUTE_ACUITIES = [
  "emergency_prompt",
  "same_day_gp",
  "routine_gp",
  "admin_review"
] as const;
export type RouteAcuity = (typeof ROUTE_ACUITIES)[number];

export interface PatientProfile {
  displayName: string;
  ageYears: number;
  pronouns?: string;
  region?: string;
}

export interface VitalsSnapshot {
  temperatureC?: number;
  heartRateBpm?: number;
  systolicBp?: number;
  oxygenSaturationPct?: number;
}

export interface SyntheticIntake {
  id: string;
  patient: PatientProfile;
  concerns: string[];
  symptoms: string[];
  durationDays: number;
  severity: number;
  riskFactors: string[];
  redFlags: string[];
  medications: string[];
  allergies: string[];
  contactPreference: ContactPreference;
  vitals?: VitalsSnapshot;
  notes?: string;
}

export interface RouteResult {
  intakeId: string;
  acuity: RouteAcuity;
  label: string;
  rationale: string[];
  suggestedPreparation: string[];
  disclaimer: string;
}
