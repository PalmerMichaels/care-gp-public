import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { syntheticIntakes } from "./seed.js";
import { validateAllIntakes, validateIntake } from "./validation.js";

describe("synthetic intake validation", () => {
  it("accepts all bundled synthetic seed data", () => {
    const result = validateAllIntakes(syntheticIntakes);
    assert.equal(result.valid, true, JSON.stringify(result.issues));
  });

  it("rejects missing concerns and invalid severity", () => {
    const invalid = {
      ...syntheticIntakes[0]!,
      id: "BAD-001",
      concerns: [],
      severity: 11
    };

    const result = validateIntake(invalid);
    assert.equal(result.valid, false);
    assert.deepEqual(
      result.issues.map((issue) => issue.path).sort(),
      ["concerns", "severity"]
    );
  });

  it("rejects duplicate synthetic intake ids", () => {
    const result = validateAllIntakes([syntheticIntakes[0], syntheticIntakes[0]]);
    assert.equal(result.valid, false);
    assert.equal(result.issues.some((issue) => issue.message === "must be unique"), true);
  });
});
