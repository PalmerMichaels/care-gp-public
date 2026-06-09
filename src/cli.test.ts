import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderConnectors, renderDemo, renderList, runCli } from "./cli.js";

describe("CLI rendering", () => {
  it("renders clean-room and admin-only notices in demo output", () => {
    const output = renderDemo();
    assert.match(output, /Clean-room notice/);
    assert.match(output, /Admin-only notice/);
    assert.match(output, /Admin boundary notice/);
    assert.match(output, /Operations run/);
  });

  it("lists synthetic admin operations tasks", () => {
    const output = renderList();
    assert.match(output, /Synthetic operations workspace/);
    assert.match(output, /TASK-001/);
  });

  it("prints mocked connector dry-run payloads", () => {
    const output = renderConnectors();
    assert.match(output, /mock_ehr_admin/);
    assert.match(output, /dryRun/);
  });

  it("returns a non-zero exit code for unknown commands", () => {
    const messages: string[] = [];
    const code = runCli(["unknown"], {
      write: (message) => messages.push(message),
      error: (message) => messages.push(message)
    });

    assert.equal(code, 1);
    assert.match(messages.join("\n"), /Unknown command/);
  });
});
