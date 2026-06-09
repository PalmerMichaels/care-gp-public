import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderDemo, renderList, runCli } from "./cli.js";

describe("CLI rendering", () => {
  it("renders clean-room and non-regulated notices in demo output", () => {
    const output = renderDemo("SYN-001");
    assert.match(output, /Clean-room notice/);
    assert.match(output, /Non-regulated notice/);
    assert.match(output, /Recommended non-clinical route/);
  });

  it("lists synthetic seed intakes", () => {
    const output = renderList();
    assert.match(output, /SYN-001/);
    assert.match(output, /Synthetic seed intakes/);
  });

  it("returns a non-zero exit code for unknown cases", () => {
    const messages: string[] = [];
    const code = runCli(["demo", "SYN-999"], {
      write: (message) => messages.push(message),
      error: (message) => messages.push(message)
    });

    assert.equal(code, 1);
    assert.match(messages.join("\n"), /Unknown synthetic intake id/);
  });
});
