export const CLEAN_ROOM_NOTICE =
  "Clean-room notice: this project is an independent public reimplementation inspired only by the public YC description of Care GP as AI agents to run primary healthcare operations. It does not copy proprietary source code, private workflows, private prompts, brand assets, person records, or non-public implementation details.";

export const ADMIN_ONLY_NOTICE =
  "Admin-only notice: this demo uses synthetic clinic, staff, scheduling, approval, audit, and connector data for operations workflows only.";

export const ADMIN_BOUNDARY_NOTICE =
  "Admin boundary notice: this software does not perform care assessment, care recommendations, regulated care automation, protected record handling, real person data handling, or live system integrations.";

export function fullDisclaimer(): string {
  return [CLEAN_ROOM_NOTICE, ADMIN_ONLY_NOTICE, ADMIN_BOUNDARY_NOTICE].join("\n");
}
