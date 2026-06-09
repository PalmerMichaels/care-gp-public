import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { routeIntake } from "./router.js";
import { syntheticIntakes } from "./seed.js";

function caseById(id: string) {
  const intake = syntheticIntakes.find((candidate) => candidate.id === id);
  assert.ok(intake, `missing seed case ${id}`);
  return intake;
}

describe("clean-room routing engine", () => {
  it("routes synthetic safety flags to the emergency prompt", () => {
    const result = routeIntake(caseById("SYN-003"));
    assert.equal(result.acuity, "emergency_prompt");
    assert.match(result.disclaimer, /not medical advice/i);
    assert.equal(result.rationale.some((item) => item.includes("chest pain")), true);
  });

  it("routes higher-severity synthetic intake to same-day GP preparation", () => {
    const result = routeIntake(caseById("SYN-002"));
    assert.equal(result.acuity, "same_day_gp");
    assert.match(result.label, /Higher-priority/);
  });

  it("routes administrative requests without creating clinical advice", () => {
    const result = routeIntake(caseById("SYN-004"));
    assert.equal(result.acuity, "admin_review");
    assert.match(result.disclaimer, /not medical advice/i);
  });
});
