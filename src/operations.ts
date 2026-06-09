import { fullDisclaimer } from "./disclaimer.js";
import type {
  AdminConnectorPayload,
  AuditEvent,
  OperationsRunResult,
  SyntheticAdminTask,
  SyntheticClinicData,
  SyntheticStaffMember
} from "./types.js";
import { validateClinicData } from "./validation.js";

function makeAuditEvent(index: number, actor: string, action: string, taskId: string, detail: string): AuditEvent {
  return {
    id: `AUDIT-${String(index).padStart(3, "0")}`,
    at: "2026-06-09T12:00:00.000Z",
    actor,
    action,
    taskId,
    detail
  };
}

function openTaskCounts(tasks: SyntheticAdminTask[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const task of tasks) {
    if (task.assignedTo && task.status !== "completed") {
      counts.set(task.assignedTo, (counts.get(task.assignedTo) ?? 0) + 1);
    }
  }
  return counts;
}

function chooseAssignee(
  task: SyntheticAdminTask,
  staff: SyntheticStaffMember[],
  counts: Map<string, number>
): SyntheticStaffMember | undefined {
  return staff
    .filter((member) => member.role === task.requiredRole)
    .filter((member) => (counts.get(member.id) ?? 0) < member.maxOpenTasks)
    .sort((left, right) => (counts.get(left.id) ?? 0) - (counts.get(right.id) ?? 0))[0];
}

function connectorPayloadFor(task: SyntheticAdminTask): AdminConnectorPayload {
  if (task.type === "message_callback") {
    return {
      connector: "mock_sms",
      operation: "queue_admin_callback_notice",
      dryRun: true,
      externalReference: task.id,
      payload: {
        taskId: task.id,
        messageKind: "admin_callback",
        containsClinicalContent: false
      }
    };
  }

  if (task.type === "document_request") {
    return {
      connector: "mock_email",
      operation: "send_admin_document_request",
      dryRun: true,
      externalReference: task.id,
      payload: {
        taskId: task.id,
        template: "admin_document_request",
        containsClinicalContent: false
      }
    };
  }

  return {
    connector: "mock_ehr_admin",
    operation: "sync_admin_task_status",
    dryRun: true,
    externalReference: task.id,
    payload: {
      taskId: task.id,
      status: task.status,
      assignedTo: task.assignedTo ?? null,
      clinicalAction: false
    }
  };
}

export function runOperationsWorkflow(clinic: SyntheticClinicData): OperationsRunResult {
  const validation = validateClinicData(clinic);
  if (!validation.valid) {
    throw new Error(validation.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; "));
  }

  const taskUpdates = clinic.tasks.map((task) => ({ ...task, adminNotes: [...task.adminNotes] }));
  const counts = openTaskCounts(taskUpdates);
  const auditLog: AuditEvent[] = [];

  taskUpdates.forEach((task) => {
    if (task.status === "queued") {
      const assignee = chooseAssignee(task, clinic.staff, counts);
      if (assignee) {
        task.assignedTo = assignee.id;
        task.status = task.needsApproval ? "waiting_approval" : "assigned";
        counts.set(assignee.id, (counts.get(assignee.id) ?? 0) + 1);
        auditLog.push(
          makeAuditEvent(
            auditLog.length + 1,
            "operations-agent",
            "assign_admin_task",
            task.id,
            `Assigned to ${assignee.displayName} for ${task.requiredRole} admin handling`
          )
        );
      }
    }

    if (task.status === "waiting_approval" && task.assignedTo) {
      auditLog.push(
        makeAuditEvent(
          auditLog.length + 1,
          "operations-agent",
          "request_admin_approval",
          task.id,
          "Prepared admin-only approval record for human operations review"
        )
      );
    }
  });

  const approvals = taskUpdates.filter((task) => task.status === "waiting_approval");
  const connectorPayloads = taskUpdates.map(connectorPayloadFor);

  return {
    clinicId: clinic.clinicId,
    generatedAt: "2026-06-09T12:00:00.000Z",
    taskUpdates,
    approvals,
    auditLog,
    connectorPayloads,
    disclaimer: fullDisclaimer()
  };
}
