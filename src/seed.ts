import type { SyntheticClinicData } from "./types.js";

export const syntheticClinic: SyntheticClinicData = {
  clinicId: "CLINIC-SYN-001",
  clinicName: "Synthetic Riverside Primary Care Operations",
  staff: [
    {
      id: "STAFF-001",
      displayName: "Riley Admin",
      role: "front_desk",
      maxOpenTasks: 4
    },
    {
      id: "STAFF-002",
      displayName: "Jordan Coordinator",
      role: "care_coordinator",
      maxOpenTasks: 3
    },
    {
      id: "STAFF-003",
      displayName: "Morgan Manager",
      role: "practice_manager",
      maxOpenTasks: 2
    },
    {
      id: "STAFF-004",
      displayName: "Taylor Billing",
      role: "billing_admin",
      maxOpenTasks: 3
    }
  ],
  slots: [
    {
      id: "SLOT-001",
      startsAt: "2026-06-10T09:00:00.000Z",
      durationMinutes: 20,
      staffRole: "front_desk",
      available: true
    },
    {
      id: "SLOT-002",
      startsAt: "2026-06-10T10:30:00.000Z",
      durationMinutes: 15,
      staffRole: "care_coordinator",
      available: true
    },
    {
      id: "SLOT-003",
      startsAt: "2026-06-10T14:00:00.000Z",
      durationMinutes: 30,
      staffRole: "practice_manager",
      available: false
    }
  ],
  tasks: [
    {
      id: "TASK-001",
      clinicId: "CLINIC-SYN-001",
      title: "Move routine appointment after staff rota change",
      type: "appointment_reschedule",
      status: "queued",
      requestedBy: "synthetic scheduling queue",
      requiredRole: "front_desk",
      dueAt: "2026-06-10T12:00:00.000Z",
      relatedSlotId: "SLOT-001",
      needsApproval: false,
      adminNotes: ["Synthetic appointment admin task", "Operations-only content"]
    },
    {
      id: "TASK-002",
      clinicId: "CLINIC-SYN-001",
      title: "Check referral admin packet for missing attachment",
      type: "referral_admin_follow_up",
      status: "queued",
      requestedBy: "synthetic referral inbox",
      requiredRole: "care_coordinator",
      dueAt: "2026-06-10T16:00:00.000Z",
      needsApproval: true,
      adminNotes: ["Verify form completeness only", "Do not review care appropriateness"]
    },
    {
      id: "TASK-003",
      clinicId: "CLINIC-SYN-001",
      title: "Approve template update for admin callback message",
      type: "message_callback",
      status: "waiting_approval",
      requestedBy: "synthetic communications queue",
      requiredRole: "practice_manager",
      dueAt: "2026-06-11T09:00:00.000Z",
      needsApproval: true,
      assignedTo: "STAFF-003",
      adminNotes: ["Message template is administrative only", "No advice content permitted"]
    },
    {
      id: "TASK-004",
      clinicId: "CLINIC-SYN-001",
      title: "Confirm insurance admin eligibility field formatting",
      type: "insurance_admin_check",
      status: "queued",
      requestedBy: "synthetic billing queue",
      requiredRole: "billing_admin",
      dueAt: "2026-06-11T13:00:00.000Z",
      needsApproval: false,
      adminNotes: ["Synthetic payer admin check", "No coverage guarantee"]
    }
  ]
};
