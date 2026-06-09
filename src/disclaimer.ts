export const CLEAN_ROOM_NOTICE =
  "Clean-room notice: this project is an independent public reimplementation inspired only by the public YC description of Care GP as AI agents to run primary healthcare operations. It does not copy proprietary source code, private workflows, private prompts, brand assets, patient data, or non-public implementation details.";

export const ADMIN_ONLY_NOTICE =
  "Admin-only notice: this demo uses synthetic clinic, staff, scheduling, approval, audit, and connector data for operations workflows only.";

export const NON_CLINICAL_NOTICE =
  "Non-clinical notice: this software does not provide diagnosis, treatment, triage, medical advice, clinical decision support, medical-device behavior, PHI handling, real patient data handling, or real EHR/clinic integrations.";

export function fullDisclaimer(): string {
  return [CLEAN_ROOM_NOTICE, ADMIN_ONLY_NOTICE, NON_CLINICAL_NOTICE].join("\n");
}
