import assert from "node:assert/strict";
import { test } from "node:test";

import { createPanel } from "#exercise";

// Guards against the starting values changing silently - every other test
// assumes these.
test("a new panel starts at focuser 0, filter slot 1, empty history", () => {
  const panel = createPanel();
  assert.equal(panel.focuserPosition, 0);
  assert.equal(panel.filterSlot, 1);
  assert.deepEqual(panel.history, []);
});

// Guards against the two action kinds being dispatched to the wrong field.
test("move-focuser changes the focuser position, not the filter slot", () => {
  const panel = createPanel();
  panel.run({ type: "move-focuser", deltaMicrons: 150 });
  assert.equal(panel.focuserPosition, 150);
  assert.equal(panel.filterSlot, 1);
});

test("rotate-wheel changes the filter slot, not the focuser position", () => {
  const panel = createPanel();
  panel.run({ type: "rotate-wheel", toSlot: 4 });
  assert.equal(panel.filterSlot, 4);
  assert.equal(panel.focuserPosition, 0);
});

// Guards against move-focuser overwriting instead of accumulating - the most
// likely mistake when collapsing several calls into one state object.
test("move-focuser accumulates across several calls", () => {
  const panel = createPanel();
  panel.run({ type: "move-focuser", deltaMicrons: 100 });
  panel.run({ type: "move-focuser", deltaMicrons: -30 });
  assert.equal(panel.focuserPosition, 70);
});

// Guards against a negative delta being rejected or clamped - there is no
// rule against racking the focuser inward.
test("move-focuser accepts a negative delta", () => {
  const panel = createPanel();
  panel.run({ type: "move-focuser", deltaMicrons: -40 });
  assert.equal(panel.focuserPosition, -40);
});

// Guards against the history recording the action in the wrong order, or
// losing one.
test("history records every action, in order, with its argument", () => {
  const panel = createPanel();
  panel.run({ type: "move-focuser", deltaMicrons: 50 });
  panel.run({ type: "rotate-wheel", toSlot: 3 });
  panel.run({ type: "move-focuser", deltaMicrons: -10 });
  assert.deepEqual(panel.history, [
    "move-focuser(50)",
    "rotate-wheel(3)",
    "move-focuser(-10)",
  ]);
});

// Guards against two panels sharing state through a module-level variable,
// which would make every other test here flaky depending on run order.
test("two panels do not share state", () => {
  const first = createPanel();
  const second = createPanel();
  first.run({ type: "move-focuser", deltaMicrons: 200 });
  assert.equal(second.focuserPosition, 0);
});
