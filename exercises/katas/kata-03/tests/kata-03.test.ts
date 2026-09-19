import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { runCommand, replayBatch, undoLast } from "#exercise";
import type { RobotState } from "#exercise";

function state(overrides: Partial<RobotState> = {}): RobotState {
  return { x: 5, y: 5, holding: null, ...overrides };
}

describe("runCommand", () => {
  it("moves in each of the four directions", () => {
    assert.deepEqual(runCommand(state(), { kind: "move", direction: "north" }), state({ y: 4 }));
    assert.deepEqual(runCommand(state(), { kind: "move", direction: "south" }), state({ y: 6 }));
    assert.deepEqual(runCommand(state(), { kind: "move", direction: "east" }), state({ x: 6 }));
    assert.deepEqual(runCommand(state(), { kind: "move", direction: "west" }), state({ x: 4 }));
  });

  it("refuses a move that would leave the grid", () => {
    assert.throws(() => runCommand(state({ x: 9 }), { kind: "move", direction: "east" }));
    assert.throws(() => runCommand(state({ x: 0 }), { kind: "move", direction: "west" }));
    assert.throws(() => runCommand(state({ y: 9 }), { kind: "move", direction: "south" }));
    assert.throws(() => runCommand(state({ y: 0 }), { kind: "move", direction: "north" }));
  });

  it("picks up an item when not already holding one", () => {
    const next = runCommand(state(), { kind: "pickUp", itemId: "crate-1" });
    assert.equal(next.holding, "crate-1");
  });

  it("refuses to pick up a second item while already holding one", () => {
    assert.throws(() => runCommand(state({ holding: "crate-1" }), { kind: "pickUp", itemId: "crate-2" }));
  });

  it("drops off whatever is held", () => {
    const next = runCommand(state({ holding: "crate-1" }), { kind: "dropOff" });
    assert.equal(next.holding, null);
  });

  it("refuses to drop off when holding nothing", () => {
    assert.throws(() => runCommand(state({ holding: null }), { kind: "dropOff" }));
  });
});

describe("replayBatch", () => {
  it("applies every command in the batch in order", () => {
    const result = replayBatch(state(), [
      { kind: "move", direction: "north" },
      { kind: "pickUp", itemId: "crate-1" },
      { kind: "move", direction: "east" },
      { kind: "dropOff" },
    ]);
    assert.equal(result.failure, null);
    assert.deepEqual(result.state, state({ x: 6, y: 4, holding: null }));
  });

  it("rolls back every command already applied when one fails mid-batch", () => {
    const start = state();
    const result = replayBatch(start, [
      { kind: "move", direction: "north" },
      { kind: "pickUp", itemId: "crate-1" },
      { kind: "pickUp", itemId: "crate-2" }, // already holding crate-1 - illegal
      { kind: "move", direction: "east" },
    ]);
    assert.notEqual(result.failure, null);
    assert.equal(result.failure?.failedIndex, 2);
    assert.deepEqual(result.state, start);
  });

  it("reports the index and reason of the failing command", () => {
    const result = replayBatch(state({ x: 9 }), [{ kind: "move", direction: "east" }]);
    assert.equal(result.failure?.failedIndex, 0);
    assert.match(result.failure?.reason ?? "", /leave the grid/);
  });

  it("rolls back a batch that fails on its very first command", () => {
    const start = state({ holding: null });
    const result = replayBatch(start, [{ kind: "dropOff" }]);
    assert.notEqual(result.failure, null);
    assert.deepEqual(result.state, start);
  });

  it("rolls back a longer batch that fails near the end", () => {
    const start = state();
    const result = replayBatch(start, [
      { kind: "move", direction: "north" },
      { kind: "move", direction: "north" },
      { kind: "pickUp", itemId: "crate-1" },
      { kind: "move", direction: "west" },
      { kind: "dropOff" },
      { kind: "dropOff" }, // nothing held - illegal
    ]);
    assert.notEqual(result.failure, null);
    assert.equal(result.failure?.failedIndex, 5);
    assert.deepEqual(result.state, start);
  });
});

describe("undoLast", () => {
  it("undoes a move by moving back", () => {
    const before = state();
    const after = runCommand(before, { kind: "move", direction: "north" });
    const undone = undoLast(after, { kind: "move", direction: "north" }, before.holding);
    assert.deepEqual(undone, before);
  });

  it("undoes a pickUp by dropping the item back off", () => {
    const before = state();
    const after = runCommand(before, { kind: "pickUp", itemId: "crate-1" });
    const undone = undoLast(after, { kind: "pickUp", itemId: "crate-1" }, before.holding);
    assert.deepEqual(undone, before);
  });

  it("undoes a dropOff by picking the same item back up", () => {
    const before = state({ holding: "crate-1" });
    const after = runCommand(before, { kind: "dropOff" });
    const undone = undoLast(after, { kind: "dropOff" }, before.holding);
    assert.deepEqual(undone, before);
  });
});
