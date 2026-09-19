import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { currentMode, planNextPick, recordPicked, resetPickingPolicy } from "#exercise";
import type { Order } from "#exercise";

beforeEach(() => {
  resetPickingPolicy();
});

function order(id: string, binId: string, queuedAt: number): Order {
  return { id, binId, queuedAt };
}

const batch = [order("o1", "bin-a", 1), order("o2", "bin-a", 2), order("o3", "bin-b", 3)];

test("escalates to surge once three orders outside the batch pile up", () => {
  planNextPick(batch); // enters batch mode; batchOrderIds = {o1, o2, o3}
  const waiting = [
    order("o4", "bin-c", 4),
    order("o5", "bin-c", 5),
    order("o6", "bin-d", 6),
  ];

  const instruction = planNextPick([...batch, ...waiting]);
  assert.equal(currentMode(), "surge");
  assert.equal(instruction.urgent, true);
  assert.equal(instruction.binId, "bin-c");
  assert.deepEqual([...instruction.orderIds].sort(), ["o4", "o5"]);
});

test("outside a surge, urgent is not set", () => {
  const instruction = planNextPick([order("o1", "bin-a", 1)]);
  assert.notEqual(instruction.urgent, true);
});

test("a surging picker works through the whole waiting group, oldest bin first", () => {
  planNextPick(batch);
  const waiting = [
    order("o4", "bin-c", 4),
    order("o5", "bin-c", 5),
    order("o6", "bin-d", 6),
  ];
  planNextPick([...batch, ...waiting]); // escalates, returns o4/o5 (bin-c)

  recordPicked("o4");
  recordPicked("o5");

  const next = planNextPick([...batch, order("o6", "bin-d", 6)]);
  assert.equal(currentMode(), "surge");
  assert.equal(next.urgent, true);
  assert.deepEqual(next.orderIds, ["o6"]);
});

test("falls back to batch mode, never straight to individual, once the surge clears", () => {
  planNextPick(batch);
  const waiting = [
    order("o4", "bin-c", 4),
    order("o5", "bin-c", 5),
    order("o6", "bin-d", 6),
  ];
  planNextPick([...batch, ...waiting]);

  recordPicked("o4");
  recordPicked("o5");
  recordPicked("o6");

  assert.equal(currentMode(), "batch");

  const resumed = planNextPick(batch);
  assert.equal(resumed.mode, "batch");
  assert.notEqual(resumed.urgent, true);
  assert.deepEqual([...resumed.orderIds].sort(), ["o1", "o2"]);
});

test("the suspended batch does not lose members while a surge is in progress", () => {
  planNextPick(batch);
  const waiting = [
    order("o4", "bin-c", 4),
    order("o5", "bin-c", 5),
    order("o6", "bin-d", 6),
  ];
  planNextPick([...batch, ...waiting]);

  // o1 belongs to the suspended batch, not the active surge group - recording it
  // while surging must not be able to shrink the surge group it isn't part of.
  recordPicked("o1");
  assert.equal(currentMode(), "surge");
});
