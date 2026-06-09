import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runOperationsWorkflow } from "./operations.js";
import { syntheticClinic } from "./seed.js";

describe("admin operations workflow", () => {
  it("assigns queued admin tasks to matching synthetic staff roles", () => {
    const result = runOperationsWorkflow(syntheticClinic);
    const task = result.taskUpdates.find((candidate) => candidate.id === "TASK-001");
    assert.ok(task);
    assert.equal(task.assignedTo, "STAFF-001");
    assert.equal(task.status, "assigned");
  });

  it("queues approval records for human admin review", () => {
    const result = runOperationsWorkflow(syntheticClinic);
    assert.deepEqual(
      result.approvals.map((task) => task.id).sort(),
      ["TASK-002", "TASK-003"]
    );
    assert.equal(result.auditLog.some((event) => event.action === "request_admin_approval"), true);
  });

  it("creates dry-run connector payloads only", () => {
    const result = runOperationsWorkflow(syntheticClinic);
    assert.equal(result.connectorPayloads.length, syntheticClinic.tasks.length);
    assert.equal(result.connectorPayloads.every((payload) => payload.dryRun === true), true);
    assert.equal(result.connectorPayloads.every((payload) => payload.payload.clinicalAction !== true), true);
  });
});
