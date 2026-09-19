import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { runCommand, replayBatch } from "#exercise";
import type { RobotState } from "#exercise";

function state(overrides: Partial<RobotState> = {}): RobotState {
  return { x: 5, y: 5, holding: null, ...overrides };
}

describe("contraband needs the inspection zone", () => {
  it("allows picking up contraband inside the inspection zone", () => {
    const next = runCommand(state({ x: 8, y: 8 }), {
      kind: "pickUp",
      itemId: "contraband",
    });
    assert.equal(next.holding, "contraband");
  });

  it("allows picking up contraband anywhere inside the zone, not just its corner", () => {
    const next = runCommand(state({ x: 9, y: 9 }), {
      kind: "pickUp",
      itemId: "contraband",
    });
    assert.equal(next.holding, "contraband");
  });

  it("refuses picking up contraband outside the inspection zone", () => {
    assert.throws(() =>
      runCommand(state({ x: 5, y: 5 }), { kind: "pickUp", itemId: "contraband" }),
    );
  });

  it("refuses contraband when only one of x or y is inside the zone", () => {
    assert.throws(() =>
      runCommand(state({ x: 8, y: 7 }), { kind: "pickUp", itemId: "contraband" }),
    );
    assert.throws(() =>
      runCommand(state({ x: 7, y: 8 }), { kind: "pickUp", itemId: "contraband" }),
    );
  });

  it("leaves ordinary items unaffected outside the inspection zone", () => {
    const next = runCommand(state({ x: 0, y: 0 }), { kind: "pickUp", itemId: "crate-1" });
    assert.equal(next.holding, "crate-1");
  });

  it("rolls back a batch that fails because contraband was picked up outside the zone", () => {
    const start = state({ x: 5, y: 5 });
    const result = replayBatch(start, [
      { kind: "move", direction: "east" },
      { kind: "pickUp", itemId: "contraband" },
    ]);
    assert.notEqual(result.failure, null);
    assert.equal(result.failure?.failedIndex, 1);
    assert.deepEqual(result.state, start);
  });
});
