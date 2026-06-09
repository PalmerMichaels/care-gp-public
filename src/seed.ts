import type { SyntheticIntake } from "./types.js";

export const syntheticIntakes: SyntheticIntake[] = [
  {
    id: "SYN-001",
    patient: {
      displayName: "Alex Morgan",
      ageYears: 34,
      pronouns: "they/them",
      region: "Synthetic North"
    },
    concerns: ["ongoing cough", "fatigue"],
    symptoms: ["dry cough", "sleep disruption", "low energy"],
    durationDays: 9,
    severity: 4,
    riskFactors: [],
    redFlags: [],
    medications: ["synthetic salbutamol inhaler"],
    allergies: ["none recorded"],
    contactPreference: "phone",
    vitals: {
      temperatureC: 37.4,
      heartRateBpm: 82,
      systolicBp: 118,
      oxygenSaturationPct: 98
    },
    notes: "Synthetic case for routine visit preparation. Not based on a real patient."
  },
  {
    id: "SYN-002",
    patient: {
      displayName: "Priya Shah",
      ageYears: 67,
      pronouns: "she/her",
      region: "Synthetic Midlands"
    },
    concerns: ["urinary discomfort", "feverish overnight"],
    symptoms: ["burning when urinating", "new confusion reported by carer", "chills"],
    durationDays: 2,
    severity: 8,
    riskFactors: ["older adult", "synthetic diabetes history"],
    redFlags: [],
    medications: ["synthetic metformin"],
    allergies: ["synthetic penicillin allergy"],
    contactPreference: "phone",
    vitals: {
      temperatureC: 38.8,
      heartRateBpm: 104,
      systolicBp: 106,
      oxygenSaturationPct: 96
    },
    notes: "Synthetic higher-priority booking scenario. Not clinical guidance."
  },
  {
    id: "SYN-003",
    patient: {
      displayName: "Marcus Chen",
      ageYears: 51,
      pronouns: "he/him",
      region: "Synthetic South"
    },
    concerns: ["chest tightness", "breathlessness"],
    symptoms: ["pressure sensation", "shortness of breath", "sweating"],
    durationDays: 0,
    severity: 9,
    riskFactors: ["synthetic high blood pressure history"],
    redFlags: ["chest pain", "shortness of breath"],
    medications: ["synthetic amlodipine"],
    allergies: ["none recorded"],
    contactPreference: "in-person",
    vitals: {
      heartRateBpm: 128,
      systolicBp: 142,
      oxygenSaturationPct: 93
    },
    notes: "Synthetic safety-flag case intended to demonstrate emergency disclaimer behavior."
  },
  {
    id: "SYN-004",
    patient: {
      displayName: "Sam Taylor",
      ageYears: 42,
      pronouns: "he/they",
      region: "Synthetic West"
    },
    concerns: ["repeat prescription request", "travel letter request"],
    symptoms: ["stable long-term condition", "no new symptoms"],
    durationDays: 30,
    severity: 2,
    riskFactors: [],
    redFlags: [],
    medications: ["synthetic levothyroxine"],
    allergies: ["none recorded"],
    contactPreference: "video",
    notes: "Synthetic administrative workflow case."
  }
];
