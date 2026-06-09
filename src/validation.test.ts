import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { syntheticClinic } from "./seed.js";
import { validateClinicData } from "./validation.js";

describe("synthetic operations validation", () => {
  it("accepts bundled synthetic clinic operations data", () => {
    const result = validateClinicData(syntheticClinic);
    assert.equal(result.valid, true, JSON.stringify(result.issues));
  });

  it("rejects duplicate synthetic staff ids", () => {
    const invalid = {
      ...syntheticClinic,
      staff: [syntheticClinic.staff[0], syntheticClinic.staff[0]]
    };
    const result = validateClinicData(invalid);
    assert.equal(result.valid, false);
    assert.equal(result.issues.some((issue) => issue.path === "staff[1].id"), true);
  });

  it("rejects clinical or patient-care terms in admin task text", () => {
    const invalid = {
      ...syntheticClinic,
      tasks: [
        {
          ...syntheticClinic.tasks[0]!,
          title: "Triage patient symptoms"
        }
      ]
    };
    const result = validateClinicData(invalid);
    assert.equal(result.valid, false);
    assert.equal(result.issues.some((issue) => issue.message.includes("triage")), true);
  });
});
