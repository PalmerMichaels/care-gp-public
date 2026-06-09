export const STAFF_ROLES = ["care_coordinator", "front_desk", "practice_manager", "billing_admin"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const TASK_TYPES = [
  "appointment_reschedule",
  "referral_admin_follow_up",
  "insurance_admin_check",
  "document_request",
  "message_callback"
] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_STATUSES = ["queued", "assigned", "waiting_approval", "approved", "completed"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const CONNECTOR_TYPES = ["mock_ehr_admin", "mock_sms", "mock_email"] as const;
export type ConnectorType = (typeof CONNECTOR_TYPES)[number];

export interface SyntheticStaffMember {
  id: string;
  displayName: string;
  role: StaffRole;
  maxOpenTasks: number;
}

export interface SyntheticClinicSlot {
  id: string;
  startsAt: string;
  durationMinutes: number;
  staffRole: StaffRole;
  available: boolean;
}

export interface SyntheticAdminTask {
  id: string;
  clinicId: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  requestedBy: string;
  requiredRole: StaffRole;
  dueAt: string;
  relatedSlotId?: string;
  needsApproval: boolean;
  assignedTo?: string;
  adminNotes: string[];
}

export interface SyntheticClinicData {
  clinicId: string;
  clinicName: string;
  staff: SyntheticStaffMember[];
  slots: SyntheticClinicSlot[];
  tasks: SyntheticAdminTask[];
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  taskId: string;
  detail: string;
}

export interface AdminConnectorPayload {
  connector: ConnectorType;
  operation: string;
  dryRun: true;
  externalReference: string;
  payload: Record<string, string | number | boolean | null>;
}

export interface OperationsRunResult {
  clinicId: string;
  generatedAt: string;
  taskUpdates: SyntheticAdminTask[];
  approvals: SyntheticAdminTask[];
  auditLog: AuditEvent[];
  connectorPayloads: AdminConnectorPayload[];
  disclaimer: string;
}
