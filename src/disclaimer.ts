export const CLEAN_ROOM_NOTICE =
  "Clean-room notice: this project is an independent public reimplementation. It does not copy proprietary source code, private workflows, brand assets, patient data, or non-public implementation details.";

export const NON_REGULATED_NOTICE =
  "Non-regulated notice: this demo uses synthetic data and is not medical advice, a diagnosis, a treatment plan, clinical decision support, a medical device, or an emergency service.";

export const EMERGENCY_NOTICE =
  "Emergency notice: if a real person may be in danger, contact local emergency services or a qualified clinician immediately instead of using this software.";

export function fullDisclaimer(): string {
  return [CLEAN_ROOM_NOTICE, NON_REGULATED_NOTICE, EMERGENCY_NOTICE].join("\n");
}
