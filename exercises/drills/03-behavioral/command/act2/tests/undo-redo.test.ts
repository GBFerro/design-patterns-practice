import assert from "node:assert/strict";
import { test } from "node:test";

import { createPanel } from "#exercise";

test("undo reverses the most recent action", () => {
  const panel = createPanel();
  panel.run({ type: "move-focuser", deltaMicrons: 100 });
  panel.undo();
  assert.equal(panel.focuserPosition, 0);
});

test("undo restores the previous filter slot, not slot 1", () => {
  const panel = createPanel();
  panel.run({ type: "rotate-wheel", toSlot: 3 });
  panel.run({ type: "rotate-wheel", toSlot: 5 });
  panel.undo();
  assert.equal(panel.filterSlot, 3);
});

test("redo re-applies an undone action", () => {
  const panel = createPanel();
  panel.run({ type: "move-focuser", deltaMicrons: 100 });
  panel.undo();
  panel.redo();
  assert.equal(panel.focuserPosition, 100);
});

test("a new action after an undo clears the redo stack", () => {
  const panel = createPanel();
  panel.run({ type: "move-focuser", deltaMicrons: 100 });
  panel.undo();
  panel.run({ type: "move-focuser", deltaMicrons: 10 });
  assert.throws(() => panel.redo(), /nothing to redo/i);
});

test("undo with nothing to undo throws, and leaves state untouched", () => {
  const panel = createPanel();
  assert.throws(() => panel.undo(), /nothing to undo/i);
  assert.equal(panel.focuserPosition, 0);
});

test("a macro runs every sub-action, in order", () => {
  const panel = createPanel();
  panel.run({
    type: "macro",
    actions: [
      { type: "move-focuser", deltaMicrons: 50 },
      { type: "rotate-wheel", toSlot: 2 },
    ],
  });
  assert.equal(panel.focuserPosition, 50);
  assert.equal(panel.filterSlot, 2);
});

test("a macro is one entry in history, not one per sub-action", () => {
  const panel = createPanel();
  panel.run({
    type: "macro",
    actions: [
      { type: "move-focuser", deltaMicrons: 50 },
      { type: "rotate-wheel", toSlot: 2 },
    ],
  });
  assert.equal(panel.history.length, 1);
});

test("undoing a macro reverses every sub-action, in reverse order, as one undo", () => {
  const panel = createPanel();
  panel.run({ type: "rotate-wheel", toSlot: 4 });
  panel.run({
    type: "macro",
    actions: [
      { type: "move-focuser", deltaMicrons: 50 },
      { type: "rotate-wheel", toSlot: 2 },
    ],
  });
  panel.undo();
  assert.equal(panel.focuserPosition, 0);
  assert.equal(panel.filterSlot, 4, "undo must restore the slot from before the macro, not slot 1");
});

test("a macro nested inside a macro still undoes as one unit", () => {
  const panel = createPanel();
  panel.run({
    type: "macro",
    actions: [
      { type: "move-focuser", deltaMicrons: 10 },
      { type: "macro", actions: [{ type: "rotate-wheel", toSlot: 6 }] },
    ],
  });
  assert.equal(panel.history.length, 1);
  panel.undo();
  assert.equal(panel.focuserPosition, 0);
  assert.equal(panel.filterSlot, 1);
});
